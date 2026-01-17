from sqlalchemy.orm import declarative_base
from sqlalchemy import MetaData

from app.utils.constants import DB_NAMING_CONVENTION

# Create metadata with naming convention for constraints
metadata = MetaData(naming_convention=DB_NAMING_CONVENTION)

# Create declarative base for all models to inherit from
Base = declarative_base(metadata=metadata)
