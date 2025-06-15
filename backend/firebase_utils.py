import firebase_admin
from firebase_admin import credentials, firestore, storage
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
import logging
logger = logging.getLogger(__name__)
# Initialize Firebase
try:
    import os
    cred_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'service_account.json')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'brandvoice-images'  # REPLACE WITH YOUR ACTUAL FIREBASE PROJECT ID
    })
    db = firestore.client()
    bucket = storage.bucket()
    print("Firestore and Storage connected successfully")
except Exception as e:
    print(f"Error initializing Firebase: {str(e)}")
    db = None
    bucket = None



def store_formatted_content(query, user_id, session_id, structured_content, raw_responses):
    """
    Store formatted content output from the content refinement loop.
    
    Args:
        query: The original user query
        user_id: User identifier
        session_id: Session identifier
        structured_content: The structured content (platform-specific formatted content)
        raw_responses: The raw text responses
        
    Returns:
        The document ID of the stored content
    """
    try:
        # Create the document to store
        content_data = {
            "query": query,
            "user_id": user_id,
            "session_id": session_id,
            "structured_content": structured_content,
            "raw_responses": raw_responses,
            "timestamp": datetime.now().isoformat(),
            "agent_type": "content_refinement"
        }
        
        # Store in Firestore
        content_ref = db.collection("formatted_content").add(content_data)
        return content_ref.id
    
    except Exception as e:
        print(f"Error storing formatted content: {str(e)}")
        return None
    
    
def store_research_data(
    brand_name: str,
    product_name: Optional[str],
    is_new_brand: bool,
    research_data: List[str],
    user_id: str,
    agent_type: str
) -> str:
    """Store brand research data in Firestore using a hierarchical structure"""
    if db is None:
        print("Firestore not available, skipping storage")
        return str(uuid.uuid4())
    
    try:
        # Create a brand document reference - use a slugified version of the brand name as the document ID
        brand_id = brand_name.lower().replace(" ", "_")
        brand_ref = db.collection("brands").document(brand_id)
        
        # First, update or create the brand document with brand-level information
        brand_data = {
            "brand_name": brand_name,
            "is_new_brand": is_new_brand,
            "last_updated": datetime.now().isoformat(),
            "user_id": user_id
        }
        
        # Check if brand document exists and create/update it
        brand_doc = brand_ref.get()
        if not brand_doc.exists:
            brand_ref.set(brand_data)
        else:
            brand_ref.update(brand_data)
        
        # Generate a unique ID for this specific research instance
        research_id = str(uuid.uuid4())
        
        # If product name is provided, create a document in the products subcollection
        if product_name:
            product_id = product_name.lower().replace(" ", "_")
            product_ref = brand_ref.collection("products").document(product_id)
            
            # Add the research data to this product
            product_data = {
                "product_name": product_name,
                "research_id": research_id,
                "research_data": research_data,
                "timestamp": datetime.now().isoformat(),
                "user_id": user_id,
                "agent_type": agent_type
            }
            
            # Store in Firestore
            product_ref.set(product_data)
            print(f"Stored research data for {brand_name} - {product_name} with ID: {research_id}")
            
        else:
            # If no product name, store research at brand level in a "general" subcollection
            general_ref = brand_ref.collection("general_research").document(research_id)
            general_data = {
                "research_id": research_id,
                "research_data": research_data,
                "timestamp": datetime.now().isoformat(),
                "user_id": user_id,
                "agent_type": agent_type
            }
            
            general_ref.set(general_data)
            print(f"Stored general research data for {brand_name} with ID: {research_id}")
        
        return research_id
    except Exception as e:
        print(f"Error storing in Firestore: {str(e)}")
        return str(uuid.uuid4())  # Return a random ID if storage fails

def get_research_by_id(research_id: str) -> Dict[str, Any]:
    """Retrieve research data from Firestore by ID by searching across all brands and products"""
    if db is None:
        return None
    
    try:
        # This requires a query across multiple collections
        # First check general research collections
        brands = db.collection("brands").stream()
        
        for brand in brands:
            # Check in general research
            general_doc = brand.reference.collection("general_research").document(research_id).get()
            if general_doc.exists:
                result = general_doc.to_dict()
                result["brand_name"] = brand.to_dict().get("brand_name")
                return result
                
            # Check in products
            products = brand.reference.collection("products").stream()
            for product in products:
                if product.to_dict().get("research_id") == research_id:
                    result = product.to_dict()
                    result["brand_name"] = brand.to_dict().get("brand_name")
                    return result
        
        print(f"No document found with ID: {research_id}")
        return None
    except Exception as e:
        print(f"Error retrieving from Firestore: {str(e)}")
        return None

def get_research_by_brand(brand_name: str, include_products: bool = True) -> Dict[str, Any]:
    """Retrieve all research data for a specific brand"""
    if db is None:
        return {}
    
    try:
        # Get the brand document
        brand_id = brand_name.lower().replace(" ", "_")
        brand_ref = db.collection("brands").document(brand_id)
        brand_doc = brand_ref.get()
        
        if not brand_doc.exists:
            print(f"No brand found with name: {brand_name}")
            return {}
        
        # Get brand data
        result = brand_doc.to_dict()
        
        # Add general research
        general_research = []
        general_docs = brand_ref.collection("general_research").stream()
        for doc in general_docs:
            general_research.append(doc.to_dict())
        
        result["general_research"] = general_research
        
        # Add product research if requested
        if include_products:
            products = {}
            product_docs = brand_ref.collection("products").stream()
            
            for doc in product_docs:
                product_data = doc.to_dict()
                product_name = product_data.get("product_name")
                products[product_name] = product_data
            
            result["products"] = products
        
        return result
    except Exception as e:
        print(f"Error querying Firestore: {str(e)}")
        return {}

