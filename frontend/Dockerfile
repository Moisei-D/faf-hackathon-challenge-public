# VITE_* are baked in at build time, so they come in as build args.
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

ARG VITE_GATEWAY_URL=http://localhost:8000
ARG VITE_MOCK=false
ARG VITE_TRAFFIC_GENERATOR=off
ARG VITE_PARROT_CHAT_COOLDOWN_MS=30000
ARG VITE_ADMIN_PASSCODE=
ARG VITE_SIMULATION_START_TIME=2026-06-20T00:00:00Z
ARG VITE_GAME_SPEED=300
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL \
    VITE_MOCK=$VITE_MOCK \
    VITE_TRAFFIC_GENERATOR=$VITE_TRAFFIC_GENERATOR \
    VITE_PARROT_CHAT_COOLDOWN_MS=$VITE_PARROT_CHAT_COOLDOWN_MS \
    VITE_ADMIN_PASSCODE=$VITE_ADMIN_PASSCODE \
    VITE_SIMULATION_START_TIME=$VITE_SIMULATION_START_TIME \
    VITE_GAME_SPEED=$VITE_GAME_SPEED
RUN pnpm build

FROM public.ecr.aws/docker/library/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
