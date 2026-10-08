FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install

COPY . .

# Public origin for canonical URLs, og:url and sitemap.xml (docker build --build-arg VITE_SITE_URL=https://...)
ARG VITE_SITE_URL=https://restricted.cp0x.com
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY serve.json ./serve.json

EXPOSE 4173

# No "-s" (single-page rewrite): every route is a prerendered file (monitor.html, monitor/<id>.html, ...) served via
# cleanUrls, and unknown paths get dist/404.html with a real 404 status (the app still boots there and handles redirects).
CMD ["serve", "dist", "-l", "4173", "-c", "../serve.json"]
