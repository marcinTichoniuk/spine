set -e

cd ~/spine
git pull
sudo docker compose up -d --build
sudo docker run --rm --user node --volume /home/ubuntu/spine/web:/app --workdir /app node:24.19.0-slim npm ci
sudo docker run --rm --user node --volume /home/ubuntu/spine/web:/app --workdir /app node:24.19.0-slim npm run build
sudo docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
