# Build no contexto da raiz do monorepo: docker build -f apps/site/Dockerfile .
# (o site depende de @innovui/react via workspace:*, então precisa do repo inteiro)

FROM node:24-alpine AS build
WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/react/package.json packages/react/package.json
COPY apps/site/package.json apps/site/package.json
RUN pnpm install --frozen-lockfile

COPY packages/react packages/react
COPY apps/site apps/site
RUN pnpm --filter @innovui/react build
RUN pnpm --filter site build

FROM nginx:alpine AS runtime
COPY apps/site/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/site/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
