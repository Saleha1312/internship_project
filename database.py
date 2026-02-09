from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

load_dotenv()
class DB:
    client: MongoClient | None = None

db = DB()

def get_db_client():
    if db.client is None:
        MONGO_URI = os.getenv("MONGO_URI")
        client = MongoClient(
        MONGO_URI,
        tlsCAFile=certifi.where()
        )
        if not MONGO_URI:
            raise Exception("MONGO_URI not found in .env")
        db.client = client
        print("Connected to MongoDB")
    return db.client

def get_collection():
    client = get_db_client()
    return client["ai_extracted_data"]["web_data"]

def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")