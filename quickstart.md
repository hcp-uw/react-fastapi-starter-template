# Requirements

- python 3
- pip
- node.js
- npm

# Installation

## Frontend


```bash
cd starter-frontend
npm install
```

## Backend

```bash
cd starter-backend
pip install "fastapi[all]"
```

# Running

## Frontend

For development:

```bash
cd starter-frontend
npm start
```

For production*:

```bash
cd starter-frontend
npm run local-deploy
```

note: This builds your front end and serves it from the backend at [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)



## Backend

```bash
uvicorn main:app --reload
```

