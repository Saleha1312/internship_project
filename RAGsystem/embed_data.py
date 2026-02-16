# # # from pymongo import MongoClient
# # # import chromadb
# # # from sentence_transformers import SentenceTransformer

# # # # MongoDB connection
# # # client = MongoClient("mongodb+srv://S_2004:13122004@cluster0.ftgbsda.mongodb.net/?appName=Cluster0")
# # # db = client["ai_extracted_data"]
# # # collection = db["web_data"]

# # # # ChromaDB
# # # chroma_client = chromadb.PersistentClient(path="./chroma_db")
# # # collection_chroma = chroma_client.get_or_create_collection("documents")

# # # # Embedding model
# # # model = SentenceTransformer("all-MiniLM-L6-v2")

# # # # Fetch data
# # # docs = collection.find()

# # # for doc in docs:
# # #     try:
# # #         text = doc["data"]["full_text"]  # adjust field name
# # #         embedding = model.encode(text).tolist()

# # #         collection_chroma.add(
# # #             documents=[text],
# # #             embeddings=[embedding],
# # #             ids=[str(doc["_id"])]
# # #         )
# # #     except Exception as e:
# # #         print(f"Error processing document {doc['_id']}: {e}")
# # # print("Embedding complete!")


# # # changes start here
# from pymongo import MongoClient
# import chromadb
# from sentence_transformers import SentenceTransformer

# # Mongo connection
# mongo_client = MongoClient("mongodb+srv://S_2004:13122004@cluster0.ftgbsda.mongodb.net/?appName=Cluster0")
# db = mongo_client["ai_extracted_data"]
# collection_mongo = db["web_data"]

# # Chroma connection
# model = SentenceTransformer("all-MiniLM-L6-v2")
# chroma_client = chromadb.PersistentClient(path="./chroma_db")

# # Delete old collection (important!)
# try:
#     chroma_client.delete_collection("documents")
# except:
#     pass

# collection_chroma = chroma_client.create_collection("documents")

# # Fetch Mongo data
# docs = list(collection_mongo.find())

# texts = []
# ids = []

# for doc in docs:
#     text = doc["data"]["full_text"]   # change to our field name
#     texts.append(text)
#     ids.append(str(doc["_id"]))

# # Generate embeddings
# embeddings = model.encode(texts).tolist()

# # Insert into Chroma
# collection_chroma.add(
#     documents=texts,
#     ids=ids,
#     embeddings=embeddings
# )

# print("MongoDB synced to ChromaDB successfully!")