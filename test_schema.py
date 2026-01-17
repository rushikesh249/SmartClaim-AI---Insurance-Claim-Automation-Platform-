from app.models.document import Document
from app.schemas.document import DocumentUploadResponse
from app.db.session import get_db

# Get a database session
db_gen = get_db()
db = next(db_gen)

# Query the document
doc = db.query(Document).filter(Document.id == 'a612db4c-b18f-4f05-b42f-d477f229f95b').first()

print('Raw document attributes:')
for attr in ['id', 'file_name', 'file_size', 'mime_type', 'file_path']:
    print(f'  {attr}: {getattr(doc, attr, "NOT FOUND")}')

print('\nCreating Pydantic model from ORM object:')
try:
    response_model = DocumentUploadResponse.model_validate(doc)
    print('Success!')
    print('Serialized data:')
    print(f'  file_name: {response_model.file_name}')
    print(f'  file_size: {response_model.file_size}')
    print(f'  mime_type: {response_model.mime_type}')
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()