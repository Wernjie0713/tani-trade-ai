from __future__ import annotations

from math import asin, cos, radians, sin, sqrt


def haversine_km(lat_a: float, lon_a: float, lat_b: float, lon_b: float) -> float:
    earth_radius_km = 6371
    d_lat = radians(lat_b - lat_a)
    d_lon = radians(lon_b - lon_a)
    start_lat = radians(lat_a)
    end_lat = radians(lat_b)

    haversine = (
        sin(d_lat / 2) ** 2
        + cos(start_lat) * cos(end_lat) * sin(d_lon / 2) ** 2
    )
    return earth_radius_km * 2 * asin(sqrt(haversine))


def distance_score(distance_km: float, radius_km: float) -> int:
    if distance_km > radius_km:
        return 0

    ratio = max(0.0, 1 - (distance_km / max(radius_km, 1)))
    return int(round(ratio * 15))


def trust_score(trust_rating: float) -> int:
    bounded = max(0.0, min(trust_rating, 5.0))
    return int(round((bounded / 5.0) * 10))


def total_match_score(
    exact_need_match: bool,
    reciprocal_need_match: bool,
    distance_points: int,
    trust_points: int,
) -> tuple[int, int, int]:
    exact_need_points = 50 if exact_need_match else 0
    reciprocal_points = 25 if reciprocal_need_match else 0
    total = exact_need_points + reciprocal_points + distance_points + trust_points
    return total, exact_need_points, reciprocal_points
