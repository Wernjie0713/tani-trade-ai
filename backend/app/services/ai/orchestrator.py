from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

from app.services.ai.client import GeminiAiClient, GeminiAiClientError
from app.services.ai.grounding import (
    build_intake_grounding,
    build_listing_grounding,
    build_proposal_grounding,
)
from app.services.ai.prompts import (
    INTAKE_PROMPT_VERSION,
    LISTING_PROMPT_VERSION,
    PROPOSAL_PROMPT_VERSION,
    build_intake_system_prompt,
    build_intake_user_prompt,
    build_listing_system_prompt,
    build_listing_user_prompt,
    build_proposal_system_prompt,
    build_proposal_user_prompt,
)
from app.services.ai.schemas import GeminiBarterItemExtraction, GeminiIntakeExtraction
from app.services.catalog import (
    UNIT_ALIASES,
    crop_label,
    find_crop_code,
    find_item_code,
    item_category,
    item_default_unit,
    item_display_name,
)
from app.services.parser import ParsedBarterItem, ParsedIntake, parse_intake

logger = logging.getLogger(__name__)

VALID_URGENCIES = {"low", "medium", "high"}


class FarmerAiOrchestratorError(RuntimeError):
    """Raised when AI generation is required but unavailable."""


@dataclass(slots=True)
class AiGenerationMetadata:
    provider: str = "gemini"
    model_name: str | None = None
    prompt_version: str = ""
    fallback_used: bool = False
    fallback_reason: str | None = None

    def to_snapshot(self) -> dict[str, Any]:
        return {
            "provider": self.provider,
            "model_name": self.model_name,
            "prompt_version": self.prompt_version,
            "fallback_used": self.fallback_used,
            "fallback_reason": self.fallback_reason,
        }


@dataclass(slots=True)
class IntakeAiResult:
    parsed_intake: ParsedIntake
    metadata: AiGenerationMetadata


@dataclass(slots=True)
class ProposalCopyResult:
    explanation: str
    metadata: AiGenerationMetadata


@dataclass(slots=True)
class ListingCopyResult:
    listing_note: str
    metadata: AiGenerationMetadata


