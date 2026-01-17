import requests

# Use the same token from previous test
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkOGUxZDEzZC0zOWQ4LTQ2NDAtYWRkMy04YWVhZGI3NDBiN2QiLCJleHAiOjE3Njg2NTE4MDN9.mH5ii42xL9GNEVaf9q_kIjq465BJ11MA2KN2mP304SE'
headers = {'Authorization': f'Bearer {token}'}

document_id = 'a612db4c-b18f-4f05-b42f-d477f229f95b'

# Test view endpoint
print('Testing document view endpoint:')
response = requests.get(f'http://localhost:8000/api/v1/files/{document_id}/view', headers=headers)
print(f'Status: {response.status_code}')
if response.status_code == 200:
    print('SUCCESS: Document view works')
    print(f'Content-Type: {response.headers.get("content-type")}')
    print(f'Content-Disposition: {response.headers.get("content-disposition")}')
else:
    print(f'Error: {response.text}')

print()

# Test download endpoint
print('Testing document download endpoint:')
response = requests.get(f'http://localhost:8000/api/v1/files/{document_id}/download', headers=headers)
print(f'Status: {response.status_code}')
if response.status_code == 200:
    print('SUCCESS: Document download works')
    print(f'Content-Type: {response.headers.get("content-type")}')
    print(f'Content-Disposition: {response.headers.get("content-disposition")}')
else:
    print(f'Error: {response.text}')