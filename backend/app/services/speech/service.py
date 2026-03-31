from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

from google.api_core.exceptions import GoogleAPICallError, InvalidArgument
from google.cloud.speech_v2.types import cloud_speech

from app.schemas.farmer_flow import SpeechTranscriptionResponse

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class SpeechTranscriptionResult:
    transcript: str
    language_code: str
    confidence: float | None
    provider: str = "google_speech_v2"

    def to_response(self) -> SpeechTranscriptionResponse:
        return SpeechTranscriptionResponse(
            transcript=self.transcript,
            language_code=self.language_code,
            confidence=self.confidence,
            provider=self.provider,
        )


class SpeechTranscriptionServiceError(Exception):
    def __init__(self, message: str, status_code: int) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class SpeechTranscriptionService:
    def __init__(
        self,
        *,
        client: Any,
        project_id: str,
        language_codes: list[str],
        model: str,
        max_audio_seconds: int,
        max_audio_bytes: int,
        debug_logging: bool = False,
    ) -> None:
        self.client = client
        self.project_id = project_id
        self.language_codes = language_codes
        self.model = model
        self.max_audio_seconds = max_audio_seconds
        self.max_audio_bytes = max_audio_bytes
        self.debug_logging = debug_logging

    def transcribe_audio(
        self,
        audio_bytes: bytes,
        *,
        filename: str | None = None,
        content_type: str | None = None,
    ) -> SpeechTranscriptionResponse:
        if not audio_bytes:
            raise SpeechTranscriptionServiceError("Audio file is empty.", 400)

        if len(audio_bytes) > self.max_audio_bytes:
            raise SpeechTranscriptionServiceError(
                f"Audio file exceeds the {self.max_audio_bytes} byte limit.",
                400,
            )

        if self.debug_logging:
            logger.info(
                "[Speech] transcription started filename=%s content_type=%s bytes=%s languages=%s model=%s",
                filename or "unknown",
                content_type or "unknown",
                len(audio_bytes),
                ",".join(self.language_codes),
                self.model,
            )

        request = cloud_speech.RecognizeRequest(
            recognizer=f"projects/{self.project_id}/locations/global/recognizers/_",
            config=cloud_speech.RecognitionConfig(
                auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
                language_codes=self.language_codes,
                model=self.model,
                features=cloud_speech.RecognitionFeatures(
                    enable_automatic_punctuation=True,
                ),
            ),
            content=audio_bytes,
        )

        try:
            response = self.client.recognize(request=request)
        except InvalidArgument as exc:
            logger.warning("[Speech] transcription failed invalid_audio=%s", exc)
            raise SpeechTranscriptionServiceError(
                "Google Speech-to-Text could not process this audio.",
                400,
            ) from exc
        except GoogleAPICallError as exc:
            logger.warning("[Speech] transcription failed upstream=%s", exc)
            raise SpeechTranscriptionServiceError(
                "Google Speech-to-Text transcription failed.",
                502,
            ) from exc

        transcript_parts: list[str] = []
        confidence: float | None = None
        language_code: str | None = None
        for result in getattr(response, "results", []):
            alternatives = getattr(result, "alternatives", [])
            if not alternatives:
                continue
            top_alternative = alternatives[0]
            if getattr(top_alternative, "transcript", "").strip():
                transcript_parts.append(top_alternative.transcript.strip())
            if confidence is None and hasattr(top_alternative, "confidence"):
                candidate_confidence = getattr(top_alternative, "confidence", None)
                confidence = float(candidate_confidence) if candidate_confidence is not None else None
            if language_code is None and getattr(result, "language_code", None):
                language_code = result.language_code

        transcript = " ".join(part for part in transcript_parts if part).strip()
        if not transcript:
            logger.warning("[Speech] transcription failed no_speech_detected")
            raise SpeechTranscriptionServiceError(
                "No speech was detected in the recording. Try again.",
                400,
            )

        resolved_language = language_code or self.language_codes[0]
        if self.debug_logging:
            logger.info(
                "[Speech] transcription succeeded language=%s confidence=%s transcript_chars=%s",
                resolved_language,
                confidence,
                len(transcript),
            )

        return SpeechTranscriptionResult(
            transcript=transcript,
            language_code=resolved_language,
            confidence=confidence,
        ).to_response()
