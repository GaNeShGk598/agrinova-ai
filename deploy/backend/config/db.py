from pymongo import MongoClient, ASCENDING
from .settings import settings

_client = MongoClient(settings.mongo_uri)
db = _client[settings.mongo_db]


def ensure_indexes() -> None:
    db.users.create_index([("email", ASCENDING)], unique=True)
    db.farms.create_index([("user_id", ASCENDING)])
    db.alerts.create_index([("user_id", ASCENDING), ("created_at", ASCENDING)])
    db.predictions.create_index([("user_id", ASCENDING), ("created_at", ASCENDING)])
