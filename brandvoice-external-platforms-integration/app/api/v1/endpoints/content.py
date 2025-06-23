from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.content import Content, ContentCreate, ContentUpdate
from app.models.user import User
from app.core.db_dependencies import get_db
from app.models.firestore_db import FirestoreSession
from app.api.v1.dependencies import get_current_user

router = APIRouter()

# @router.post("/", response_model=Content)
# async def create_content(
#     content: ContentCreate,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Create a new content item."""
#     content_data = content.model_dump()
#     content_data["user_id"] = str(current_user.id)
#     doc_id = await db.add("content", content_data)
#     return {**content_data, "id": doc_id}

# @router.get("/", response_model=List[Content])
# async def list_content(
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """List all content items for the current user."""
#     content_items = await db.query(
#         "content",
#         filters=[("user_id", "==", str(current_user.id))]
#     )
#     return content_items

# @router.get("/{content_id}", response_model=Content)
# async def get_content(
#     content_id: str,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Get a specific content item."""
#     content = await db.get("content", content_id)
#     if not content:
#         raise HTTPException(status_code=404, detail="Content not found")
#     
#     if content["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to access this content")
#     
#     return content

# @router.put("/{content_id}", response_model=Content)
# async def update_content(
#     content_id: str,
#     content: ContentUpdate,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Update a content item."""
#     existing_content = await db.get("content", content_id)
#     if not existing_content:
#         raise HTTPException(status_code=404, detail="Content not found")
#     
#     if existing_content["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to update this content")
#     
#     update_data = content.model_dump(exclude_unset=True)
#     await db.update("content", content_id, update_data)
#     
#     updated_content = await db.get("content", content_id)
#     return updated_content

# @router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_content(
#     content_id: str,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """Delete a content item."""
#     existing_content = await db.get("content", content_id)
#     if not existing_content:
#         raise HTTPException(status_code=404, detail="Content not found")
#     
#     if existing_content["user_id"] != str(current_user.id):
#         raise HTTPException(status_code=403, detail="Not authorized to delete this content")
#     
#     await db.delete("content", content_id)
