# Single stage keeps the Prisma CLI around for `prisma migrate deploy` at runtime.
FROM public.ecr.aws/docker/library/node:20-slim
WORKDIR /app

# openssl for Prisma; pnpm pinned to match the lockfile.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@10.18.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm exec prisma generate && pnpm build && chmod +x entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
