import httpx, json, pathlib, mimetypes, os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build           # pip install google-api-python-client
from googleapiclient.http import MediaFileUpload
from httpx import Timeout
from app.core.config import get_settings

settings = get_settings()

def creds_from_tokens(token, refresh, client_id, client_secret):
    return Credentials(token,
                    refresh_token=refresh,
                    token_uri="https://oauth2.googleapis.com/token",
                    client_id=client_id,
                    client_secret=client_secret,
                    scopes=["https://www.googleapis.com/auth/youtube.upload"])

# async def upload_video_for_user(user, file_path: str, title: str, desc: str):
#     creds = creds_from_tokens(user.youtube_access_token, user.youtube_refresh_token,
#                             settings.youtube_client_id, settings.youtube_client_secret)

#     youtube = build("youtube", "v3", credentials=creds)

#     media = MediaFileUpload(file_path,
#                             chunksize=-1,
#                             resumable=True,
#                             mimetype=mimetypes.guess_type(file_path)[0])

#     request = youtube.videos().insert(
#         part="snippet,status",
#         body={
#             "snippet": {"title": title, "description": desc},
#             "status": {"privacyStatus": "public"},
#         },
#         media_body=media,
#     )

#     # resumable loop
#     while True:
#         status, response = request.next_chunk()
#         if response and "id" in response:
#             return response["id"]

async def upload_video_for_user(cred, file_path: str, title: str, desc: str):
    creds = creds_from_tokens(cred.get("access_token"), cred.get("refresh_token"),
                        settings.youtube_client_id, settings.youtube_client_secret)
    print(f"***Using credentials: {creds}\n")
    # creds = cred.get("access_token",""
    # print(f"Using access token: {creds}")
    youtube = build("youtube", "v3", credentials=creds)

    media = MediaFileUpload(file_path,
                            chunksize=-1,
                            resumable=True,
                            mimetype=mimetypes.guess_type(file_path)[0])
    
    print(f"Uploading video: {file_path} with title: {title}")

    request = youtube.videos().insert(
        part="snippet,status",
        body={
            "snippet": {"title": title, "description": desc},
            "status": {"privacyStatus": "public"},
        },
        media_body=media,
    )

    # resumable loop
    while True:
        status, response = request.next_chunk()
        if response and "id" in response:
            return response["id"]
