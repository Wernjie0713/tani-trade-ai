from __future__ import annotations

import unittest
from types import SimpleNamespace

from fastapi.testclient import TestClient

from app.api.deps import get_settings, get_speech_transcription_service
from app.main import app
from app.services.speech import SpeechTranscriptionService, SpeechTranscriptionServiceError


class FakeSpeechClient:
    def __init__(self, response=None, error: Exception | None = None) -> None:
        self.response = response
        self.error = error
        self.calls: list[object] = []

    def recognize(self, request):
        self.calls.append(request)
        if self.error is not None:
            raise self.error
        return self.response


class SpeechServiceTests(unittest.TestCase):
    def test_transcribe_audio_returns_transcript(self) -> None:
        service = SpeechTranscriptionService(
            client=FakeSpeechClient(
                response=SimpleNamespace(
                    results=[
                        SimpleNamespace(
                            language_code="en-US",
                            alternatives=[
                                SimpleNamespace(
                                    transcript="I have fertilizer and need organic pesticide.",
                                    confidence=0.91,
                                ),
                            ],
                        ),
                    ],
                )
            ),
            project_id="tani-trade-ai",
            language_codes=["en-US"],
            model="latest_short",
            max_audio_seconds=30,
            max_audio_bytes=10_000_000,
        )

        result = service.transcribe_audio(b"audio-bytes", filename="voice.webm", content_type="audio/webm")

        self.assertEqual(result.transcript, "I have fertilizer and need organic pesticide.")
        self.assertEqual(result.language_code, "en-US")
        self.assertEqual(result.provider, "google_speech_v2")

    def test_transcribe_audio_rejects_empty_audio(self) -> None:
        service = SpeechTranscriptionService(
            client=FakeSpeechClient(response=SimpleNamespace(results=[])),
            project_id="tani-trade-ai",
            language_codes=["en-US"],
            model="latest_short",
            max_audio_seconds=30,
            max_audio_bytes=10_000_000,
        )

        with self.assertRaises(SpeechTranscriptionServiceError) as context:
            service.transcribe_audio(b"")

        self.assertEqual(context.exception.status_code, 400)

    def test_transcribe_audio_rejects_oversized_audio(self) -> None:
        service = SpeechTranscriptionService(
            client=FakeSpeechClient(response=SimpleNamespace(results=[])),
            project_id="tani-trade-ai",
            language_codes=["en-US"],
            model="latest_short",
            max_audio_seconds=30,
            max_audio_bytes=4,
        )

        with self.assertRaises(SpeechTranscriptionServiceError) as context:
            service.transcribe_audio(b"too-large")

        self.assertEqual(context.exception.status_code, 400)


class FakeRouteSpeechService:
    def __init__(self, response=None, error: SpeechTranscriptionServiceError | None = None) -> None:
        self.response = response
        self.error = error

    def transcribe_audio(self, *_args, **_kwargs):
        if self.error is not None:
            raise self.error
        return self.response


class SpeechRouteTests(unittest.TestCase):
    def tearDown(self) -> None:
        app.dependency_overrides.clear()

    def test_transcription_route_returns_transcript(self) -> None:
        app.dependency_overrides[get_speech_transcription_service] = lambda: FakeRouteSpeechService(
            response=SimpleNamespace(
                transcript="I have 5 bags of fertilizer.",
                language_code="en-US",
                confidence=0.87,
                provider="google_speech_v2",
            )
        )
        client = TestClient(app)

        response = client.post(
            "/api/v1/farmer/speech/transcriptions",
            files={"audio": ("voice.webm", b"fake-audio", "audio/webm")},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["transcript"], "I have 5 bags of fertilizer.")

    def test_transcription_route_returns_400_for_empty_audio(self) -> None:
        app.dependency_overrides[get_speech_transcription_service] = lambda: FakeRouteSpeechService(
            response=SimpleNamespace(
                transcript="unused",
                language_code="en-US",
                confidence=0.5,
                provider="google_speech_v2",
            )
        )
        client = TestClient(app)

        response = client.post(
            "/api/v1/farmer/speech/transcriptions",
            files={"audio": ("voice.webm", b"", "audio/webm")},
        )

        self.assertEqual(response.status_code, 400)

    def test_transcription_route_returns_502_for_provider_failures(self) -> None:
        app.dependency_overrides[get_speech_transcription_service] = lambda: FakeRouteSpeechService(
            error=SpeechTranscriptionServiceError("Google Speech-to-Text transcription failed.", 502)
        )
        client = TestClient(app)

        response = client.post(
            "/api/v1/farmer/speech/transcriptions",
            files={"audio": ("voice.webm", b"fake-audio", "audio/webm")},
        )

        self.assertEqual(response.status_code, 502)

    def test_transcription_route_returns_503_when_config_missing(self) -> None:
        settings = get_settings().model_copy(
            update={
                "google_cloud_project_id": "",
                "firebase_project_id": "",
                "firebase_credentials_path": "",
                "firebase_service_account_json": "",
            }
        )
        app.dependency_overrides[get_settings] = lambda: settings
        client = TestClient(app)

        response = client.post(
            "/api/v1/farmer/speech/transcriptions",
            files={"audio": ("voice.webm", b"fake-audio", "audio/webm")},
        )

        self.assertEqual(response.status_code, 503)


if __name__ == "__main__":
    unittest.main()
