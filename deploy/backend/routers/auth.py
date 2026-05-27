from fastapi import APIRouter
from models.user_model import UserRegister, UserLogin, TokenOut
from services import auth_service

router = APIRouter()


@router.post("/register", response_model=TokenOut)
def register(payload: UserRegister):
    return auth_service.register(payload)


@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin):
    return auth_service.login(payload)
