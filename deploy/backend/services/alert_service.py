from datetime import datetime, timezone
from bson import ObjectId
from config.db import db
from models.alert_model import AlertIn, AlertOut


def _to_out(doc) -> AlertOut:
    return AlertOut(
        id=str(doc["_id"]),
        user_id=doc["user_id"],
        farm_id=doc.get("farm_id"),
        type=doc["type"],
        severity=doc["severity"],
        title=doc["title"],
        message=doc["message"],
        created_at=doc["created_at"],
    )


def create(user_id: str, payload: AlertIn) -> AlertOut:
    doc = payload.model_dump()
    doc.update({"user_id": user_id, "created_at": datetime.now(timezone.utc)})
    res = db.alerts.insert_one(doc)
    doc["_id"] = res.inserted_id
    return _to_out(doc)


def list_for_user(user_id: str) -> list[AlertOut]:
    cur = db.alerts.find({"user_id": user_id}).sort("created_at", -1).limit(100)
    return [_to_out(d) for d in cur]


def evaluate_rules(user_id: str, soil_moisture: float, humidity: float) -> list[AlertOut]:
    """Run simple rule engine and persist generated alerts."""
    created = []
    if soil_moisture < 22:
        created.append(create(user_id, AlertIn(
            type="irrigation", severity="medium",
            title="Irrigation due",
            message=f"Soil moisture is {soil_moisture}% — schedule irrigation tomorrow morning.",
        )))
    if humidity > 85:
        created.append(create(user_id, AlertIn(
            type="disease", severity="high",
            title="High disease risk",
            message=f"Humidity at {humidity}% favours blight. Inspect leaves and consider preventive spray.",
        )))
    return created
