import os
from typing import Optional, List
import tweepy
from app.core.config import get_settings

settings = get_settings()

def get_client_for_user(
    user_token: str,
    user_token_secret: str
) -> tweepy.Client:
    """
    Instantiate a Tweepy v2 Client for a given user.
    """
    return tweepy.Client(
        bearer_token=settings.twitter_bearer_token,
        consumer_key=settings.twitter_api_key,
        consumer_secret=settings.twitter_api_secret,
        access_token=user_token,
        access_token_secret=user_token_secret,
    )

async def post_tweet_for_user(
    access_token: str,
    access_token_secret: str,
    text: str,
    media_paths: Optional[List[str]] = None
) -> str:
    """
    Posts a Tweet (and optional media) via Twitter API v2.
    Returns the created Tweet ID.
    """
    client = get_client_for_user(access_token, access_token_secret)

    media_ids = []
    if media_paths:
        # Media uploads still use v1.1 under the hood
        twitter_api = tweepy.API(
            tweepy.OAuth1UserHandler(
                os.getenv("TWITTER_API_KEY"),
                os.getenv("TWITTER_API_SECRET"),
                access_token,
                access_token_secret
            )
        )
        for path in media_paths:
            res = twitter_api.media_upload(path)
            media_ids.append(res.media_id)
    
    # Create the tweet
    if media_ids:
        resp = client.create_tweet(text=text, media_ids=media_ids)
    else:
        resp = client.create_tweet(text=text)
    
    # client.create_tweet returns a Response with .data.id
    tweet_data = getattr(resp, "data", None)
    if tweet_data and "id" in tweet_data:
        return tweet_data["id"]
    else:
        raise RuntimeError("Tweet creation failed or unexpected response format.")
