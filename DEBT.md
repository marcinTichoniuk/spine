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

- caddy/Caddyfile: `:80 { respond "hello from caddy" }`
  Told: `:80` is the site address: any name, port 80, plain HTTP, so Caddy turns automatic HTTPS off (its log says so). `respond` is a directive: answer every request with this text and status 200.
  Open: I know a domain name in the address will turn HTTPS on; I don't know what Caddy does differently for a name than for `:80`.

- compose.yaml: the `caddy` service (`image: caddy:2.11.7`, `ports: "80:80"`, `volumes: ./caddy:/etc/caddy`)
  Told: a ready image, no Dockerfile. The image reads `/etc/caddy/Caddyfile` (path fixed by the image); my `./caddy` folder appears there. Mount the folder, not the file: editors replace the file on save, and a file mount keeps showing the old one. Caddy reads the file only at start, so after an edit: `docker compose restart caddy`.
  Open: I know my folder shows up at `/etc/caddy`; I don't know if it is a copy or the same files, or where `/data` and `/config` (in the logs) live.

- caddy/Caddyfile: `reverse_proxy /api/* api:3000`
  Told: Vite's `proxy` line, moved into Caddy. `/api/*` is a matcher: only these paths. `api:3000` is the Compose service name (`localhost` would be Caddy's own container). Caddy makes a new request to Fastify and sends the answer back as its own, stamped `Via: 1.1 Caddy`.
  Open: I know a path with no matching line gets an empty 200; I don't know which line wins when two lines could match the same path.

- caddy/Caddyfile: `basic_auth { marcin <hash> }`, hash from `docker compose exec caddy caddy hash-password`
  Told: one username and password for the whole site, checked before anything is forwarded. No `Authorization` header → `401` + `WWW-Authenticate`, and the browser shows its popup. The header is `username:password` in base64 (I decoded `marcin:wrong` myself), so it is safe only over HTTPS. The file holds a hash, and the repo is public, so the password must be long and random.
  Open: I know Caddy hashes what it gets and compares; I don't know why a hash cannot be turned back into the password, or why that makes a long password matter. (Phase 1, password storage.)

