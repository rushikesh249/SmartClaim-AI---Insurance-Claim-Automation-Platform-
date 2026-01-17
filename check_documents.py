import requests
import json

# Use the same token from previous test
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiOGFkMTU0NC1kZmUxLTRlZGMtYTQ4Yy04MWUyNWVlZmQ1NjEiLCJleHAiOjE3Njg2NTAyMTF9.5J8X9vF8Q7W2pLmNk3Rt6Ys1Zx4Cc7Vb0Ae9Fh2Ju3M"
headers = {"Authorization": f"Bearer {token}"}

# Get documents for the claim
claim_id = "fd3bf8fe-1c76-4f0a-a233-b062e8dbac99"
response = requests.get(f"http://localhost:8000/api/v1/claims/{claim_id}/documents", headers=headers)

print("Document listing response:")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    documents = response.json()
    print("Documents:")
    for doc in documents:
        print(json.dumps(doc, indent=2))
else:
    print(f"Error: {response.text}")