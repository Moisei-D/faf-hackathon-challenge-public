# Build with the gradle image, not ./gradlew (wrapper jar isn't in the repo).
FROM public.ecr.aws/docker/library/gradle:8.7-jdk21 AS build
WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN gradle buildFatJar --no-daemon

FROM public.ecr.aws/docker/library/eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /home/gradle/src/build/libs/beach-all.jar app.jar
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/app/docker-entrypoint.sh"]
