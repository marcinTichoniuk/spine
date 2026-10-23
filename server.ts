import Fastify from "fastify";
import pg from "pg";

const app = Fastify({ logger: true });
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/health", async (req, rep) => {
  try {
    await pool.query("SELECT 1");

    return { status: "ok", db: "ok" };
  } catch (error) {
    rep.code(503);
    req.log.error(error);

    return { status: "error", db: "error" };
  }
});

app.get("/api/links", async () => {
  const res = await pool.query("SELECT * FROM links ORDER BY created_at DESC");

  return { data: res.rows, status: "ok" };
});

// TODO: input validation
app.post("/api/links", async (req, rep) => {
  const { body } = req;

  const query = {
    text: "INSERT INTO links (url, title) VALUES ($1, $2) RETURNING *",
    values: [body.url, body.title],
  };

  const res = await pool.query(query);

  rep.code(201).send({ data: res.rows[0], status: "ok" });
});

process.on("SIGTERM", async () => {
  await app.close();
  await pool.end();
});

await app.listen({ port: 3000, host: "0.0.0.0" });
