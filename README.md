# FastAPI Starter

### Preface

This is a starter template for building a fullstack web app with FastAPI and React. It is intended to be used as a starting point for HCP members to build their projects. It is not intended to be a comprehensive tutorial on FastAPI or React. Instead, it is intended to provide a basic understanding of how to use FastAPI and React together. This document assumes a basic understanding of Python, Javascript, and web development in general, but goes into far more detail on how to use FastAPI in a frontend-agnotic way.

### What is FastAPI?
FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints. In a lot of ways, FastAPI's philosophy is similar to Express' in that it does one thing very well (building APIs) and is unopinionated about everything else (with the exception of dependency injection). FastAPI is a relatively new framework, but it is already very popular and has a growing community.

### Why FastAPI?
- Fast: Very high performance, on par with NodeJS and Go (thanks to Starlette and Pydantic). One of the fastest Python frameworks available.

- Easy: Designed to be easy to use and learn. The syntax is extremly simple and straight-forward. Minimizes code duplication and leads to less bugs in production.

- Based on (and fully compatible with) the open standards for APIs: OpenAPI (previously known as Swagger) and JSON Schema. Has the added benefit of providing auto-generated documentation for data validation, interactive API docs, and testing in browser.

### FastAPI might be a good fit if:

FastAPI is a good option for teams that want to use Python for their API, but don't want the overhead of learning a complex framework like Django or Flask. FastAPI is unopinionated and allows you to use whatever database, templating engine, or authentication method you want. Compared to a framework like Django, FastAPI is much more lightweight and flexible, but also doesn't provide as many features out of the box (ie batteries are NOT included).

Due to its unopinionated nature, FastAPI might be difficult for beginners because it requires you to make more decisions about how you want to structure your project. However, it is still a good option for beginners because it is very easy to learn and has great documentation. Note that due to its relative lack of maturity, FastAPI is not as well supported as Django or Flask, so you may have to do more research to find answers to your questions (ie reading the actual documentation vs. searching for your question on SO).

FastAPI also relies heavily on modern python features like type hints and async/await, so it may not be a good fit for teams that are unfamiliar with these features/unwilling to learn them.

### Installation
```bash
pip install "fastapi[all]"
```

note: [all] is optional and installs all optional dependencies (including uvicorn, the default http server). If you don't want to install all of them,
you can install them separately.


### Getting Started

Paste this code into a file named "main.py"
```python
# Hello World Example Server
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

Run the server with uvicorn
```bash
# main:app refers to the "app" object in the "main.py" file
# --reload flag will reload the server on file changes
uvicorn main:app --reload
```

To see auto-generated docs, visit http://localhost:8000/docs while the server is running.


### Routing

FastAPI uses decorators to define routes. The decorator function name corresponds to the HTTP method (ie @app.get, @app.post, @app.put, @app.delete, etc). The first argument is the path, and the function itself is the handler. The handler function can be async or not, depending on whether you need to use await inside of it.

```python
# Path: main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def read_item(name: str):
    return {"message": f"Hello {name}"}
```

### Request Parameters

FastAPI automatically parses query parameters, path parameters, and request bodies into the appropriate python types. It also automatically generates documentation for these parameters.

```python

# Path: main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def greet(name: str):
    return {"message": f"Hello {name}"}

# q is a query parameter, and is automatically parsed into an int
# if you don't pass in a value for q, it will default to None
# if you pass in a value that can't be parsed into an int, FastAPI will return a 422 error
@app.get("/greeting/{name}/age")
async def greet_age(name: str, q: int = None):
    return {"message": f"Hello {name}, you are {q} years old"}
```

If you try to pass in a parameter that doesn't match the type, FastAPI will automatically return a 422 error with a helpful message...
```json
// success: /greeting/elijah/age?q=20
{
    "message":"Hello elijah, you are 20 years old"
}

