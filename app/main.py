# import os
# import asyncio
# from dotenv import load_dotenv
# from google.adk.runners import Runner
# import pymysql
# import google.generativeai as genai

# from google.adk.sessions import DatabaseSessionService
# from sqlalchemy.engine import URL

# from utils import call_agent_async
from research_agent.agent import root_agent as research_agent

# # Load environment variables
# load_dotenv()  # Looks for .env in current directory
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # Build MySQL connection URL from environment
# # db_url = URL.create(
# #     drivername="mysql+pymysql",
# #     username=os.getenv("DB_USER"),
# #     password=os.getenv("DB_PASS"),
# #     host=os.getenv("DB_HOST"),
# #     port=int(os.getenv("DB_PORT", "3306")),  # Convert to int
# #     database=os.getenv("DB_NAME"),
# #     query={"charset": os.getenv("DB_CHARSET", "utf8mb4")}
# # )

# db_url = "sqlite:///brandvoice_sessions.db"



# # def ensure_tables_exist():
# #     # Connect directly to the database
# #     conn = pymysql.connect(
# #         host=os.getenv("DB_HOST"),
# #         port=int(os.getenv("DB_PORT", "3306")),
# #         user=os.getenv("DB_USER"),
# #         password=os.getenv("DB_PASS"),
# #         database=os.getenv("DB_NAME"),
# #         charset=os.getenv("DB_CHARSET", "utf8mb4")
# #     )
    
# #     try:
# #         with conn.cursor() as cursor:
# #             # Check if sessions table exists
# #             cursor.execute("SHOW TABLES LIKE 'sessions'")
# #             if not cursor.fetchone():
# #                 print("Creating sessions table...")
# #                 cursor.execute("""
# #                 CREATE TABLE sessions (
# #                     id VARCHAR(255) PRIMARY KEY,
# #                     app_name VARCHAR(255) NOT NULL,
# #                     user_id VARCHAR(255) NOT NULL,
# #                     is_ephemeral BOOLEAN NOT NULL DEFAULT FALSE,
# #                     creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# #                     last_accessed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
# #                 )
# #                 """)
            
# #             # Check if session_states table exists
# #             cursor.execute("SHOW TABLES LIKE 'session_states'")
# #             if not cursor.fetchone():
# #                 print("Creating session_states table...")
# #                 cursor.execute("""
# #                 CREATE TABLE session_states (
# #                     id VARCHAR(255) PRIMARY KEY,
# #                     session_id VARCHAR(255) NOT NULL,
# #                     state JSON,
# #                     creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# #                     FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
# #                 )
# #                 """)
# #              # Check if events table exists
# #             cursor.execute("SHOW TABLES LIKE 'events'")
# #             if not cursor.fetchone():
# #                 print("Creating events table...")
# #                 cursor.execute("""
# #                 CREATE TABLE events (
# #                     id VARCHAR(255) PRIMARY KEY,
# #                     session_id VARCHAR(255) NOT NULL,
# #                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# #                     content TEXT,
# #                     event_type VARCHAR(255),
# #                     is_user BOOLEAN DEFAULT FALSE,
# #                     FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
# #                 )
# #                 """)
                
# #         conn.commit()
# #         print("Database tables are ready")
# #     except Exception as e:
# #         print(f"Error setting up database tables: {e}")
# #         raise
# #     finally:
# #         conn.close()

# # Create tables if they don't exist
# # try:
# #     ensure_tables_exist()
# # except Exception as e:
# #     print(f"Failed to setup database tables: {e}")


# session_service = DatabaseSessionService(
#     db_url=db_url,
   
# )




# # ===== PART 2: Define Initial State =====
# # This will only be used when creating a new session
# initial_state = {
#     "user_id": "Boie",
#     "reminders": [],
# }


# async def main_async():
#     # Setup constants
#     APP_NAME = "Research Agent"
#     USER_ID = "boie"

