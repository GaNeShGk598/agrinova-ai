from bson import ObjectId
from fastapi import HTTPException, status
from config.db import db
from models.user_model import UserRegister, UserLogin, UserOut, TokenOut
from utils.password_hash import hash_password, verify_password
from utils.jwt_handler import create_access_token


def _to_out(doc) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        name=doc["name"],
        email=doc["email"],
        region=doc.get("region"),
        language=doc.get("language", "en"),
    )


def register(payload: UserRegister) -> TokenOut:
    if db.users.find_one({"email": payload.email}):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
        "region": payload.region,
        "language": payload.language or "en",
    }
    res = db.users.insert_one(doc)
    doc["_id"] = res.inserted_id
    user_out = _to_out(doc)
    token = create_access_token(str(res.inserted_id), {"email": payload.email})
    return TokenOut(access_token=token, user=user_out)


def login(payload: UserLogin) -> TokenOut:
    doc = db.users.find_one({"email": payload.email})
    if not doc or not verify_password(payload.password, doc["password"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    user_out = _to_out(doc)
    token = create_access_token(str(doc["_id"]), {"email": doc["email"]})
    return TokenOut(access_token=token, user=user_out)
