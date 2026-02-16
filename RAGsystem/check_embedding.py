# from pymongo import MongoClient
# import chromadb

# # MongoDB
# mongo_client = MongoClient("mongodb+srv://S_2004:13122004@cluster0.ftgbsda.mongodb.net/?appName=Cluster0")
# db = mongo_client["ai_extracted_data"]
# collection_mongo = db["web_data"]

# mongo_count = collection_mongo.count_documents({})

# # ChromaDB
# chroma_client = chromadb.PersistentClient(path="./chroma_db")
# collection_chroma = chroma_client.get_collection("documents")

# chroma_count = collection_chroma.count()

# print("MongoDB documents:", mongo_count)
# print("ChromaDB documents:", chroma_count)


# if mongo_count == chroma_count:
#     print("ChromaDB is synced with MongoDB!")
# else:
#     print("ChromaDB is NOT synced!")

# data = collection_chroma.get()
# # changes of collection.get() method 
# data = collection_chroma.get(include=["documents", "embeddings", "metadatas"])
# print("Total embeddings stored:\n", len(data["ids"]))
# print(data)
# print("First embedding vector:\n", data["embeddings"][0])