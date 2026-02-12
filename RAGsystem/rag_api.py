from fastapi import FastAPI, Query
import chromadb
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel

app = FastAPI()

model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_collection("documents")

class Query(BaseModel):
    query: str
@app.post("/search")
def search(query: Query):
    embedding = model.encode(query.query).tolist()

    results = collection.query(
        query_embeddings=[embedding],
        n_results=3
    )

    return {"results": results}