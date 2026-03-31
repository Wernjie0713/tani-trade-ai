from __future__ import annotations

import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_DIR.parent

sys.path.insert(0, str(BACKEND_DIR))

from app.db.firebase import get_firestore_client  # noqa: E402
from seed_expansion import expand_seed_data  # noqa: E402


def main() -> int:
    client = get_firestore_client()
    if client is None:
        print(
            "Firebase is not configured. Set FIREBASE_PROJECT_ID and either "
            "FIREBASE_CREDENTIALS_PATH or FIREBASE_SERVICE_ACCOUNT_JSON first.",
        )
        return 1

    seed_path = REPO_ROOT / "firebase" / "seed_data.json"
    seed_data = expand_seed_data(json.loads(seed_path.read_text(encoding="utf-8")))

    total = 0
    for collection_name, documents in seed_data.items():
        collection = client.collection(collection_name)
        for document in documents:
            collection.document(document["id"]).set(document)
            total += 1
        print(f"Seeded {len(documents)} docs into {collection_name}")

    print(f"Done. Upserted {total} documents into Firestore.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
