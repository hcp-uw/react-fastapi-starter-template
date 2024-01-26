from models import Person
from asyncpg.connection import Connection

# Function that queries the database using a connection
async def get_all_people(connection: Connection):
    # Query the database using the connection
    return await connection.fetch("SELECT * FROM people;")

async def get_person(connection, id):
    return await connection.fetchrow("SELECT * FROM people WHERE id = $1;", id)

async def create_person(connection, person: Person):
    return await connection.fetchrow("INSERT INTO people (name, age) VALUES ($1, $2) RETURNING *;", person.name, person.age)

async def update_person(connection, id, person: Person):
    return await connection.fetchrow("UPDATE people SET name = $1, age = $2 WHERE id = $3 RETURNING *;", person.name, person.age, id)

async def delete_person(connection, id):
    return await connection.fetchrow("DELETE FROM people WHERE id = $1 RETURNING *;", id)