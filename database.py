from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class DB:
    client: MongoClient | None = None

db = DB()

def get_db_client():
    if db.client is None:
        MONGO_URI = os.getenv("MONGO_URI")
        if not MONGO_URI:
            raise Exception("❌ MONGO_URI not found in .env")
        db.client = MongoClient(MONGO_URI)
        print("✅ Connected to MongoDB")
    return db.client

def get_collection():
    client = get_db_client()
    return client["ai_extracted_data"]["web_data"]

def close_mongo_connection():
    if db.client:
        db.client.close()
        print("❌ Closed MongoDB connection")