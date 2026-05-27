FAMILY = {
    "rice": "grass", "wheat": "grass", "maize": "grass",
    "soybean": "legume", "chickpea": "legume", "groundnut": "legume",
    "mustard": "brassica", "cotton": "malvaceae", "sugarcane": "grass",
}

NEXT_GOOD = {
    "grass": ["soybean", "chickpea", "groundnut", "mustard"],
    "legume": ["wheat", "maize", "rice"],
    "brassica": ["chickpea", "soybean", "wheat"],
    "malvaceae": ["soybean", "wheat", "groundnut"],
}


def plan(current_crop: str, seasons: int = 4) -> dict:
    current_crop = current_crop.lower()
    sequence = [current_crop]
    for _ in range(max(0, seasons - 1)):
        fam = FAMILY.get(sequence[-1], "grass")
        candidates = NEXT_GOOD.get(fam, ["wheat"])
        # avoid repeating immediately
        nxt = next((c for c in candidates if c != sequence[-1]), candidates[0])
        sequence.append(nxt)
    return {
        "starting_crop": current_crop,
        "rotation": sequence,
        "rationale": "Rotate between cereals (grass), legumes (N-fix) and oilseeds/brassicas to break pest cycles and replenish nitrogen.",
    }