- caddy/Caddyfile: `root * /srv` and `file_server`
  Told: `root` is the folder Caddy looks in, inside its own container; `/srv` is my choice (Linux convention, Caddy's Docker Hub examples), and it only has to match the mount in `compose.yaml`. `file_server` answers with the file that matches the URL path; `/` gives `index.html`. No file → Caddy's own empty `404`.
  Open: I know a missing file gives 404; I don't know what happens for a React page URL that is not a file (like `/links/5`).

- compose.yaml: `- ./web/dist:/srv` under the `caddy` service
  Told: my Mac folder appears inside Caddy's container at `/srv`, the folder `root` points to. Mounts are fixed when a container is created, so after a `compose.yaml` change: `up -d` (new container), not `restart` (same container, old settings). `web/dist` comes from `npm run build` and is not in git.
  Open: I know it works on the Mac because `web/dist` is there; I don't know how the files get to the VPS, where `git clone` will not bring them.

- (typed command, VPS): `sudo docker run --rm --user node --volume /home/ubuntu/spine/web:/app --workdir /app node:24.19.0-slim npm ci` (then the same with `npm run build`)
  Told: the VPS has no Node, so a throwaway container borrows it from the image. `--volume` = a bind mount: the VPS folder `web` appears at `/app` (same folder, not a copy). `--workdir /app` = start there (like `WORKDIR`). `--user node` = UID 1000 = `ubuntu` on the VPS, so the files are not owned by root. `--rm` deletes the container; the image and the files stay.
  Open: I can explain each flag; I don't know how step 14 does the same inside a Dockerfile, with no mount.

- compose.yaml: `"127.0.0.1:3000:3000"` under the `api` service
  Told: the address in front limits who can open the port on the host: only programs on the same machine. The internet cannot reach Fastify directly anymore, so every outside request goes through Caddy and its password. Caddy still reaches `api:3000` over Docker's network. I saw it: `localhost:3000` → 200, `192.168.0.17:3000` → "Couldn't connect", `192.168.0.17:80` → Caddy's 401.
  Open: I know the internet cannot reach 3000; I don't know why my own `curl` on the VPS showed up in Fastify's log as `172.18.0.1`, not `127.0.0.1`.

- compose.yaml: `"443:443"` under the `caddy` service
  Told: HTTPS arrives on 443, so the host passes it to Caddy's container. An open port is not enough: with `:80` in the `Caddyfile`, curl got `(35) SSL_connect` (door open, nobody inside), not `(7) Couldn't connect` (no door). Caddy listens on 443 only when the address line has a name. Seen on the VPS: port 80 answers `308 Permanent Redirect` + `Location: https://…`, before any password check.
  Open: I know `"443:443"` forwards TCP; I don't know why HTTP/3 (`alt-svc: h3`) would need `"443:443/udp"` as well. *(Answered 2026-10-15, see the next entry; clear both together.)*

- compose.yaml: `"443:443/udp"` under the `caddy` service
  Told: every port exists twice, TCP and UDP. `"443:443"` means `/tcp` by default. HTTP/3 runs on QUIC, which runs on UDP, so Caddy's `alt-svc: h3` promise needs the UDP door too. Seen: `ss` showed `udp UNCONN … :443` held by `docker-proxy`; Chrome's Protocol column went `h2` → `h3` after a few reloads.
  Open: I know HTTP/3 needs UDP; I don't know what QUIC does about lost packets that TCP did for me before.

- caddy/Caddyfile: `encode zstd gzip`
  Told: Caddy compresses responses while sending them, in the first format the browser lists in `Accept-Encoding`. My JS went from 216 KB to about 70 KB (`content-encoding: zstd`), and `content-length` disappeared, because the size is not known when the headers go out.
  Open: I know it shrinks text files; I don't know if Caddy also compresses images, or why compressing a JPEG would be pointless.

- compose.yaml: `caddy_data:/data` under `caddy`, and `caddy_data:` under the top-level `volumes:`
  Told: Caddy saves its certificate in `/data` (path fixed by the image). Without a named volume, every recreated container asks Let's Encrypt again, and the limit is 5 certificates per name per week. `caddy_data` is my name; same pattern as `db-data:/var/lib/postgresql`.
  Open: I know the certificate lives there; I don't know what else Caddy keeps in `/data`, or what `/config` from the logs is for.

- caddy/Caddyfile: `{$SITE_ADDRESS} {` as the first line
  Told: one file in git, two machines. The Mac needs `:80` (any name, plain HTTP); the VPS needs the domain, because a name in the address line is what turns HTTPS on. `{$NAME}` is Caddy's env-var syntax (`$` inside the braces; Compose's is `${NAME}`). I saw it empty: line 1 became `{`, Caddy read the block as the global options block, and stopped with `unrecognized global option: basic_auth` (only `caddy adapt` printed it; `logs` showed no error).
  Open: I know an empty variable changes what the file means; I don't know what else can go in the global options block.

- compose.yaml: `environment: SITE_ADDRESS: ${SITE_ADDRESS:-:80}` under `caddy`
  Told: passes `SITE_ADDRESS` into the Caddy container. `:-:80` is Compose's syntax for "if missing or empty in `.env`, use `:80`". The Mac's `.env` has no `SITE_ADDRESS`, so it gets `:80`; the VPS `.env` will hold the domain.
  Open: I know the default fills the gap; I don't know where else Compose looks for `SITE_ADDRESS` besides `.env`.

- compose.yaml: `restart: unless-stopped` under `caddy`, `db` and `api`
  Told: tells the Docker daemon to start the container again by itself, e.g. after a VPS reboot. A container I stop by hand stays stopped. It is a container setting, so adding it recreated all three. Seen: after `sudo reboot`, `compose ps` showed `CREATED 10 minutes ago`, `Up 43 seconds`: the same containers, restarted, with no `up -d`.
  Open: I know it brings the app back after a reboot; I don't know what it does when a container crashes again right after every start.

- server.ts: `process.on("SIGTERM", async () => { await app.close(); await pool.end(); })`
  Told: `docker stop` sends SIGTERM ("please stop"), waits 10 s, then SIGKILL (exit 137). Node is PID 1 in the container, and Linux gives PID 1 no default "die on SIGTERM", so with no handler it waited the full 10 s. The handler closes Fastify (open requests finish), then the Postgres pool; then Node has nothing left to do and exits with 0. Seen: `time docker compose stop api` 10.2 s → 0.18 s, `Exited (0)`.
  Open (proposed, confirm next session): I know the handler makes the stop fast; I don't know what happens to a request that is still running when SIGTERM comes.

## Cleared

<!-- move entries here with a one-line note on what made it click, or just delete them.
     Keeping a few is useful evidence for step 21. -->
