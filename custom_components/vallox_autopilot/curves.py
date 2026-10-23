"""Validated, bounded piecewise-linear ventilation response curves."""

from math import isfinite

# Input limits and minimum spacing; output is requested fan percentage.
CURVES = {
    "home": (20, 100, 1, "home_start", "home_full"),
    "shower": (20, 100, 1, "shower_start", "shower_full"),
    "excess": (0, 40, 1, "shower_delta_start", "shower_delta_full"),
    "co2": (400, 3000, 50, "co2_start", "co2_full"),
}
PROFILES = ("home", "away")
MAX_POINTS = 12


def validate_points(curve, profile, points):
    if curve not in CURVES or profile not in PROFILES:
        raise ValueError("Unknown response curve")
    if not isinstance(points, list) or not 2 <= len(points) <= MAX_POINTS:
        raise ValueError("Use between 2 and 12 points")
    low, high, spacing, *_ = CURVES[curve]
    previous = None
    for point in points:
        if not isinstance(point, dict) or set(point) != {"x", "y"}:
            raise ValueError("Each point must have x and y")
        x, y = point["x"], point["y"]
        if any(
            isinstance(v, bool) or not isinstance(v, (float, int)) or not isfinite(v)
            for v in (x, y)
        ):
            raise ValueError("Curve points must be finite numbers")
        if not low <= x <= high or not 10 <= y <= 100:
            raise ValueError("Curve point is outside the allowed range")
        if previous and (x - previous["x"] < spacing or y < previous["y"]):
            raise ValueError(
                "Points must increase in input and must not decrease in fan speed"
            )
        previous = point


def validate_saved(curves, revisions):
    if not isinstance(curves, dict) or not isinstance(revisions, dict):
        raise ValueError("Invalid saved curves")
    for key, profiles in curves.items():
        if key not in CURVES or not isinstance(profiles, dict):
            raise ValueError("Invalid saved curve")
        for profile, points in profiles.items():
            validate_points(key, profile, points)
    for key, revision in revisions.items():
        if (
            key not in {f"{c}:{p}" for c in CURVES for p in PROFILES}
            or type(revision) is not int
            or revision < 0
        ):
            raise ValueError("Invalid curve revision")


def effective_curves(config, saved):
    result = {}
    for key, (_, _, _, start, full) in CURVES.items():
        result[key] = {}
        for profile in PROFILES:
            base, maximum = config[f"{profile}_speed"], config["boost_speed"]
            points = saved.get(key, {}).get(profile) or [
                {"x": config[start], "y": base},
                {"x": config[full], "y": maximum},
            ]
            # Global baseline/boost bounds remain authoritative after tuning changes.
            result[key][profile] = [
                {"x": p["x"], "y": max(base, min(maximum, p["y"]))} for p in points
            ]
    return result


def interpolate(points, value):
    if value <= points[0]["x"]:
        return points[0]["y"]
    for left, right in zip(points, points[1:]):
        if value <= right["x"]:
            ratio = (value - left["x"]) / (right["x"] - left["x"])
            return left["y"] + ratio * (right["y"] - left["y"])
    return points[-1]["y"]
