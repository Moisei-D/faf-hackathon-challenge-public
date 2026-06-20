#!/bin/sh
# Ktor 2.3.12's YAML loader chokes on ${VAR} placeholders, so render a config
# with the values already substituted and point Ktor at it.
set -e

cat > /app/application.runtime.yaml <<EOF
ktor:
  deployment:
    port: ${APP_PORT:-8080}
  application:
    modules:
      - com.hackathon.summer.faf.ApplicationKt.module
database:
  jdbcUrl: "${JDBC_URL}"
  driverClassName: "org.postgresql.Driver"
  username: "${DB_USER}"
  password: "${DB_PASSWORD}"
  maximumPoolSize: 10
EOF

exec java -jar app.jar -config=/app/application.runtime.yaml
