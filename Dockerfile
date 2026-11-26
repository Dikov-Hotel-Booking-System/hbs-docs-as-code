FROM node:24-bookworm-slim AS docs-build
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates git \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install --global "$(node -p 'require("./package.json").packageManager')"
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store --config.fetch-retries=4 --config.fetch-timeout=90000

COPY docusaurus.config.mjs projects.mjs sidebars.mjs ./
COPY scripts/ scripts/
COPY src/ src/

ARG HBS_DOCS_BUILD_ID=local
RUN pnpm build

FROM nginxinc/nginx-unprivileged:stable-alpine AS web
EXPOSE 8080

FROM web AS ci
COPY build/ /usr/share/nginx/html/

FROM web AS local
COPY --from=docs-build /app/build/ /usr/share/nginx/html/
