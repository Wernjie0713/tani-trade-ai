from __future__ import annotations

from dataclasses import dataclass
import json
import logging
import re
from typing import Any

import httpx
from google import genai
from google.genai import errors as genai_errors
from google.genai import types
from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)


class GeminiAiClientError(RuntimeError):
    """Raised when the Gemini SDK request fails or returns invalid data."""


@dataclass(slots=True)
class GeminiStructuredResult:
    parsed: BaseModel
    model_name: str | None


@dataclass(slots=True)
class GeminiTextResult:
    text: str
    model_name: str | None


class GeminiAiClient:
    def __init__(
        self,
        *,
        api_key: str,
        timeout_seconds: int,
        max_retries: int,
        debug_logging: bool = False,
    ) -> None:
        retry_attempts = max(1, max_retries + 1)
        self.debug_logging = debug_logging
        self._client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                httpx_client=httpx.Client(timeout=timeout_seconds),
                retry_options=types.HttpRetryOptions(
                    attempts=retry_attempts,
                    initial_delay=1.0,
                    max_delay=5.0,
                    exp_base=2.0,
                    jitter=0.2,
                    http_status_codes=[408, 429, 500, 502, 503, 504],
                ),
            ),
        )

    def generate_structured(
        self,
        *,
        operation: str,
        model: str,
        system_instruction: str,
        user_prompt: str,
        response_schema: type[BaseModel],
        temperature: float,
        max_output_tokens: int,
    ) -> GeminiStructuredResult:
        if self.debug_logging:
            logger.info(
                "[AI] Gemini request started operation=%s model=%s schema=%s temperature=%s max_tokens=%s",
                operation,
                model,
                response_schema.__name__,
                temperature,
                max_output_tokens,
            )
        try:
            config_kwargs: dict[str, Any] = {
                "system_instruction": system_instruction,
                "temperature": temperature,
                "max_output_tokens": max_output_tokens,
                "response_mime_type": "application/json",
                "seed": 7,
            }
            response = self._client.models.generate_content(
                model=model,
                contents=user_prompt,
                config=types.GenerateContentConfig(**config_kwargs),
            )
        except (
            genai_errors.APIError,
            genai_errors.ClientError,
            httpx.TimeoutException,
            httpx.HTTPError,
            ValueError,
        ) as exc:
            logger.warning(
                "[AI] Gemini request failed operation=%s model=%s error=%s",
                operation,
                model,
                exc,
            )
            raise GeminiAiClientError(str(exc)) from exc

        parsed = self._coerce_parsed_response(response_schema, response)
        resolved_model_name = getattr(response, "model_version", None) or model
        if self.debug_logging:
            logger.info(
                "[AI] Gemini request succeeded operation=%s model=%s schema=%s",
                operation,
                resolved_model_name,
                response_schema.__name__,
            )
        return GeminiStructuredResult(
            parsed=parsed,
            model_name=resolved_model_name,
        )

    def generate_text(
        self,
        *,
        operation: str,
        model: str,
        system_instruction: str,
        user_prompt: str,
        temperature: float,
        max_output_tokens: int,
    ) -> GeminiTextResult:
        if self.debug_logging:
            logger.info(
                "[AI] Gemini request started operation=%s model=%s mode=text temperature=%s max_tokens=%s",
                operation,
                model,
                temperature,
                max_output_tokens,
            )
        try:
            response = self._client.models.generate_content(
                model=model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature,
                    max_output_tokens=max_output_tokens,
                    seed=7,
                ),
            )
        except (
            genai_errors.APIError,
            genai_errors.ClientError,
            httpx.TimeoutException,
            httpx.HTTPError,
            ValueError,
        ) as exc:
            logger.warning(
                "[AI] Gemini request failed operation=%s model=%s error=%s",
                operation,
                model,
                exc,
            )
            raise GeminiAiClientError(str(exc)) from exc

        response_text = self._extract_text_response(response)
        resolved_model_name = getattr(response, "model_version", None) or model
        if self.debug_logging:
            logger.info(
                "[AI] Gemini request succeeded operation=%s model=%s mode=text",
                operation,
                resolved_model_name,
            )
        return GeminiTextResult(
            text=response_text,
            model_name=resolved_model_name,
        )

    def _coerce_parsed_response(
        self,
        response_schema: type[BaseModel],
        response: Any,
    ) -> BaseModel:
        parsed = getattr(response, "parsed", None)
        if isinstance(parsed, response_schema):
            return parsed

        if isinstance(parsed, BaseModel):
            return response_schema.model_validate(parsed.model_dump())

        if isinstance(parsed, dict):
            return response_schema.model_validate(parsed)

        response_text = getattr(response, "text", None)
        if response_text:
            try:
                return response_schema.model_validate_json(response_text)
            except ValidationError as exc:
                extracted_json = self._extract_json_object(response_text)
                if extracted_json is not None:
                    try:
                        return response_schema.model_validate(extracted_json)
                    except ValidationError as nested_exc:
                        raise GeminiAiClientError(
                            f"Gemini returned invalid structured JSON after extraction: {nested_exc}"
                        ) from nested_exc
                raise GeminiAiClientError(f"Gemini returned invalid structured JSON: {exc}") from exc

        raise GeminiAiClientError("Gemini returned no structured response payload.")

    def _extract_text_response(self, response: Any) -> str:
        response_text = (getattr(response, "text", "") or "").strip()
        if response_text:
            return self._clean_text_output(response_text)

        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", None) or []
            collected_parts: list[str] = []
            for part in parts:
                text_value = getattr(part, "text", None)
                if text_value:
                    collected_parts.append(text_value)
            if collected_parts:
                return self._clean_text_output("\n".join(collected_parts))

        raise GeminiAiClientError("Gemini returned no text response payload.")

    def _clean_text_output(self, text: str) -> str:
        cleaned = text.strip()
        cleaned = re.sub(r"^Here is the JSON requested:\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"^Here is the explanation:\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"^Explanation:\s*", "", cleaned, flags=re.IGNORECASE)
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip().strip('"')

    def _extract_json_object(self, response_text: str) -> dict[str, Any] | list[Any] | None:
        stripped = response_text.strip()

        fenced_match = re.search(r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```", stripped, re.DOTALL)
        if fenced_match:
            try:
                return json.loads(fenced_match.group(1))
            except json.JSONDecodeError:
                pass

        decoder = json.JSONDecoder()
        for start_char in ("{", "["):
            start_index = stripped.find(start_char)
            if start_index == -1:
                continue
            try:
                parsed, _ = decoder.raw_decode(stripped[start_index:])
                return parsed
            except json.JSONDecodeError:
                continue

        return None