#     # ===== PART 3: Session Management - Find or Create =====
#     # Check for existing sessions for this user
#     existing_sessions = session_service.list_sessions(
#         app_name=APP_NAME,
#         user_id=USER_ID,
#     )

#     # If there's an existing session, use it, otherwise create a new one
#     if existing_sessions and len(existing_sessions.sessions) > 0:
#         # Use the most recent session
#         SESSION_ID = existing_sessions.sessions[0].id
#         print(f"Continuing existing session: {SESSION_ID}")
#     else:
#         # Create a new session with initial state
#         new_session = session_service.create_session(
#             app_name=APP_NAME,
#             user_id=USER_ID,
#             state=initial_state,
#         )
#         SESSION_ID = new_session.id
#         print(f"Created new session: {SESSION_ID}")

#     # ===== PART 4: Agent Runner Setup =====
#     # Create a runner with the memory agent
#     runner = Runner(
#         agent=research_agent,
#         app_name=APP_NAME,
#         session_service=session_service,
#     )

#     # ===== PART 5: Interactive Conversation Loop =====
#     print("\nWelcome to Memory Agent Chat!")
#     print("Your reminders will be remembered across conversations.")
#     print("Type 'exit' or 'quit' to end the conversation.\n")

#     while True:
#         # Get user input
#         user_input = input("You: ")

#         # Check if user wants to exit
#         if user_input.lower() in ["exit", "quit"]:
#             print("Ending conversation. Your data has been saved to the database.")
#             break

#         # Process the user query through the agent
#         await call_agent_async(runner, USER_ID, SESSION_ID, user_input)


# if __name__ == "__main__":
#     asyncio.run(main_async())

import asyncio

from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService
from memory_agent.agent import memory_agent
from utils import call_agent_async

load_dotenv()

# ===== PART 1: Initialize Persistent Session Service =====
# Using SQLite database for persistent storage
db_url = "sqlite:///./my_agent_data.db"
session_service = DatabaseSessionService(db_url=db_url)


# ===== PART 2: Define Initial State =====
# This will only be used when creating a new session
# initial_state = {
#     "user_name": "Brandon Hancock",
#     "reminders": [],
# }

# initial_state = {
#     "user_name": "Athul",
#     "reminders": [],
# }

initial_state = {
    "brands": {},
    "active_brand": None,
    "active_product": None
}


async def main_async():
    # Setup constants
    APP_NAME = "Research Agent"
    USER_ID = "aiwithbrandon"

    # ===== PART 3: Session Management - Find or Create =====
    # Check for existing sessions for this user
    existing_sessions = session_service.list_sessions(
        app_name=APP_NAME,
        user_id=USER_ID,
    )

    # If there's an existing session, use it, otherwise create a new one
    if existing_sessions and len(existing_sessions.sessions) > 0:
        # Use the most recent session
        SESSION_ID = existing_sessions.sessions[0].id
        print(f"Continuing existing session: {SESSION_ID}")
    else:
        # Create a new session with initial state
        new_session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            state=initial_state,
        )
        SESSION_ID = new_session.id
        print(f"Created new session: {SESSION_ID}")

    # ===== PART 4: Agent Runner Setup =====
    # Create a runner with the memory agent
    runner = Runner(
        agent=research_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    # ===== PART 5: Interactive Conversation Loop =====
    print("\nWelcome to Memory Agent Chat!")
    print("Your reminders will be remembered across conversations.")
    print("Type 'exit' or 'quit' to end the conversation.\n")

    while True:
        # Get user input
        user_input = input("You: ")

        # Check if user wants to exit
        if user_input.lower() in ["exit", "quit"]:
            print("Ending conversation. Your data has been saved to the database.")
            break

        # Process the user query through the agent
        await call_agent_async(runner, USER_ID, SESSION_ID, user_input)


if __name__ == "__main__":
    asyncio.run(main_async())
