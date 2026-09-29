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

- Dockerfile: `FROM node:24.19.0-slim`
  Told: an image is a saved Linux folder tree (Debian + Node here); `FROM` starts from it and every line adds on top. The tag must match `mise.toml`, or `server.ts` fails in the container while it works on the Mac.
  Open: I saw a Debian tree inside; I don't know how Linux runs on my Mac, or whether a container has its own kernel.

- Dockerfile: `COPY package.json package-lock.json ./` → `RUN npm ci --omit=dev` → `COPY . .`
  Told: each line is a saved step; a rebuild reuses steps until the first changed input, so dependencies go before code. Saw it: editing `server.ts` left steps 2–4 `CACHED`.
  Open: I know the order makes rebuilds fast; I don't know how Docker decides an input "changed", or what a saved step (layer) physically is.

- .dockerignore: `node_modules`, `web`, `.env`, `.git`
  Told: filters the build context (the folder given to `docker build`); without `.env` here, `COPY . .` bakes the password into the image.
  Open: I don't know where a built image is stored, or who can get it and read its files.

- compose.yaml: the whole file, pasted at once
  Told: three kinds of names — ones I choose (`db`, `api`, `db-data`: they only have to match), Compose keywords (`services`, `build`, `volumes`…: Compose file reference), and ones fixed by the image (`POSTGRES_PASSWORD`, `/var/lib/postgresql`: the image's Docker Hub page).
  Open: I can sort a name into its kind when asked; I could not write this file from an empty editor, and I don't know which keys a service can have. Step 12 builds it line by line, running after each line.

- compose.yaml: `- db-data:/var/lib/postgresql` and the bottom `volumes: db-data:`
  Told: a plain name on the left = a named volume Docker manages; a path (`./schema.sql`) = a file from my machine. The bottom block declares the named volume. From Postgres 18 the data lives in `/var/lib/postgresql`, not `/data` as in most online examples.
  Open: I know the data survives `down`; I don't know where the volume physically is on the Mac or the VPS.

- compose.yaml: `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}` and `./schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro`
  Told: Compose fills `${...}` from `spine/.env`; the container sees only what is under `environment:`. The image uses the password and runs `schema.sql` **only on first start with an empty data folder**, so changing the password in `.env` later breaks the login.
  Open: I don't know what program inside the image reads these on first start, or how I would change the table once data exists (step 19).

- compose.yaml: `ports: - "3000:3000"`, `@db:5432`, `depends_on: - db`
  Told: `<Mac port>:<container port>`; Docker forwards to the container's `eth0` door, so the app must listen on `0.0.0.0`. Service names work as hostnames on the Compose network. `depends_on` waits for the container to start, not for Postgres to be ready.
  Open: I don't know what on my Mac holds port 3000 while forwarding, who answers the name `db`, or what "ready" would mean for `depends_on`.

## Cleared

<!-- move entries here with a one-line note on what made it click, or just delete them.
     Keeping a few is useful evidence for step 21. -->