class FarmerAiOrchestrator:
    def __init__(
        self,
        *,
        client: GeminiAiClient | None,
        primary_model: str,
        listing_model: str,
        fallback_enabled: bool,
        debug_logging: bool = False,
    ) -> None:
        self.client = client
        self.primary_model = primary_model
        self.listing_model = listing_model
        self.fallback_enabled = fallback_enabled
        self.debug_logging = debug_logging

    def extract_intake(
        self,
        *,
        raw_text: str,
        farmer_profile: dict[str, Any],
        inventory_rows: list[dict[str, Any]],
    ) -> IntakeAiResult:
        deterministic = parse_intake(raw_text)
        if self.client is None:
            return self._fallback_intake(deterministic, "Gemini API key is not configured.")

        try:
            result = self.client.generate_structured(
                operation="intake",
                model=self.primary_model,
                system_instruction=build_intake_system_prompt(),
                user_prompt=build_intake_user_prompt(
                    build_intake_grounding(raw_text, farmer_profile, inventory_rows),
                ),
                response_schema=GeminiIntakeExtraction,
                temperature=0.1,
                max_output_tokens=512,
            )
            merged = self._merge_ai_intake(result.parsed, deterministic)
            self._log_success(
                "intake",
                result.model_name,
                INTAKE_PROMPT_VERSION,
                f"crop={merged.crop_code} have={merged.have_item.normalized_name} need={merged.need_item.normalized_name}",
            )
            return IntakeAiResult(
                parsed_intake=merged,
                metadata=AiGenerationMetadata(
                    model_name=result.model_name,
                    prompt_version=INTAKE_PROMPT_VERSION,
                    fallback_used=False,
                ),
            )
        except (GeminiAiClientError, ValueError) as exc:
            return self._fallback_or_raise_intake(deterministic, str(exc))

    def generate_proposal_copy(
        self,
        *,
        request_row: dict[str, Any],
        have_item: dict[str, Any],
        need_item: dict[str, Any],
        counterparty: dict[str, Any],
        counterparty_offer: dict[str, Any],
        offered_price: dict[str, Any],
        requested_price: dict[str, Any],
        ratio_text: str,
        meeting_point: dict[str, Any],
        fallback_explanation: str,
    ) -> ProposalCopyResult:
        if self.client is None:
            return self._fallback_proposal(fallback_explanation, "Gemini API key is not configured.")

        try:
            result = self.client.generate_text(
                operation="proposal",
                model=self.primary_model,
                system_instruction=build_proposal_system_prompt(),
                user_prompt=build_proposal_user_prompt(
                    build_proposal_grounding(
                        request_row=request_row,
                        have_item=have_item,
                        need_item=need_item,
                        counterparty=counterparty,
                        counterparty_offer=counterparty_offer,
                        offered_price=offered_price,
                        requested_price=requested_price,
                        ratio_text=ratio_text,
                        meeting_point=meeting_point,
                        fallback_explanation=fallback_explanation,
                    ),
                ),
                temperature=0.3,
                max_output_tokens=240,
            )
            self._log_success(
                "proposal",
                result.model_name,
                PROPOSAL_PROMPT_VERSION,
                f"ratio={ratio_text}",
            )
            return ProposalCopyResult(
                explanation=result.text.strip(),
                metadata=AiGenerationMetadata(
                    model_name=result.model_name,
                    prompt_version=PROPOSAL_PROMPT_VERSION,
                    fallback_used=False,
                ),
            )
        except GeminiAiClientError as exc:
            return self._fallback_or_raise_proposal(fallback_explanation, str(exc))

    def generate_listing_copy(
        self,
        *,
        crop_profile: dict[str, Any],
        planting_row: dict[str, Any],
        listing_payload: dict[str, Any],
        fallback_listing_title: str,
        fallback_listing_note: str,
        fallback_soil_vitality_label: str,
        fallback_yield_probability_label: str,
    ) -> ListingCopyResult:
        if self.client is None:
            return self._fallback_listing(
                fallback_listing_note,
                "Gemini API key is not configured.",
            )

        try:
            result = self.client.generate_text(
                operation="listing",
                model=self.listing_model,
                system_instruction=build_listing_system_prompt(),
                user_prompt=build_listing_user_prompt(
                    build_listing_grounding(
                        crop_profile=crop_profile,
                        planting_row=planting_row,
                        listing_payload=listing_payload,
                        fallback_listing_title=fallback_listing_title,
                        fallback_listing_note=fallback_listing_note,
                        fallback_soil_vitality_label=fallback_soil_vitality_label,
                        fallback_yield_probability_label=fallback_yield_probability_label,
                    ),
                ),
                temperature=0.4,
                max_output_tokens=320,
            )
            listing_note = result.text.strip()
            if not listing_note:
                raise ValueError("Gemini returned an empty listing note.")
            self._log_success(
                "listing",
                result.model_name,
                LISTING_PROMPT_VERSION,
                f"crop={crop_profile['crop_code']} note_generated=true",
            )
            return ListingCopyResult(
                listing_note=listing_note,
                metadata=AiGenerationMetadata(
                    model_name=result.model_name,
                    prompt_version=LISTING_PROMPT_VERSION,
                    fallback_used=False,
                ),
            )
        except (GeminiAiClientError, ValueError) as exc:
            if isinstance(exc, ValueError) and self.debug_logging:
                logger.warning(
                    "[AI] Raw listing response preview before fallback: %s",
                    self._preview_text(result.text) if "result" in locals() else "<no response text>",
                )
            return self._fallback_or_raise_listing(
                fallback_listing_note,
                str(exc),
            )

    def _merge_ai_intake(
        self,
        ai_output: GeminiIntakeExtraction,
        deterministic: ParsedIntake,
    ) -> ParsedIntake:
        crop_code = (
            find_crop_code(ai_output.crop_code or "")
            or find_crop_code(ai_output.crop_name or "")
            or deterministic.crop_code
        )

        have_item = self._merge_item(ai_output.have_item, deterministic.have_item)
        need_item = self._merge_item(ai_output.need_item, deterministic.need_item)
        timeline_label, timeline_days = self._merge_timeline(ai_output, deterministic)
        urgency = self._normalize_urgency(ai_output.urgency) or deterministic.urgency
        radius_km = (
            round(float(ai_output.radius_km), 1)
            if ai_output.radius_km and ai_output.radius_km > 0
            else deterministic.radius_km
        )
        confidence = self._clamp_confidence(ai_output.confidence) or deterministic.confidence

        return ParsedIntake(
            raw_text=deterministic.raw_text,
            crop_code=crop_code,
            crop_label=crop_label(crop_code),
            timeline_label=timeline_label,
            timeline_days=timeline_days,
            radius_km=radius_km,
            urgency=urgency,
            confidence=confidence,
            have_item=have_item,
            need_item=need_item,
        )

    def _merge_item(
        self,
        ai_item: GeminiBarterItemExtraction | None,
        fallback_item: ParsedBarterItem,
    ) -> ParsedBarterItem:
        if ai_item is None:
            return fallback_item

        normalized_name = (
            find_item_code(ai_item.normalized_item_name or "")
            or find_item_code(ai_item.item_name or "")
            or fallback_item.normalized_name
        )
        quantity = ai_item.quantity if ai_item.quantity and ai_item.quantity > 0 else fallback_item.quantity
        raw_unit = (ai_item.unit or fallback_item.unit).strip().lower()
        unit = UNIT_ALIASES.get(raw_unit, raw_unit or item_default_unit(normalized_name))
        if not unit:
            unit = fallback_item.unit

        return ParsedBarterItem(
            normalized_name=normalized_name,
            display_name=item_display_name(normalized_name),
            category=item_category(normalized_name),
            quantity=quantity,
            unit=unit,
        )

    def _merge_timeline(
        self,
        ai_output: GeminiIntakeExtraction,
        deterministic: ParsedIntake,
    ) -> tuple[str, int]:
        if ai_output.timeline_days is not None and ai_output.timeline_days >= 0:
            label = ai_output.timeline_label.strip() if ai_output.timeline_label else deterministic.timeline_label
            return label, ai_output.timeline_days

        if ai_output.timeline_label:
            label = ai_output.timeline_label.strip()
            return label, deterministic.timeline_days

        return deterministic.timeline_label, deterministic.timeline_days

    def _normalize_urgency(self, urgency: str | None) -> str | None:
        if urgency is None:
            return None
        normalized = urgency.strip().lower()
        return normalized if normalized in VALID_URGENCIES else None

    def _clamp_confidence(self, confidence: float | None) -> float | None:
        if confidence is None:
            return None
        return round(max(0.0, min(confidence, 0.99)), 2)

    def _fallback_or_raise_intake(self, deterministic: ParsedIntake, reason: str) -> IntakeAiResult:
        if self.fallback_enabled:
            return self._fallback_intake(deterministic, reason)
        raise FarmerAiOrchestratorError(reason)

    def _fallback_intake(self, deterministic: ParsedIntake, reason: str) -> IntakeAiResult:
        self._log_fallback("intake", reason)
        return IntakeAiResult(
            parsed_intake=deterministic,
            metadata=AiGenerationMetadata(
                prompt_version=INTAKE_PROMPT_VERSION,
                fallback_used=True,
                fallback_reason=reason,
            ),
        )

    def _fallback_or_raise_proposal(self, fallback_explanation: str, reason: str) -> ProposalCopyResult:
        if self.fallback_enabled:
            return self._fallback_proposal(fallback_explanation, reason)
        raise FarmerAiOrchestratorError(reason)

    def _fallback_proposal(self, fallback_explanation: str, reason: str) -> ProposalCopyResult:
        self._log_fallback("proposal", reason)
        return ProposalCopyResult(
            explanation=fallback_explanation,
            metadata=AiGenerationMetadata(
                prompt_version=PROPOSAL_PROMPT_VERSION,
                fallback_used=True,
                fallback_reason=reason,
            ),
        )

    def _fallback_or_raise_listing(
        self,
        fallback_listing_note: str,
        reason: str,
    ) -> ListingCopyResult:
        if self.fallback_enabled:
            return self._fallback_listing(
                fallback_listing_note,
                reason,
            )
        raise FarmerAiOrchestratorError(reason)

    def _fallback_listing(
        self,
        fallback_listing_note: str,
        reason: str,
    ) -> ListingCopyResult:
        self._log_fallback("listing", reason)
        return ListingCopyResult(
            listing_note=fallback_listing_note,
            metadata=AiGenerationMetadata(
                prompt_version=LISTING_PROMPT_VERSION,
                fallback_used=True,
                fallback_reason=reason,
            ),
        )

    def _log_fallback(self, operation: str, reason: str) -> None:
        logger.warning("[AI] Falling back to deterministic %s flow: %s", operation, reason)

    def _preview_text(self, text: str, limit: int = 400) -> str:
        compact = " | ".join(line.strip() for line in text.splitlines() if line.strip())
        if len(compact) <= limit:
            return compact
        return f"{compact[:limit]}..."

    def _log_success(
        self,
        operation: str,
        model_name: str | None,
        prompt_version: str,
        summary: str,
    ) -> None:
        if self.debug_logging:
            logger.info(
                "[AI] Completed %s via Gemini model=%s prompt=%s %s",
                operation,
                model_name or "unknown",
                prompt_version,
                summary,
            )