// fail: /greeting/elijah/age?q=hi
{
    "detail":[
        {
            "type":"int_parsing",
            "loc":["query","q"],
            "msg":"Input should be a valid integer, unable to parse string as an integer",
            "input":"hi",
            "url":"https://errors.pydantic.dev/2.4/v/int_parsing"
        }
]}
```

### Request Body

FastAPI automatically parses request bodies into the appropriate python types using a module named pydantic. It also automatically generates documentation for these parameters.

```python
# Path: main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# defined a model for the request body
class Person(BaseModel):
    name: str
    age: int

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def greet(name: str):
    return {"message": f"Hello {name}"}

@app.get("/greeting/{name}/age")
async def greet_age(name: str, q: int = None):
    return {"message": f"Hello {name}, you are {q} years old"}

# Person is automatically parsed into a Person object
@app.post("/person")
async def create_person(person: Person):
    # person is automatically parsed into a Person object

    #   ...
    #   ...
    #   code to save person to database
    #   ...
    #   ...

    print(f"{person.name} was saved to the database")

    return {"message": f"Hello {person.name}, you are {person.age} years old"}
```

### Dependency Injection

FastAPI has built-in support for dependency injection. This is useful for injecting dependencies like database connections, authentication, etc into your route handlers. FastAPI uses the term "dependency" to refer to any object that can be injected into a route handler. Dependencies can be functions, classes, or any other python object.

```python
# Path: main.py
from fastapi import FastAPI, Depends
from pydantic import BaseModel

app = FastAPI()

class Person(BaseModel):
    name: str
    age: int

# Dependency
def get_save_func():
    def save_person_in_db(person: Person):
        # code to save person to database
        print(f"{person.name} was saved to the database")

        return True
    return save_person_in_db

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def greet(name: str):
    return {"message": f"Hello {name}"}

@app.get("/greeting/{name}/age")
async def greet_age(name: str, q: int = None):
    return {"message": f"Hello {name}, you are {q} years old"}

# Dependency is injected into the route handler
@app.post("/person")
async def create_person(person: Person, save_person = Depends(get_save_func)):
    save_person(person)
    return {"message": "Person was created successfully"}
```

### Static Files

FastAPI has built-in support for serving static files. To serve static files, create a folder named "static" in the root directory of your project. Then, add a parameter to your FastAPI app named "static_dir" and set it to the path of your static folder. FastAPI will automatically serve any files in this folder.

```python
# Path: main.py
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

### mounts the static folder to the /static route
app.mount("/static", StaticFiles(directory="static"), name="static")

class Person(BaseModel):
    name: str
    age: int

# Dependency
def get_save_func():
    def save_person_in_db(person: Person):
        # code to save person to database
        print(f"{person.name} was saved to the database")

        return True
    return save_person_in_db

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/greeting/{name}")
async def greet(name: str):
    return {"message": f"Hello {name}"}

@app.get("/greeting/{name}/age")

async def greet_age(name: str, q: int = None):
    return {"message": f"Hello {name}, you are {q} years old"}

@app.post("/person")
async def create_person(person: Person, save_person = Depends(get_save_func)):
    save_person(person)
    return {"message": "Person was created successfully"}
```

One can now access files in the static directory by visiting http://localhost:8000/static/{filename}. This is a powerful feature that allows you to serve bundled SPA's (ie React, Vue, Angular) from the same server as your API. In fact, let's do that now...



### Databases

Lets add a database into the mix. we will be using [Supabase](https://supabase.com/), a new open source alternative to Firebase. Specifically, we will be
using their managed Postgres database. Supabase is a great option for small projects because it is free and easy to set up.

To get started, create an account on Supabase and create a new project. Then, create a new table named "people" by pasting this into the SQL query editor:
```sql
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INT NOT NULL
);
```

Now, we need to connect our application to our database. Navigate to the "Settings" tab in your Supabase project and copy the "Connection String" under "Database Credentials". These are the juicy little bits of information that we need to connect to our database. Next, install [asyncpg](https://magicstack.github.io/asyncpg/current/) using pip:
```bash
pip install asyncpg
```

Now, we can connect to our database and run queries. Create a new file named "database.py" in the root of your project and paste the following code:
```python
# Path: database.py
import asyncpg

async def create_db_pool():
    return await asyncpg.create_pool(
        user: "your_user_name",
        password: "your_password",
        database: "your_database_name",
        host: "your_host",
    )
