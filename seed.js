const db = require("./db");

const records = [
  ["Frontend Development Intern","NovaByte Labs","Web Development","Remote","8 weeks","Beginner","Build responsive interfaces and reusable UI components."],
  ["UI/UX Design Intern","PixelCraft Studio","Design","Remote","6 weeks","Beginner","Create user flows, wireframes and accessible interface designs."],
  ["AI & Machine Learning Intern","FutureMind AI","Artificial Intelligence","Hybrid","10 weeks","Intermediate","Work with practical machine-learning and data projects."],
  ["JavaScript Developer Intern","CodeNest Technologies","Web Development","Remote","8 weeks","Beginner","Develop browser-based features using modern JavaScript."],
  ["Data Analytics Intern","InsightGrid","Data Science","Hybrid","8 weeks","Intermediate","Explore datasets and create useful analytical reports."],
  ["Cyber Security Intern","SecureStack","Cyber Security","Remote","6 weeks","Beginner","Learn security fundamentals and practical application security."],
  ["Python Developer Intern","DevOrbit","Software Development","Remote","8 weeks","Beginner","Build small backend and automation applications with Python."],
  ["Cloud Engineering Intern","SkyLayer Systems","Cloud Computing","Hybrid","10 weeks","Intermediate","Learn cloud deployment, services and infrastructure basics."],
  ["Embedded Systems Intern","CircuitWorks","Embedded Systems","On-site","8 weeks","Beginner","Work with embedded programming and hardware-oriented projects."]
];

const insert = db.prepare(`
  INSERT INTO internships
  (title, company, domain, location, duration, level, description)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM internships").get().count;

if (count === 0) {
  const transaction = db.transaction(() => records.forEach(record => insert.run(...record)));
  transaction();
  console.log(`Seeded ${records.length} internship records.`);
} else {
  console.log(`Database already contains ${count} records. No seed performed.`);
}

db.close();
