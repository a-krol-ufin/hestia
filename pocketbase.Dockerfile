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

# You can uncomment the following lines to copy local migrations and hooks 
# into the image if you prefer to manage them in your git repository.
# COPY ./pb_migrations /pb/pb_migrations
# COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8080

# Start PocketBase and specify the data directory for persistence
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/data"]

