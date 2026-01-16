FROM alpine:latest

ARG PB_VERSION=0.36.0
ARG TARGETOS
ARG TARGETARCH

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${TARGETOS}_${TARGETARCH}.zip \
    -O /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && rm /tmp/pb.zip

COPY ./pb_migrations /pb/pb_migrations

RUN chmod +x /pb/pocketbase

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]