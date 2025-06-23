# from fastapi import APIRouter, Depends, HTTPException, status
# from typing import List
# from app.models.product import Product, ProductCreate, ProductUpdate
# from app.models.user import User
# from app.core.db_dependencies import get_db
# from app.models.firestore_db import FirestoreSession
# from app.api.v1.dependencies import get_current_user
# from uuid import UUID

# router = APIRouter(prefix="/products", tags=["products"])

# @router.post("/", response_model=Product)
# async def create_product(
#     product: ProductCreate,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Create a new product."""
#     product_data = product.model_dump()
#     product_data["user_id"] = str(current_user.id)
#     doc_id = await db.add("products", product_data)
#     return {**product_data, "id": doc_id}

# @router.get("/", response_model=List[Product])
# async def list_products(
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """List all products for the current user."""
#     products = await db.query(
#         "products",
#         filters=[("user_id", "==", str(current_user.id))]
#     )
#     return products

# @router.get("/{product_id}", response_model=Product)
# async def get_product(
#     product_id: str,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Get a specific product."""
#     product = await db.get("products", product_id)
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     
#     if product["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to access this product")
#     
#     return product

# @router.put("/{product_id}", response_model=Product)
# async def update_product(
#     product_id: str,
#     product: ProductUpdate,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Update a product."""
#     existing_product = await db.get("products", product_id)
#     if not existing_product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     
#     if existing_product["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to update this product")
#     
#     update_data = product.model_dump(exclude_unset=True)
#     await db.update("products", product_id, update_data)
#     
#     updated_product = await db.get("products", product_id)
#     return updated_product

# @router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_product(
#     product_id: str,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Delete a product."""
#     existing_product = await db.get("products", product_id)
#     if not existing_product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     
#     if existing_product["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to delete this product")
#     
#     await db.delete("products", product_id)