```

Next, we will define two events, "startup" and "shutdown", that will run when our server starts and stops. We will use these events to connect to our database and close the connection when the server stops. Paste the following code into "main.py":
```python
# Path main.py

# ... other imports ...
from database import create_db_pool

# ... other code ...

# ... create app variable ...

# Create a FastAPI event that will be triggered when the application starts
@app.on_event("startup")
async def startup_db_pool():
    app.db_pool = await create_db_pool()

# Create a FastAPI event that will be triggered when the application stops
@app.on_event("shutdown")
async def shutdown_db_pool():
    await app.db_pool.close()

# ... other code ...
```

Now that we have a database connection, we can create a route handler that will test the connection. Paste the following code into "main.py":
```python
# Path main.py

# ... imports ...

# ... app code ...

# ... events ...

# ... other routes ...

@app.get("/testdb")
async def test_db():
    async with app.db_pool.acquire() as connection:
        result = await connection.fetchval("SELECT 2 ^ 2;")
        return {"result": result}

```

Now, if you visit http://localhost:8000/testdb and see the following, it means we have successfully connected to our database!

```json
{
    "result": 4
}
```

### CRUD Operations

Let's get serious. Now that we have a database, we can get rid of all of these silly endpoints and start building a real API. We will be building a simple API that allows us to perform CRUD operations on a "person" resource. We will be using the following endpoints:

- GET /people - returns a list of all people
- GET /people/{id} - returns a single person
- POST /people - creates a new person
- PUT /people/{id} - updates a person
- DELETE /people/{id} - deletes a person

First, we will update our Person model to also contain an `id` field. This will allow us to pass Person objects directly to our database queries. We need to make this field optional because we won't have an id until we create the person in our database.

Furthermore, we will create a new file named "models.py" to store our models. Paste the following code into "models.py":

```python
# Path: models.py
from typing import Optional
from pydantic import BaseModel, Field

