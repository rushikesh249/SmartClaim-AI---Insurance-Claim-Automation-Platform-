import requests
import json
from pathlib import Path

# First, register a user and get token
register_data = {
    "name": "Doc Test User",
    "phone": "9876543218",
    "email": "doc_test@example.com",
    "password": "testpassword123"
}

response = requests.post("http://localhost:8000/api/v1/auth/register", json=register_data)
token = response.json()["access_token"]
print(f"Got token: {token[:20]}...")

headers = {"Authorization": f"Bearer {token}"}

# Link a policy
policy_data = {
    "policy_number": "POL_DOC_TEST",
    "policy_type": "health",
    "insurer_name": "Test Insurance",
    "sum_insured": 100000,
    "premium_amount": 5000,
    "start_date": "2024-01-01",
    "end_date": "2025-01-01",
    "coverage_details": {"hospitalization": "covered"}
}

response = requests.post("http://localhost:8000/api/v1/policies/link", json=policy_data, headers=headers)
policy_id = response.json()["id"]
print(f"Created policy: {policy_id}")

# Create a claim
claim_data = {
    "policy_id": policy_id,
    "claim_type": "health",
    "incident_date": "2024-06-15T10:00:00",
    "incident_location": "Test Hospital",
    "incident_description": "Medical treatment",
    "claimed_amount": 15000
}

response = requests.post("http://localhost:8000/api/v1/claims/", json=claim_data, headers=headers)
claim_id = response.json()["id"]
print(f"Created claim: {claim_id}")

# Test document upload with detailed debugging
print("\n=== TESTING DOCUMENT UPLOAD ===")

# Create test file
test_file_path = Path("debug_test.txt")
test_file_path.write_text("Debug test document content")

try:
    # Test 1: Send form data as multipart/form-data
    print("Test 1: Sending as multipart/form-data")
    with open(test_file_path, 'rb') as f:
        files = {
            'file': ('debug_test.txt', f, 'text/plain')
        }
        data = {
            'document_type': 'medical_bill'
        }
        response = requests.post(
            f"http://localhost:8000/api/v1/claims/{claim_id}/documents",
            files=files,
            data=data,
            headers=headers
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS!")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.text}")
            
except Exception as e:
    print(f"Exception: {e}")
finally:
    if test_file_path.exists():
        test_file_path.unlink()

print("=== TEST COMPLETE ===")