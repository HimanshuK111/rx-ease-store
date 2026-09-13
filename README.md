
# 💊 MediCare Pharmacy

A deployed full-stack online pharmacy application for browsing over-the-counter and prescription medicines, managing a cart, placing orders, uploading prescriptions securely, and viewing order history.

- Portfolio / mini-project built to demonstrate end-to-end full-stack development, API integration, authentication, cloud deployment, database integration, and private file storage.

## Live Demo

Live Application: https://medicare-pharmacy-ten.vercel.app

API Documentation: https://medicare-pharmacy-api-69f2.onrender.com/docs


## Key Features

- User registration and sign-in with token-based authentication

- Browse and search medicines

- Prescription-only and over-the-counter medicine handling

- Shopping cart and checkout workflow

- Order creation and order history

- Prescription-required checkout validation

- Private prescription upload to Vercel Blob

- Temporary signed URLs for secure prescription viewing

- Responsive pharmacy storefront UI

- Deployed frontend, backend, database, and file-storage integration


## Tech Stack

**Client:** React, TypeScript, TanStack Router, TanStack Query, Zustand, Axios, Tailwind CSS & Vite / TanStack Start

**Server:** FastAPI, Python, SQLAlchemy, Pydantic, JSON Web Token (JWT) authentication

**Data & Storage:** PostgreSQL on Neon, Vercel Blob for private prescription files

**Deployment:**
- Vercel — frontend and server routes
- Render — FastAPI backend
- Neon — managed PostgreSQL database
- GitHub — source control


## Architecture


User Browser
    ->
    React + TypeScript Frontend (Vercel)
    |
    | REST API requests
    ->
FastAPI Backend (Render)
   ->
PostgreSQL Database (Neon)

#### Prescription flow:
- Browser -> signed upload URL -> Private Vercel Blob
                           -> Blob pathname stored with order in PostgreSQL

- Viewing prescription:
 Authenticated user -> Vercel server route  -> ownership verification
                   -> short-lived signed Blob URL -> prescription file

### Prescription Upload Flow

- Prescription files are not stored directly in the database.
- The order is created through the FastAPI backend.
- The frontend requests a short-lived private upload URL.
- The browser uploads the prescription directly to Vercel Blob
- Only the Blob pathname is attached to the order in PostgreSQL.
- When the user selects View prescription, the application verifies the order and generates a temporary signed URL for the private file.
- This keeps prescription files private instead of exposing them through permanent public URLs.
## Project Structure


          rx-ease-store/

         ├── frontend/
         │   ├── src/
         │   │   ├── components/
         │   │   ├── hooks/
         │   │   ├── lib/
         │   │   ├── routes/
         │   │   └── stores/
         │   └── package.json
         │
         ├── backend/
         │   └── app/
         │       ├── routers/
         │       ├── models/
         │       ├── schemas.py
         │       ├── database.py
         │       └── main.py
         │
         └── README.md
## Main API Capabilities

- Authentication: register, login, current user
- Medicines: listing, search/filtering and prescription metadata
- Orders: create, list, order details
- Prescription attachment to orders

Interactive API documentation is available through FastAPI Swagger at the backend /docs endpoint.
## Roadmap

### 1. Clone the repository
- git clone https://github.com/HimanshuK111/rx-ease-store.git
- cd rx-ease-store

### 2. Backend

- cd backend
- python -m venv .venv

Activate the environment and install dependencies, then configure environment variables:
#### Environment Variables

To run this project, you will need to add the following environment variables.

- `DATABASE_URL=your_postgresql_connection_string`
- `SECRET_KEY=your_jwt_secret`
- `API_KEY=your_api_key`
- `CORS_ORIGINS=http://localhost:5173`

#### Run the backend:
`uvicorn app.main:app --reload`
#### Backend will normally run at:
`http://127.0.0.1:8000`


### 3.  Frontend
- cd frontend
- npm install

#### Create the frontend environment configuration:
- `VITE_API_URL=http://127.0.0.1:8000`
- `VITE_API_KEY=your_api_key`

#### Run the frontend:
`npm run dev`




## Deployment Lessons

This project also involved resolving real deployment issues across multiple cloud services, including:

- Cross-Origin Resource Sharing (CORS) configuration between Vercel and Render
- Python runtime compatibility on Render
- Environment variable management
- Linux case-sensitive imports during Vercel builds
- Private Blob storage and signed URLs
- Persisting the correct Blob pathname in PostgreSQL
- End-to-end debugging through browser Network tools and cloud deployment logs.

### What This Project Demonstrates

- Full-stack application development
- Frontend-to-backend REST API integration
- Authentication and protected application flows
- Relational database integration
- Private cloud file storage
- Multi-platform deployment
- Debugging real production deployment issues
- Git-based development and deployment workflow


## Disclaimer
- This is a portfolio / educational project and is not intended for real medical use or handling real patient prescriptions.
## Authors

### Himanshu Singh Kushwaha ([@HimanshuK111](https://github.com/HimanshuK111))
(Frontend/Full-Stack Developer) 


