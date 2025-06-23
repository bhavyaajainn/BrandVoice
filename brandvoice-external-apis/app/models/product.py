# from pydantic import BaseModel, Field
# from typing import Optional
# from datetime import datetime

# class Product(BaseModel):
#     id: str
#     user_id: str
#     name: str
#     description: Optional[str] = None
#     price_cents: int
#     created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
#     modified_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

# # ----- DTOs -----
# class ProductCreate(BaseModel):
#     name: str
#     description: Optional[str] = None
#     price_cents: int

# class ProductUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     price_cents: Optional[int] = None
