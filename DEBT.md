# Debt

Every block I copied and understand only **shallowly**. Not "no idea what this is" — that would be useless. The point is the question left open.

**Phase 0 is not done until this file is empty.** (Route step 20 empties it; step 21 proves it.)

Entries are written **at the moment of pasting**, never afterwards — a retrospective debt list is fiction.

**Clearing an entry:** explain it aloud, then rewrite the block from memory. Not "the agent says it looks fine." Delete the entry only after that.

## Format

```
- <file>: `<the line or block>`
  Told: <the one-or-two-sentence narration I got when I pasted it>
  Open: <the question I still cannot answer>
```

Worked example:

```
- Dockerfile: `COPY package*.json ./` before `COPY . .`
  Told: makes rebuilds faster by caching the npm install step.
  Open: how does layer caching decide what to reuse?
```

## Open

- server.ts: `await app.listen({ port: 3000 })`
  Told: binds a TCP port, so the OS hands every connection arriving for that port to this process. Awaited because binding can fail — the port may already be taken.
  Open: what *is* a TCP connection, and what does "binding a port" actually do at the OS level? I can say the sentence; I cannot draw it.

- (typed command, route step 2): `docker run --name spine-pg -e POSTGRES_PASSWORD=spine -e POSTGRES_DB=spine -p 5432:5432 -d postgres:18`
  Told: starts a Postgres container in the background under a fixed name; the `-e` variables configure it on first boot only, and `-p` forwards port 5432 on the Mac to 5432 inside the container.
  Open: I can recite each flag. I cannot say what `-p` really connects to what — what is listening on the container side, whether anything on my Mac can see it, and what happens if something already holds 5432.

- (typed command, route step 2): `docker exec -it spine-pg psql -U postgres -d spine`
  Told: runs an extra command *inside* an already-running container; `-it` gives `psql` an interactive terminal, without which there is no prompt.
  Open: what does "inside" mean? Is `psql` a separate process, does it share anything with my Mac, and why does that container have a filesystem with `psql` in it at all?

## Cleared

<!-- move entries here with a one-line note on what made it click, or just delete them.
     Keeping a few is useful evidence for step 21. -->
