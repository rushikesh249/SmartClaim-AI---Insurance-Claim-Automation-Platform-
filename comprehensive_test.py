import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"
API_PREFIX = "/api/v1"

def test_endpoint(url, method="GET", headers=None, data=None, files=None):
    """Test an endpoint and return status and response"""
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers)
        elif method.upper() == "POST":
            if files:
                # For multipart form data, send both files and data
                response = requests.post(url, headers=headers, files=files, data=data)
            else:
                response = requests.post(url, headers=headers, json=data)
        elif method.upper() == "PUT":
            response = requests.put(url, headers=headers, json=data)
        
        print(f"✓ {method} {url} - Status: {response.status_code}")
        if response.status_code >= 400:
            print(f"  Error: {response.text}")
        return response.status_code, response.json() if response.content else None
    except Exception as e:
        print(f"✗ {method} {url} - Error: {str(e)}")
        return None, None

def main():
    print("=== COMPREHENSIVE SMARTCLAIM AI ENDPOINT TEST ===\n")
    
    # Test 1: Health Check
    print("1. Testing Health Endpoint:")
    test_endpoint(f"{BASE_URL}{API_PREFIX}/health")
    print()
    
    # Test 2: Register User
    print("2. Testing User Registration:")
    register_data = {
        "name": "Test User",
        "phone": "9876543219",
        "email": "test9@example.com",
        "password": "testpassword123"
    }
    status, response = test_endpoint(
        f"{BASE_URL}{API_PREFIX}/auth/register",
        "POST",
        data=register_data
    )
    
    token = None
    if status == 201 and response:
        token = response.get("access_token")
        print(f"  ✓ Got auth token: {token[:20]}...")
    print()
    
    if not token:
        print("Cannot proceed without auth token")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 3: Login
    print("3. Testing User Login:")
    login_data = {
        "phone": "9876543219",
        "password": "testpassword123"
    }
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/auth/login",
        "POST",
        data=login_data
    )
    print()
    
    # Test 4: Get User Profile
    print("4. Testing User Profile:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/auth/me",
        "GET",
        headers=headers
    )
    print()
    
    # Test 5: Link Policy
    print("5. Testing Policy Linking:")
    policy_data = {
        "policy_number": "POL008",
        "policy_type": "health",
        "insurer_name": "Test Insurance",
        "sum_insured": 100000,
        "premium_amount": 5000,
        "start_date": "2024-01-01",
        "end_date": "2025-01-01",
        "coverage_details": {"hospitalization": "covered"}
    }
    status, policy_response = test_endpoint(
        f"{BASE_URL}{API_PREFIX}/policies/link",
        "POST",
        headers=headers,
        data=policy_data
    )
    
    policy_id = None
    if status == 201 and policy_response:
        policy_id = policy_response.get("id")
        print(f"  ✓ Created policy: {policy_id}")
    print()
    
    if not policy_id:
        print("Cannot proceed without policy")
        return
    
    # Test 6: List Policies
    print("6. Testing Policy Listing:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/policies/",
        "GET",
        headers=headers
    )
    print()
    
    # Test 7: Create Claim
    print("7. Testing Claim Creation:")
    claim_data = {
        "policy_id": policy_id,
        "claim_type": "health",
        "incident_date": "2024-06-15T10:00:00",
        "incident_location": "Test Hospital",
        "incident_description": "Medical treatment",
        "claimed_amount": 15000
    }
    status, claim_response = test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/",
        "POST",
        headers=headers,
        data=claim_data
    )
    
    claim_id = None
    if status == 201 and claim_response:
        claim_id = claim_response.get("id")
        print(f"  ✓ Created claim: {claim_id}")
    print()
    
    if not claim_id:
        print("Cannot proceed without claim")
        return
    
    # Test 8: List Claims
    print("8. Testing Claim Listing:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/",
        "GET",
        headers=headers
    )
    print()
    
    # Test 9: Get Specific Claim
    print("9. Testing Get Claim:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/{claim_id}",
        "GET",
        headers=headers
    )
    print()
    
    # Test 10: Upload Document
    print("10. Testing Document Upload:")
    # Create a test file
    test_file_path = Path("test_document.txt")
    test_file_path.write_text("This is a test document for SmartClaim AI")
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {
                'file': ('test_document.txt', f, 'text/plain')
            }
            data = {
                'document_type': 'medical_bill'
            }
            status, doc_response = test_endpoint(
                f"{BASE_URL}{API_PREFIX}/claims/{claim_id}/documents",
                "POST",
                headers=headers,
                data=data,
                files=files
            )
        
        document_id = None
        if status == 201 and doc_response:
            document_id = doc_response.get("id")
            print(f"  ✓ Uploaded document: {document_id}")
            print(f"  ✓ File path: {doc_response.get('file_path')}")
            print(f"  ✓ File name: {doc_response.get('file_name')}")
            print(f"  ✓ File size: {doc_response.get('file_size')} bytes")
        print()
        
        # Test 11: List Documents
        print("11. Testing Document Listing:")
        test_endpoint(
            f"{BASE_URL}{API_PREFIX}/claims/{claim_id}/documents",
            "GET",
            headers=headers
        )
        print()
        
        # Test 12: View Document (new endpoint)
        if document_id:
            print("12. Testing Document View Endpoint:")
            status, response = test_endpoint(
                f"{BASE_URL}{API_PREFIX}/files/{document_id}/view",
                "GET",
                headers=headers
            )
            if status == 200:
                print("  ✓ Document view endpoint works")
            print()
            
            # Test 13: Download Document (new endpoint)
            print("13. Testing Document Download Endpoint:")
            status, response = test_endpoint(
                f"{BASE_URL}{API_PREFIX}/files/{document_id}/download",
                "GET",
                headers=headers
            )
            if status == 200:
                print("  ✓ Document download endpoint works")
            print()
        
    finally:
        # Clean up test file
        if test_file_path.exists():
            test_file_path.unlink()
    
    # Test 14: Timeline
    print("14. Testing Timeline Endpoint:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/{claim_id}/timeline",
        "GET",
        headers=headers
    )
    print()
    
    # Test 15: Risk Assessment
    print("15. Testing Risk Assessment Endpoint:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/{claim_id}/risk",
        "GET",
        headers=headers
    )
    print()
    
    # Test 16: Summary PDF
    print("16. Testing Summary PDF Endpoint:")
    test_endpoint(
        f"{BASE_URL}{API_PREFIX}/claims/{claim_id}/summary-pdf",
        "GET",
        headers=headers
    )
    print()
    
    print("=== TEST COMPLETED ===")

if __name__ == "__main__":
    main()