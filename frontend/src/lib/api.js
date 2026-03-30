const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api/v1"
).replace(/\/$/, "")

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const contentType = response.headers.get("content-type") || ""
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const detail = typeof payload === "object" && payload !== null
      ? payload.detail || response.statusText
      : payload || response.statusText
    throw new ApiError(detail || "Request failed.", response.status, payload)
  }

  return payload
}

export { API_BASE_URL }
