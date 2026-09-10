import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/api/health", async () => {
  return { status: "ok" };
});

await app.listen({ port: 3000 });
