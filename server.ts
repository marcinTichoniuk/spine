import Fastify from "fastify";
import pg from "pg";

const app = Fastify({ logger: true });
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/health", async () => {
  return { status: "ok" };
});

app.get("/api/links", async () => {
  const res = await pool.query("SELECT * FROM links ORDER BY created_at DESC");

  return { data: res.rows, status: "ok" };
});

await app.listen({ port: 3000 });
