"""Pure demand calculation. Native Vallox remains responsible for frost and airflow balance."""

from dataclasses import dataclass
from math import isfinite
from .const import DEFAULTS, NUMBERS
from .curves import effective_curves, interpolate, validate_saved


def validate(config):
    for key, (low, high, _, _, _) in NUMBERS.items():
        value = config.get(key, DEFAULTS[key])
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not isfinite(value)
            or not low <= value <= high
        ):
            raise ValueError(f"Invalid {key}")
    for a, b in [
        ("home_start", "home_full"),
        ("shower_start", "shower_full"),
        ("co2_start", "co2_full"),
        ("shower_delta_start", "shower_delta_full"),
    ]:
        if config.get(a, DEFAULTS[a]) >= config.get(b, DEFAULTS[b]):
            raise ValueError(f"{a} must be below {b}")
    if (
        not config.get("away_speed", 10)
        <= config.get("home_speed", 30)
        <= config.get("boost_speed", 80)
    ):
        raise ValueError("Speeds must satisfy away ≤ home ≤ boost")


def fraction(value, start, full):
    return 0 if value is None else max(0, min(1, (value - start) / (full - start)))


def rag(value, amber, red, humidity=False):
    if value is None:
        return "unknown"
    if humidity and value < 20:
        return "red"
    if humidity and value < 30:
        return "amber"
    return "red" if value >= red else "amber" if value >= amber else "green"


@dataclass(frozen=True)
class Demand:
    target: int
    reason: str
    winter: bool
    home_rag: str
    shower_rag: str
    co2_rag: str


def demand(
    config,
    home,
    shower,
    co2,
    occupied,
    sauna,
    outdoor,
    boost=False,
    degraded=False,
    curves=None,
):
    c = {**DEFAULTS, **config}
    validate(c)
    winter = outdoor is not None and outdoor < c["winter_below"]
    reduction = c["winter_rh_reduction"] if winter else 0
    hs, hf = c["home_start"] - reduction, c["home_full"] - reduction
    ss, sf = c["shower_start"] - reduction, c["shower_full"] - reduction
    base = c["home_speed"] if occupied is not False or degraded else c["away_speed"]
    candidates = {"Home" if occupied is not False else "Away": base}
    if degraded:
        candidates["Sensor fallback"] = c["home_speed"]
    validate_saved(curves or {}, {})
    responses = effective_curves(c, curves or {})
    profile = "home" if occupied is not False or degraded else "away"

    def response(key, reading, shift=0):
        if reading is None:
            return base
        return max(
            base,
            min(
                c["boost_speed"], interpolate(responses[key][profile], reading + shift)
            ),
        )

    if sauna is False:
        candidates["Home humidity"] = response("home", home, reduction)
        candidates["Shower humidity"] = max(
            response("shower", shower, reduction),
            response(
                "excess",
                shower - home if shower is not None and home is not None else None,
            ),
        )
    candidates["CO₂"] = response("co2", co2)
    if boost:
        candidates["Manual boost"] = c["boost_speed"]
    reason = max(candidates, key=candidates.get)
    if degraded and candidates[reason] <= c["home_speed"]:
        reason = "Sensor fallback"
    if boost:
        reason = "Manual boost"
    return Demand(
        round(candidates[reason]),
        reason,
        winter,
        rag(home, hs, hf, True),
        rag(shower, ss, sf, True),
        rag(co2, c["co2_start"], c["co2_full"]),
    )


def ramp(current, target, up, down, elapsed):
    # At most one minute's change per evaluation, even after HA downtime.
    step = (up if target > current else down) * min(1, max(0, elapsed) / 60)
    if target > current:
        return min(target, current + step)
    return max(target, current - step)
