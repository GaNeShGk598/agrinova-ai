from models.soil_model import SoilProfile

# Simple per-crop NPK targets (mg/kg)
TARGETS = {
    "rice":   {"n": 90, "p": 45, "k": 60},
    "wheat":  {"n": 80, "p": 40, "k": 50},
    "maize":  {"n": 100, "p": 50, "k": 60},
    "cotton": {"n": 110, "p": 55, "k": 70},
    "sugarcane": {"n": 150, "p": 60, "k": 80},
}

# Rough nutrient content (% by weight) and price (INR/kg)
PRODUCTS = {
    "Urea":          {"n": 0.46, "p": 0,    "k": 0,    "price": 6.0},
    "DAP":           {"n": 0.18, "p": 0.46, "k": 0,    "price": 27.0},
    "MOP":           {"n": 0,    "p": 0,    "k": 0.60, "price": 18.0},
    "Zinc Sulphate": {"n": 0,    "p": 0,    "k": 0,    "price": 50.0},
}


def recommend(crop: str, soil: SoilProfile, area_acres: float = 1.0) -> dict:
    target = TARGETS.get(crop.lower(), {"n": 80, "p": 40, "k": 50})
    deficit = {
        "n": max(0, target["n"] - soil.n),
        "p": max(0, target["p"] - soil.p),
        "k": max(0, target["k"] - soil.k),
    }
    # Convert mg/kg deficit to kg/acre roughly: assume 1 acre top 6" ~ 1e6 kg soil.
    # Use simplified factor 0.5 kg of nutrient per (mg/kg) per acre for demo.
    factor = 0.5 * area_acres
    need = {k: deficit[k] * factor for k in deficit}

    plan = []
    cost = 0.0
    if need["n"] > 0:
        kg = round(need["n"] / PRODUCTS["Urea"]["n"], 1)
        plan.append({"product": "Urea", "kg": kg, "cost": round(kg * PRODUCTS["Urea"]["price"], 0)})
    if need["p"] > 0:
        kg = round(need["p"] / PRODUCTS["DAP"]["p"], 1)
        plan.append({"product": "DAP", "kg": kg, "cost": round(kg * PRODUCTS["DAP"]["price"], 0)})
    if need["k"] > 0:
        kg = round(need["k"] / PRODUCTS["MOP"]["k"], 1)
        plan.append({"product": "MOP", "kg": kg, "cost": round(kg * PRODUCTS["MOP"]["price"], 0)})
    if soil.organic_matter < 1.0:
        plan.append({"product": "Zinc Sulphate", "kg": 5,
                     "cost": round(5 * PRODUCTS["Zinc Sulphate"]["price"], 0)})
    cost = sum(p["cost"] for p in plan)

    return {
        "crop": crop,
        "current": {"n": soil.n, "p": soil.p, "k": soil.k},
        "target": target,
        "deficit_mg_per_kg": deficit,
        "plan": plan,
        "estimated_cost_inr": cost,
        "explanation": f"Plan compares your soil NPK against targets for {crop} and converts the gap to the cheapest mix.",
    }
