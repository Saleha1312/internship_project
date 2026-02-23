from fastapi import FastAPI
from pymongo import MongoClient
import chromadb
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

class chatRequest(BaseModel):
    query: str

# MongoDB
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["ai_extracted_data"]
mongo_collection = db["web_data"]

# ChromaDB + Model
model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = chroma_client.get_or_create_collection("documents")

# -----------------------------
# SYNC FUNCTION
# -----------------------------
def chunk_text(text, size=500, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk)
        start += size - overlap
    return chunks

def sync_mongo_to_chroma():
    global chroma_collection

    print("Starting Mongo ↔ Chroma sync...")

    mongo_docs = list(mongo_collection.find())
    print("Mongo docs found:", len(mongo_docs))

    new_texts = []
    new_doc_ids = []

    for doc in mongo_docs:

        doc_id = str(doc["_id"])
        text = doc["data"].get("full_text", "")

        if not text or len(text.strip()) < 200:
            print("Skipped small/empty chunk")
            # continue

        print("Original Length:", len(text))

        # Split large text into optimized chunks
        chunks = chunk_text(text)
        
        for i, chunk in enumerate(chunks):
            if len(chunk.strip()) > 200:
                new_texts.append(chunk)
                new_doc_ids.append(f"{doc_id}_{i}")
            print(f"Chunk {i} Length:", len(chunk))
    # Delete and recreate collection safely
    try:
        chroma_client.delete_collection("documents")
    except Exception:
        pass
    chroma_collection = chroma_client.get_or_create_collection("documents")

    if new_texts:
        embeddings = model.encode(new_texts).tolist()

        chroma_collection.add(
            ids=new_doc_ids,
            documents=new_texts,
            embeddings=embeddings
        )

    total = chroma_collection.count()

    print(f"Total embedded chunks: {len(new_texts)}")
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
def search(req: chatRequest):

    query = req.query

    embedding = model.encode(query).tolist()

    results = chroma_collection.query(
        query_embeddings=[embedding],
        n_results=3
    )

    return {"results": results}

# -----------------------------
# CHAT API (LLaMA 3 + RAG)
# -----------------------------
@app.post("/chat")
def chat(req: chatRequest):

    query = req.query

    try:
        # 1. Embed query
        embedding = model.encode(query).tolist()

        # 2. Search vector DB
        results = chroma_collection.query(
            query_embeddings=[embedding],
            n_results=3,
        include=["documents","distances"]    
        )

        docs = results["documents"][0] 
        distances = results["distances"][0]

        print("Distances:", distances)
        print("Docs:", docs)

        if not docs:
            return {
                "answer": "No relevant documents found in database.",
                "sources": []
            }

        # 3. Create context
        context = "\n\n".join(docs)
        print("Context for LLaMA 3:", context)
        print("-------------------------------")

        # 4. Create prompt for LLaMA 3
        prompt = f"""
You MUST answer using ONLY the context below.

If the answer is not explicitly written in the context,
reply exactly:

"I don't know based on the provided data."

Context:
{context}

Question:
{query}
"""

        # 5. Ask LLaMA 3 (Ollama)
        import ollama

        response = ollama.chat(
            model="llama3",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        answer = response["message"]["content"]

        return {
            "answer": answer,
            "sources": docs
        }

    except Exception as e:
        return {
            "error": str(e)
        }