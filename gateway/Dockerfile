FROM public.ecr.aws/docker/library/golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /gateway .

FROM public.ecr.aws/docker/library/alpine:3.20
RUN apk add --no-cache ca-certificates wget
COPY --from=build /gateway /gateway
EXPOSE 8000
ENTRYPOINT ["/gateway"]
