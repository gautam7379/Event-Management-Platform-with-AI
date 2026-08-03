from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: str | None = None
    role_id: int


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    role_id: int
    is_active: bool

    model_config = {
        "from_attributes": True
    }

    