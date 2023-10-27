from typing import Optional
from pydantic import BaseModel, Field

# Create a Person model
class Person(BaseModel):

    #  The id field is optional, and will be set by the database,
    #  so it is set to None by default (in the case that the person
    #  is being created).
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int