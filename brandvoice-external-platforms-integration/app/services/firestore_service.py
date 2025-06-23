from typing import TypeVar, Generic, Type, Optional, List, Dict, Any
from datetime import datetime
from app.core.firebase import get_firestore_client
from pydantic import BaseModel
from app.core.security import get_password_hash

T = TypeVar('T', bound=BaseModel)

class FirestoreService(Generic[T]):
    def __init__(self, collection_name: str, model_class: Type[T]):
        self.db = get_firestore_client()
        self.collection = self.db.collection(collection_name)
        self.model_class = model_class

    async def create(self, data: T) -> T:
        """Create a new document in Firestore"""
        doc_ref = self.collection.document()
        doc_data = data.model_dump()
        
        # Handle password hashing if the model has a password field
        if hasattr(data, 'password'):
            doc_data['hashed_password'] = get_password_hash(doc_data.pop('password'))
        
        # Set timestamps
        now = datetime.utcnow()
        doc_data['created_at'] = now
        doc_data['modified_at'] = now
        
        doc_ref.set(doc_data)
        doc_data['id'] = doc_ref.id
        return self.model_class(**doc_data)

    async def get(self, doc_id: str) -> Optional[T]:
        """Get a document by ID"""
        doc = self.collection.document(doc_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data['id'] = doc.id
        return self.model_class(**data)

    async def update(self, doc_id: str, data: Dict[str, Any]) -> Optional[T]:
        """Update a document"""
        doc_ref = self.collection.document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        
        # Handle password hashing if password is being updated
        if 'password' in data:
            data['hashed_password'] = get_password_hash(data.pop('password'))
        
        # Update timestamp
        data['modified_at'] = datetime.utcnow()
        
        doc_ref.update(data)
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
        updated_data['id'] = doc_id
        return self.model_class(**updated_data)

    async def delete(self, doc_id: str) -> bool:
        """Delete a document"""
        doc_ref = self.collection.document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False
        doc_ref.delete()
        return True

    async def list(self, limit: int = 100) -> List[T]:
        """List documents with a limit"""
        docs = self.collection.limit(limit).stream()
        return [self.model_class(**{**doc.to_dict(), 'id': doc.id}) for doc in docs]

    async def query(self, field: str, operator: str, value: Any) -> List[T]:
        """Query documents based on a field"""
        docs = self.collection.where(field, operator, value).stream()
        return [self.model_class(**{**doc.to_dict(), 'id': doc.id}) for doc in docs]

    async def get_by_email(self, email: str) -> Optional[T]:
        """Get a user by email"""
        users = await self.query("email", "==", email)
        return users[0] if users else None