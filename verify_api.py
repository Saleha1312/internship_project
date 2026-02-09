# import urllib.request
# import json
# import urllib.error

# url = "http://localhost:8000/api/store-data"

# payload = {
#     "url": "http://test-simulation.com",
#     "title": "Test Simulation",
#     "extraction_type": "full_page",
#     "full_text": "This is a test extracted text.",
#     "structured_data": {
#         "lists": [["This is a test extracted text."]],
#         "tables": []
#     },
#     "graph_data": [
#         {
#             "type": "bar",
#             "labels": ["Red", "Blue"],
#             "values": [12, 19]
#         }
#     ],
#     "metadata": {
#         "headings": [],
#         "links": [],
#         "images": []
#     }
# }

# data = json.dumps(payload).encode('utf-8')
# req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

# try:
#     print(f"Sending payload to {url}...")
#     with urllib.request.urlopen(req) as response:
#         print(f"Status Code: {response.status}")
#         print(f"Response: {response.read().decode('utf-8')}")
        
#     print("SUCCESS: Backend accepted the payload.")

# except urllib.error.HTTPError as e:
#     print(f"FAILURE: Backend rejected the payload (HTTP {e.code}).")
#     print(e.read().decode('utf-8'))
# except urllib.error.URLError as e:
#     print(f"ERROR: Could not connect to backend. Is it running? {e.reason}")
#     print("Make sure to run 'uvicorn main:app --reload' in another terminal.")