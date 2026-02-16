from fastapi import FastAPI
from pymongo import MongoClient
import chromadb
from sentence_transformers import SentenceTransformer

app = FastAPI()

# MongoDB
mongo_client = MongoClient("mongodb+srv://S_2004:13122004@cluster0.ftgbsda.mongodb.net/?appName=Cluster0")
db = mongo_client["ai_extracted_data"]
mongo_collection = db["web_data"]

# ChromaDB + Model
model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = chroma_client.get_or_create_collection("documents")


# -----------------------------
# SYNC FUNCTION
# -----------------------------
def sync_mongo_to_chroma():

    print("Starting Mongo ↔ Chroma sync...")

    mongo_docs = list(mongo_collection.find())
    mongo_ids = set(str(doc["_id"]) for doc in mongo_docs)

    chroma_data = chroma_collection.get()
    chroma_ids = set(chroma_data["ids"])

    # NEW docs
    new_ids = mongo_ids - chroma_ids

    new_texts = []
    new_doc_ids = []

    for doc in mongo_docs:
        doc_id = str(doc["_id"])
        if doc_id in new_ids:
            text = doc["data"]["full_text"]
            new_texts.append(text)
            new_doc_ids.append(doc_id)

    if new_texts:
        embeddings = model.encode(new_texts).tolist()
        chroma_collection.add(
            ids=new_doc_ids,
            documents=new_texts,
            embeddings=embeddings
        )

    # DELETED docs
    deleted_ids = chroma_ids - mongo_ids

    if deleted_ids:
        chroma_collection.delete(ids=list(deleted_ids))

    total = chroma_collection.count()

    print(f"New embedded: {len(new_ids)}")
    print(f"Deleted from Chroma: {len(deleted_ids)}")
    print(f"Total docs in vector DB: {total}")
    print("Sync complete")


# -----------------------------
# RUN SYNC ON STARTUP
# -----------------------------
@app.on_event("startup")
def startup_event():
    sync_mongo_to_chroma()


# -----------------------------
# SEARCH API
# -----------------------------
@app.post("/search")
def search(query: str):

    embedding = model.encode(query).tolist()

    results = chroma_collection.query(
        query_embeddings=[embedding],
        n_results=3
    )

    return {"results": results}