class Person(BaseModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
```

We can now remove the inital Person model from "main.py" and import it from "models.py" instead:
```python
# Path: main.py
# ... other imports ...
from models import Person

# ... other code ...
```


Next, we will create a new file named "crud.py" to store our database queries. Paste the following code into "crud.py":

```python
# Path: crud.py
from models import Person

async def get_all_people(connection):
    return await connection.fetch("SELECT * FROM people;")

async def get_person(connection, id):
    return await connection.fetchrow("SELECT * FROM people WHERE id = $1;", id)

async def create_person(connection, person: Person):
    return await connection.fetchrow("INSERT INTO people (name, age) VALUES ($1, $2) RETURNING *;", person.name, person.age)

async def update_person(connection, id, person: Person):
    return await connection.fetchrow("UPDATE people SET name = $1, age = $2 WHERE id = $3 RETURNING *;", person.name, person.age, id)

async def delete_person(connection, id):
    return await connection.fetchrow("DELETE FROM people WHERE id = $1 RETURNING *;", id)
```

Now, we can import these functions into our route handlers and use them to perform CRUD operations. Lets get rid of all of the old routes (except /testdb) and replace them with our new CRUD routes. Paste the following code into "main.py":

```python
# Path: main.py
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from database import create_db_pool
from models import Person
from crud import get_all_people, get_person, create_person, update_person, delete_person

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

# Create a FastAPI event that will be triggered when the application starts
@app.on_event("startup")
async def startup_db_pool():
    app.db_pool = await create_db_pool()

# Create a FastAPI event that will be triggered when the application stops
@app.on_event("shutdown")
async def shutdown_db_pool():
    await app.db_pool.close()


@app.get("/people")
async def get_people():
    async with app.db_pool.acquire() as connection:
        people = await get_all_people(connection)
        return {"people": people}

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

```

Now, if you visit http://localhost:8000/people, you should see an empty list.

```json
{
    "people": []
}
```

Now, lets create a new person by typing in the following command in the terminal:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Elijah", "age": 20}' http://localhost:8000/people
```

You should see the following response:
```json
{
    "person": {
        "id": 1,
        "name": "Elijah",
        "age": 20
    }
}
```

Now, if you visit http://localhost:8000/people, you should see a list with one person in it.

```json
{
    "people": [
        {
            "id": {id},
            "name": "Elijah",
            "age": 20
        }
    ]
}
```

Now, lets update the person by typing in the following command in the terminal (making sure to replace {id} with the id of the person we just created):
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name": "Elijah", "age": 21}' http://localhost:8000/people/{id}
```

You should see the following response:
```json
{
    "person": {
        "id": {id},
        "name": "Elijah",
        "age": 21
    }
}
```

Go ahead and test your other endpoints. If you want to delete the person, you can type in the following command in the terminal (making sure to replace {id} with the id of the person we just created):
```bash
curl -X DELETE http://localhost:8000/people/{id}
```

And similarly, if you want to get a single person, you can type in the following command in the terminal (making sure to replace {id} with the id of the person we just created):
```bash
curl http://localhost:8000/people/{id}
```

### Managing Secrets

Now that we have a working API, we need to make sure that we are managing our secrets properly. We should never commit secrets to our git repository. Instead, we should store them in environment variables. We can then access these environment variables in our code.

We will be using [python-dotenv](https://pypi.org/project/python-dotenv/) to manage our environment variables. This is a simple library that allows us to store environment variables in a file named ".env" in the root of our project. We can then access these variables using the `os.getenv()` function.

First, install python-dotenv using pip:
```bash
pip install python-dotenv
```

Next, create a file named ".env" in the root of your backend and paste the following code into it:
```
DB_USER=your_user_name
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_HOST=your_host
```

Now, we can access these variables in our code. Update "database.py" to the following:
```python
# Path: database.py
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def create_db_pool():
    return await asyncpg.create_pool(
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME"),
        host = os.getenv("DB_HOST"),
    )
```

### Serving a React App

React is a popular frontend framework for building single page applications (SPA's). SPA's are web apps that load a single HTML page and dynamically update that page as the user interacts with the app. SPA's are typically built with a frontend framework like React, Vue, or Angular, and communicate with a backend API to fetch data and perform CRUD operations.


We have included the boiler plate for a simple react app. To run the app, `cd` into the "starter-frontend" directory and run the following commands:
```bash
npm install; npm start
```

This will start the react app on port 3000. You should see a simple form with a text input and a submit button. If you type in a name and click submit, you should see a message that says "Hello {name}".

However, We will be "bundling" all of the code for this app into a "build" folder. To do this, run the following command:
```bash
npm run build
```

This will create a "build" folder in the root of the frontend directory. This folder contains all of the code for the app, but it is minified and bundled into a single file. This is the code that we will serve from our FastAPI server.

If we were cavepeople, we would run `npm build`, then copy the contents of the build folder into our static folder. However, we are not cavepeople, so instead we've included a script that will do this for us. To run the script, run the following command:
```bash
npm run local-deploy
```

This is really an alias defined in our "package.json" file. It runs the following commands:
```bash
npm run build; cp -r build/static/* ../starter-backend/static/; cp build/index.html ../static; rm -rf build
```

Feel free to define your own scripts in "package.json"! You'll be a 10x developer in no time.

Now that we've copied the contents of our frontend build into the static folder, we should be able to visit the app at http://localhost:8000/static/index.html. Isn't that cool? We are serving our frontend and backend from the same server!


### CORS

CORS (Cross-Origin Resource Sharing) is a security mechanism that prevents malicious websites from making requests to your API. CORS is enabled by default in FastAPI, but we need to configure it to allow requests from our frontend. To do this, we will use the [fastapi-cors](https://pypi.org/project/fastapi-cors/) library.

First, install fastapi-cors using pip:
```bash
pip install fastapi-cors
```

Next, import the CORSMiddleware class from fastapi-cors and add it to our app. Update "main.py" to the following:
```python
# Path: main.py
# ... other imports ...
from fastapi.middleware.cors import CORSMiddleware

# ... other code ...

# ... events ...

# ... other routes ...

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```


You should now be able to make requests to your API from your frontend!

