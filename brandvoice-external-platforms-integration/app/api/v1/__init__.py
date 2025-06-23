from fastapi import APIRouter
from app.api.v1.endpoints import auth, product, content, scheduler, youtube, facebook, instagram, twitter

router = APIRouter()

# Auth routes
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Product routes
# router.include_router(product.router, prefix="/products", tags=["Products"])

# Content routes
router.include_router(content.router, prefix="/content", tags=["Content"])

# Scheduler routes
router.include_router(scheduler.router, prefix="/scheduler", tags=["Scheduler"])

# Social media routes
router.include_router(youtube.router, prefix="/youtube", tags=["YouTube"])
router.include_router(facebook.router, prefix="/facebook", tags=["Facebook"])
router.include_router(instagram.router, prefix="/instagram", tags=["Instagram"])
router.include_router(twitter.router, prefix="/twitter", tags=["Twitter"])
# router.include_router(health.router)
