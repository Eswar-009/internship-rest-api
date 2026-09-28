# Internship REST API — EdVyro Task 2

A beginner-friendly Node.js + Express REST API with SQLite persistence for internship records.

## Stack
- Node.js
- Express
- SQLite via better-sqlite3

## Run locally

```bash
npm install
npm run seed
npm start
```

Open:
`http://localhost:3000`

Health check:
`GET http://localhost:3000/health`

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/internships?page=1&limit=5` | List with pagination |
| GET | `/internships/:id` | Get one internship |
| POST | `/internships` | Create |
| PUT | `/internships/:id` | Update |
| DELETE | `/internships/:id` | Delete |

## Example curl

### List
```bash
curl "http://localhost:3000/internships?page=1&limit=5"
```

### Detail
```bash
curl "http://localhost:3000/internships/1"
```

### Create
```bash
curl -X POST "http://localhost:3000/internships"   -H "Content-Type: application/json"   -d "{"title":"React Intern","company":"WebWorks","domain":"Web Development","location":"Remote","duration":"8 weeks","level":"Beginner","description":"Build accessible web interfaces."}"
```

### Update
```bash
curl -X PUT "http://localhost:3000/internships/1"   -H "Content-Type: application/json"   -d "{"title":"Frontend Developer Intern","company":"NovaByte Labs","domain":"Web Development","location":"Remote","duration":"10 weeks","level":"Beginner","description":"Build responsive web interfaces."}"
```

### Delete
```bash
curl -X DELETE "http://localhost:3000/internships/1"
```

## Validation and status codes
- `200` successful read/update/delete
- `201` successful create
- `400` invalid ID or validation failure
- `404` internship/route not found
- `500` unexpected server error

## Submission
Push this complete folder to a **public GitHub repository** and submit the repository URL as the single proof link.

The records included here are fictional demo records. If EdVyro's downloadable seed/schema files are provided, use those supplied records/schema for the final submission.
