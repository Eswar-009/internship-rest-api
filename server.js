const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedFields = ["title","company","domain","location","duration","level","description"];

function validate(body) {
  const errors = [];
  for (const field of allowedFields) {
    if (typeof body[field] !== "string" || body[field].trim() === "") {
      errors.push(`${field} is required`);
    }
  }
  return errors;
}

function getInternship(id) {
  return db.prepare("SELECT * FROM internships WHERE id = ?").get(id);
}

app.get("/", (req, res) => {
  res.json({
    message: "Internship REST API",
    version: "1.0.0",
    endpoints: {
      list: "GET /internships?page=1&limit=5",
      detail: "GET /internships/:id",
      create: "POST /internships",
      update: "PUT /internships/:id",
      delete: "DELETE /internships/:id"
    }
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.get("/internships", (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);
  const offset = (page - 1) * limit;

  const total = db.prepare("SELECT COUNT(*) AS count FROM internships").get().count;
  const data = db.prepare(
    "SELECT * FROM internships ORDER BY id ASC LIMIT ? OFFSET ?"
  ).all(limit, offset);

  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

app.get("/internships/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, error: "Invalid internship ID" });
  }

  const internship = getInternship(id);
  if (!internship) {
    return res.status(404).json({ success: false, error: "Internship not found" });
  }

  res.status(200).json({ success: true, data: internship });
});

app.post("/internships", (req, res) => {
  const errors = validate(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, error: "Validation failed", details: errors });
  }

  const values = allowedFields.map(field => req.body[field].trim());
  const result = db.prepare(`
    INSERT INTO internships
    (title, company, domain, location, duration, level, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(...values);

  const created = getInternship(result.lastInsertRowid);
  res.status(201).json({ success: true, message: "Internship created", data: created });
});

app.put("/internships/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, error: "Invalid internship ID" });
  }

  if (!getInternship(id)) {
    return res.status(404).json({ success: false, error: "Internship not found" });
  }

  const errors = validate(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, error: "Validation failed", details: errors });
  }

  const values = allowedFields.map(field => req.body[field].trim());
  db.prepare(`
    UPDATE internships
    SET title=?, company=?, domain=?, location=?, duration=?, level=?, description=?,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(...values, id);

  res.status(200).json({
    success: true,
    message: "Internship updated",
    data: getInternship(id)
  });
});

app.delete("/internships/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, error: "Invalid internship ID" });
  }

  if (!getInternship(id)) {
    return res.status(404).json({ success: false, error: "Internship not found" });
  }

  db.prepare("DELETE FROM internships WHERE id = ?").run(id);
  res.status(200).json({ success: true, message: "Internship deleted" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Internship API running at http://localhost:${PORT}`);
});