def get_product_research(brand_name: str, product_name: str) -> Dict[str, Any]:
    """Retrieve research data for a specific product of a brand"""
    if db is None:
        return None
    
    try:
        # Get the product document
        brand_id = brand_name.lower().replace(" ", "_")
        product_id = product_name.lower().replace(" ", "_")
        
        product_ref = db.collection("brands").document(brand_id).collection("products").document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            print(f"No product found with name: {product_name} for brand: {brand_name}")
            return None
        
        return product_doc.to_dict()
    except Exception as e:
        print(f"Error retrieving from Firestore: {str(e)}")
        return None
        


def store_brand_profile(brand_name, description, logo_url, brand_id=None,marketing_platforms=None):
    """Store brand profile information in Firebase."""
    try:
        # Create a unique ID for the brand profile
        if not brand_id:
            brand_id = f"brand_{brand_name.lower().replace(' ', '_')}"
        
        # Create a new document in the brand_profiles collection
        db.collection('brand_profiles').document(brand_id).set({
            'brand_id': brand_id,
            'brand_name': brand_name,
            'description': description,
            'logo_url': logo_url,
            'marketing_platforms': marketing_platforms or [],
            'timestamp': datetime.now().isoformat()
        })
        
        return brand_id
    except Exception as e:
        print(f"Error storing brand profile: {str(e)}")
        raise e

def get_brand_profile_by_id(brand_id):
    """Retrieve brand profile by ID."""
    try:
        doc = db.collection('brand_profiles').document(brand_id).get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error retrieving brand profile: {str(e)}")
        return None

def update_brand_logo_url(brand_id, logo_url):
    """Update a brand profile with a new logo URL."""
    try:
        db.collection('brand_profiles').document(brand_id).update({
            'logo_url': logo_url
        })
        return True
    except Exception as e:
        print(f"Error updating logo URL: {str(e)}")
        return False

def upload_logo_to_firebase(file_bytes, filename, brand_id):
    """Upload a logo file to Firebase Storage and return the public URL."""
    try:
        # Use the globally defined bucket
        global bucket
        if not bucket:
            raise Exception("Firebase Storage bucket not initialized")
            
        # Create a unique filename to avoid conflicts
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        # Create a storage blob and upload the file
        blob_path = f"logos/{brand_id}/{unique_filename}"
        blob = bucket.blob(blob_path)
        
        # Log information for debugging
        print(f"Uploading file {filename} to path {blob_path}")
        
        # Upload the file content
        blob.upload_from_string(
            file_bytes,
            content_type="image/jpeg"  # You may need to detect this dynamically
        )
        
        # REMOVE THIS LINE - Don't try to make the blob public with ACLs
        blob.make_public()
        
        # Return the public URL - if your bucket has public access
        return f"https://storage.googleapis.com/brandvoice-images/{blob_path}"
    
    except Exception as e:
        print(f"Error uploading logo to Firebase: {str(e)}")
        raise

def store_product(brand_id, product_name, description, category=None):
    """Store product information in Firebase."""
    try:
        # Verify the brand exists first
        brand = get_brand_profile_by_id(brand_id)
        if not brand:
            raise Exception(f"Brand with ID {brand_id} not found")
            
        # Create a unique ID for the product
        product_id = f"product_{brand_id}_{product_name.lower().replace(' ', '_')}"
        
        # Create a new document in the products collection
        db.collection('products').document(product_id).set({
            'product_id': product_id,
            'brand_id': brand_id,
            'product_name': product_name,
            'description': description,
            'category': category,
            'timestamp': datetime.now().isoformat()
        })
        
        return product_id
    except Exception as e:
        print(f"Error storing product: {str(e)}")
        raise e

def get_products_by_brand(brand_id):
    """Retrieve all products for a specific brand."""
    try:
        # Query products collection for all products with the given brand_id
        products = db.collection('products').where('brand_id', '==', brand_id).stream()
        
        # Convert to list of dictionaries
        product_list = [doc.to_dict() for doc in products]
        
        return product_list
    except Exception as e:
        print(f"Error retrieving products for brand: {str(e)}")
        return []

def get_product_by_id(product_id):
    """Retrieve a product by ID."""
    try:
        doc = db.collection('products').document(product_id).get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error retrieving product: {str(e)}")
        return None
    
# Add this function to your firebase utilities

def update_brand_marketing_platforms(brand_id: str, platforms: List[str]):
    """Update the marketing platforms for a brand"""
    try:
        # Get a reference to the brand document
        brand_ref = db.collection('brand_profiles').document(brand_id)
        
        # Update only the marketing_platforms field
        brand_ref.update({
            'marketing_platforms': platforms
        })
        
        return True
    except Exception as e:
        print(f"Error updating brand marketing platforms: {str(e)}")
        return False
    
def update_brand_profile(brand_id: str, brand_data: Dict[str, Any]) -> bool:
    """Update a brand profile with new data.
    
    Args:
        brand_id: The ID of the brand to update
        brand_data: Dictionary containing the updated brand profile data
        
    Returns:
        True if successful, False otherwise
    """
    if db is None:
        logger.error("Firestore not available, skipping update")
        return False
        
    try:
        # Get a reference to the brand document
        brand_ref = db.collection("brand_profiles").document(brand_id)
        
        # Update the document with the new data
        brand_ref.update(brand_data)
        
        logger.info(f"Successfully updated brand profile {brand_id}")
        return True
    except Exception as e:
        logger.error(f"Error updating brand profile: {e}")
        return False
