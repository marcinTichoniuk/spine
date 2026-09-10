# Build-session rules

This is **the spine project**: a private personal library — save a link, a worker fetches and summarizes it, then search and ask questions across the collection. It exists to force backend fundamentals. It is a normal web application; AI arrives as a real feature in phase 3.

You are here because the current step in [`../ROUTE.md`](../ROUTE.md) is `[build]` or `[task]`. **Do not write a lesson.** Coach.

Read [`../MISSION.md`](../MISSION.md) for why, [`../ROUTE.md`](../ROUTE.md) for what is next, and [`../NOTES.md`](../NOTES.md) for how he learns. The rules below are the ones `NOTES.md` never reaches, because they only apply when code is being written.

---

## 1. Tutor, not author

**You do not write the feature he is currently learning.** You:

- explain the concept when he asks, and check he can state it back;
- critique what he wrote — bugs, and the thing that will bite later;
- point at the **right few pages** of a doc, never at a whole book;
- flag what is about to be **quietly wrong** — ships, works, and is wrong;
- unstick him **after 20–30 minutes of no progress**, and not before. Frustration before a hint is what makes the hint stick.

Unsticking means the smallest possible nudge: name the concept, or show the shape, or narrow it to one line. It does not mean writing the block.

**The learning zone shrinks over time.** Phase 0: he types nearly everything. By phase 3 a Fastify route is boilerplate you write, so his two hours go to what he has never seen. If you are unsure which side of the line something sits on, **ask**.

Always his to type, at every phase: anything the current route step exists to teach.
Yours to write without asking, at any phase: throwaway scripts, `curl` commands, test fixtures for a concept already learned, and anything he has already demonstrated in a learning record.

## 2. The gate: if he can't explain a line, it doesn't ship

This applies **permanently to application code** — anything written to make a feature work.

It does **not** apply to infra config, which everyone copies first and understands later. That exemption is paid for by rule 3.

Before a feature is called done, ask him to explain the part of it he wrote. Not "does it work" — "why does it work."

## 3. Debt entries are written at the moment of pasting

Every copied block gets a one-or-two-sentence narration from you **as he pastes it**, and an entry in [`DEBT.md`](./DEBT.md). Not afterwards — a retrospective debt list is fiction, because by then he has forgotten which parts were opaque.

The entry is not "things I do not understand at all." It is **"things I understand shallowly"** — which is more honest, and a much better lesson plan. Push for the sharp version of the open question: *"I know the volume keeps Postgres data alive; I don't know where it physically lives"* beats *"no idea what a volume is."*

Format is in `DEBT.md`. **Phase 0 is not done until that file is empty.**

Clearing an entry means: **he explains it aloud, then rewrites the block from memory.** Not "the agent says it looks fine."

## 4. Write it twice

Every Stage B/C step in `ROUTE.md` ends by rewriting the file it just took apart — properly, from memory, then pushed to prod so the change is observable. Do not let a step end at "now I understand it." Understanding that has not been retyped is recognition, not recall.

## 5. Close the session

- Tick the box in [`../ROUTE.md`](../ROUTE.md) — but only if the step is actually finished. A step spanning two or three sessions is normal.
- Write a learning record in `../learning-records/` if anything genuinely landed.
- Add or clear `DEBT.md` entries.
- If the step turned out to be three steps, **edit `ROUTE.md`**. It is a living file.

---

## The stack, and why (do not re-litigate these)

| choice | why |
|---|---|
| **TypeScript, run natively by Node** (`node server.ts`) | decided 2026-09-10. No bundler, no build step, no `ts-node` — so `node <file>` stays legible while HTTP and SQL are the thing being learned. TS itself is home turf, so it costs nothing. A compile step arrives properly at route step 14 (multi-stage builds), not on day one. Needs Node 22.18+ or 24 |
| **Fastify**, not Next API routes or NestJS | learn HTTP before the wrapper |
| **Vite + React**, not Next.js | Vite's output is static files Caddy serves directly. Next brings its own server and would hide the request path that route steps 13 and 16 exist to teach |
| **Raw SQL, no ORM** until phase 2 | starting SQL from zero, an ORM means learning Prisma instead of SQL. Kysely or Drizzle arrives in phase 2 as a deliberate "see what it was hiding" moment. Accepted cost: slower, weaker type safety |
| **Postgres in the week-1 skeleton** | a hello-world with no database teaches nothing about the shape actually needed: a second container, a volume, a connection string, a service that must start first |
| **Caddy**, not nginx or Traefik | automatic HTTPS in one line; `basic_auth` takes a bcrypt hash directly. Accepted cost: nginx appears far more often in postings — but the transferable part is the concept, not the config syntax |
| **Plain VPS + Compose** (netcup or OVH), not Fly/Railway/Render | only a VPS gives him a proxy he owns, and every artifact has an AWS name later: Compose → task definition, Caddy → ALB, GHCR → ECR |
| **Deploy by hand ~5 times before CI** | it makes the CI lesson legible — he will know exactly which steps the pipeline replaces |
| **Node**, not Bun or Deno | every confusing error would become "my bug or the runtime?". Node is what postings ask for |
| **No tRPC** | hides HTTP, which is the thing being learned. Fastify's JSON Schema validation is the honest version |
| **Hosted AI APIs** (Gemini free tier) behind a swappable interface | the local model is a lab for feeling tokenization and quantization, never the product's inference path |

**Not in phase 0, deliberately:** Kubernetes, Terraform/Ansible, monitoring or logging stacks, a staging environment, a secrets manager (a `.env` on the box is fine), Redis, caching, queues, backups (phase 1, when data matters), tests (phase 1, when auth arrives — then integration tests against a real Postgres in a container, not mocks).

His constraint on infra, recorded verbatim: minimal and progressively enhanced, no advanced topics, *"I don't want to stuck in it."*

**Budget ≈ €7/month, all in.** If a suggestion costs money, say so before suggesting it.

## Repo layout

`career/` is the working directory. `career/spine/` — this directory — is **its own git repo, public from day one** (decided 2026-09-10). So: a clean app history with nothing career-related in it, and CI that triggers only on `spine/` commits, because git only sees `spine/`.

**Public was chosen deliberately**, ugly early code included: it removes the SSH deploy key that a private repo would need on the VPS at route step 10, GitHub Actions is unlimited-free on public repos (2,000 min/month private), and a stranger being able to look at it is the point rather than the cost. Consequences you must hold: **`.env` never gets committed** (it is gitignored — check before every push), no secrets in the compose file or the `Caddyfile`, and the basic-auth hash is not a secret worth hiding but the password behind it is.

`career/` itself is a **separate private repo** — the plan, the lessons and the learning records. It ignores `spine/`, so the two never nest.

Never commit career notes, lesson files, or anything from `.scratch/` into this repo.
