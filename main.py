from fastapi import FastAPI, HTTPException, Depends
from models import ExtractedData
from database import get_collection, close_mongo_connection, get_db_client
import traceback
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pymongo.collection import Collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    get_db_client()
    yield
    # on shutdown
    close_mongo_connection()

app = FastAPI(title="Data Storage API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later restrict
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Data Storage API"}

# @app.post("/api/store-data")
# async def recieve_data(data: ExtractedData):
#     print("✅ Received data:", data)
#     return{"message": "Data received successfully"}
    

@app.post("/api/store-data")
def store_data(data: ExtractedData, collection: Collection = Depends(get_collection)):
    try:
        document = data.model_dump()
        collection.insert_one(document)
        return {
            "message": "Data stored successfully",
            # "inserted_id": str(result.inserted_id)
        }

    except Exception as e:
        print("❌ ERROR OCCURRED:")
        traceback.print_exc()

        raise HTTPException(status_code=500, detail=str(e))