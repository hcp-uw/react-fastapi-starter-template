from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_pool
from models import Person
from crud import get_all_people, get_person, create_person, update_person, delete_person



# Create a FastAPI instance
app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")


# Create a FastAPI event that will be triggered when the application starts.
#  It will create a database connection pool, and attach it to the application instance.
@app.on_event("startup")
async def startup_db_pool():
    app.db_pool = await create_db_pool()

# Create a FastAPI event that will be triggered when the application stops.
#  It will close the database connection pool.
@app.on_event("shutdown")
async def shutdown_db_pool():
    await app.db_pool.close()


# Define the API endpoint
# The endpoint will be a GET request to the /people path.
@app.get("/people")
async def get_people():
    # Aquire a database connection from the connection pool
    #  and pass it to the function that will use it.
    async with app.db_pool.acquire() as connection:
        # Call the function that will use the database connection
        people = await get_all_people(connection)
        # Return the results
        return {"people": people}


# Define all the other API endpoints
@app.get("/people/{id}")
async def get_person_by_id(id: int):
    async with app.db_pool.acquire() as connection:
        person = await get_person(connection, id)
        return {"person": person}

@app.post("/people")
async def create_new_person(person: Person):
    async with app.db_pool.acquire() as connection:
        new_person = await create_person(connection, person)
        return {"person": new_person}

@app.put("/people/{id}")
async def update_existing_person(id: int, person: Person):
    async with app.db_pool.acquire() as connection:
        updated_person = await update_person(connection, id, person)
        return {"person": updated_person}

@app.delete("/people/{id}")
async def delete_existing_person(id: int):
    async with app.db_pool.acquire() as connection:
        deleted_person = await delete_person(connection, id)
        return {"person": deleted_person}

@app.get("/testdb")
async def test_db():
    async with app.db_pool.acquire() as connection:
        result = await connection.fetchval("SELECT 2 ^ 2;")
        return {"result": result}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,                             # CORS middleware class
    allow_origins=["http://localhost:3000"],    # Only allow requests from this origin
    allow_credentials=True,                     # Lets browser access response cookies, auth headers, etc.
    allow_methods=["*"],                        # Allow all request methods
    allow_headers=["*"],                        # Allow all request headers
)