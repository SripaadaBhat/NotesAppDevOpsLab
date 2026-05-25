
# 📝 NotesApp

A lightweight, full-stack notes management web application built with **Node.js** and **Express**. Users can create, view, and delete notes through a clean browser interface, with data persisted to a local JSON file on the server.

---

## Features

- **Add notes** — Type a note and click Add to save it instantly
- **View notes** — All notes are displayed in reverse-chronological order
- **Delete notes** — Remove any note with a single click
- **Persistent storage** — Notes are stored in a `notes.json` file on the server
- **Static frontend** — Served directly by Express from the `public/` directory

---

## Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Runtime   | Node.js 20             |
| Framework | Express 5              |
| Frontend  | Vanilla HTML/CSS/JS    |
| Storage   | JSON file (`/tmp/notes.json`) |
| Testing   | Jest + Supertest       |

---

## Project Structure

```
NotesApp/
├── public/
│   ├── index.html       # Main UI
│   ├── script.js        # Frontend fetch logic (add, delete, list notes)
│   └── style.css        # Styling
├── tests/
│   └── server.test.js   # API integration tests (Jest + Supertest)
├── server.js            # Express server and REST API
├── package.json
├── Dockerfile
├── Jenkinsfile          # Jenkins CI/CD pipeline
├── azure-pipelines.yml  # Azure DevOps pipeline
└── vercel.json          # Vercel routing config
```

---

## API Endpoints

| Method   | Endpoint       | Description              |
|----------|----------------|--------------------------|
| `GET`    | `/notes`       | Retrieve all notes       |
| `POST`   | `/notes`       | Add a new note           |
| `DELETE` | `/notes/:id`   | Delete a note by its ID  |

**POST body:**
```json
{ "text": "Your note content here" }
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Run Locally

```bash
# Install dependencies
npm install

# Start the server
node server.js
```

The app will be available at **http://localhost:3000**.

---

## Running Tests

Tests use Jest and Supertest. Install dev dependencies if needed, then run:

```bash
npm test
```

A coverage report is generated in the `coverage/` directory.

---

## Docker

Build and run the app in a container:

```bash
# Build the image
docker build -t notes-app .

# Run the container
docker run -d -p 3000:3000 --name notes-app-container notes-app
```

The app will be accessible at **http://localhost:3000**.

The pre-built image is also available on DockerHub:

```bash
docker pull sripaada265/notes-app:latest
```

---

## CI/CD Pipelines

The project includes two CI/CD pipeline configurations:

### Jenkins (`Jenkinsfile`)

Runs on a Jenkins agent with Node.js and Docker installed. Stages:

1. **Clean Workspace** — Clears the workspace before each run
2. **Clone Repository** — Checks out the `main` branch from GitHub
3. **Install Dependencies** — Runs `npm install`
4. **OWASP Dependency Check** — Scans for known vulnerabilities (NVD API required)
5. **SonarQube Analysis** — Static code analysis for quality and coverage
6. **Build Docker Image** — Builds `notes-app:latest`
7. **Run Docker Container** — Starts the container on port 3000
8. **Push to DockerHub** — Tags and pushes to `sripaada265/notes-app:latest`
9. **Deploy Frontend to Vercel** — Deploys the static frontend via Vercel CLI
10. **Deploy Backend to Render** — Triggers a Render.com deployment via API

**Required Jenkins credentials:**

| Credential ID      | Description                   |
|--------------------|-------------------------------|
| `RENDER_API_KEY`   | Render.com API key            |
| `nvd-api-key`      | NVD API key for OWASP check   |
| `dockerhub-creds`  | DockerHub username/password   |
| `VERCEL_TOKEN`     | Vercel deployment token       |

---

### Azure DevOps (`azure-pipelines.yml`)

Runs on a self-hosted agent pool (`SelfHostedPool`). Triggered on pushes to `main`. Stages:

1. **BuildAndAnalyze** — Install Node.js 20, install dependencies, run OWASP Dependency Check, run SonarQube analysis
2. **Docker** — Build Docker image, run container on port 3001, push to DockerHub
3. **DeployToVercel** — Deploy frontend to Vercel using Vercel CLI
4. **Deploy** — Trigger backend deployment on Render.com via API

**Required pipeline variables/secrets:**

| Variable             | Description                         |
|----------------------|-------------------------------------|
| `SONAR_TOKEN`        | SonarQube authentication token      |
| `VERCEL_TOKEN`       | Vercel deployment token             |
| `VERCEL_ORG_ID`      | Vercel organization ID              |
| `VERCEL_PROJECT_ID`  | Vercel project ID                   |
| `RENDER_SERVICE_ID`  | Render.com service ID               |
| `RENDER_API_KEY`     | Render.com API key                  |

---

## Deployment

### Vercel (Frontend)

Routing is configured in `vercel.json`. Static assets are served from `public/`, and API routes (`/notes`, `/notes/*`) are proxied to `server.js` via `@vercel/node`.

### Render (Backend)

The backend is deployed to Render.com. Deployments are triggered automatically by the CI/CD pipelines via the Render Deploy API.

---

## Environment Variables

| Variable | Default | Description            |
|----------|---------|------------------------|
| `PORT`   | `3000`  | Port the server runs on |

Copy `.env.local` and adjust values as needed for local development.

---

## Notes on Storage

Notes are persisted to `/tmp/notes.json` on the server. This path is ephemeral on platforms like Vercel and Render — notes will not survive container restarts. For production use, replace the file-based store with a database (e.g., MongoDB, PostgreSQL).
