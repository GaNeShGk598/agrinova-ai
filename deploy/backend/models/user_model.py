from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    region: str | None = None
    language: str | None = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    region: str | None = None
    language: str | None = "en"


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
