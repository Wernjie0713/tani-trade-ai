from functools import lru_cache

import httpx
from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

from app.core.config import get_settings


@lru_cache
def get_supabase_client() -> Client | None:
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_server_key:
        return None

    http_client = httpx.Client(
        timeout=httpx.Timeout(30.0, connect=10.0),
        follow_redirects=True,
        http2=False,
    )

    return create_client(
        settings.supabase_url,
        settings.supabase_server_key,
        options=SyncClientOptions(
            postgrest_client_timeout=httpx.Timeout(30.0, connect=10.0),
            httpx_client=http_client,
        ),
    )
