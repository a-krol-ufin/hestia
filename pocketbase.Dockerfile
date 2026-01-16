FROM alpine:latest

# You can change the PocketBase version here
ARG PB_VERSION=0.22.12

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget # wget is required for the healthcheck

# Download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy migrations
COPY ./pb_migrations /pb/pb_migrations

EXPOSE 8080

# Start PocketBase and specify the data directory for persistence
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/data"]

