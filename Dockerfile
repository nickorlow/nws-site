FROM rust:alpine AS builder

WORKDIR /app/src
RUN USER=root

RUN apk add pkgconfig openssl-dev libc-dev openssl-libs-static
COPY ./ ./
RUN cargo build --release

FROM alpine:latest
WORKDIR /app
RUN apk update \
    && apk add openssl ca-certificates

EXPOSE 80

COPY --from=builder /app/src/target/release/website /app/website
COPY assets /app/assets

ENV RUST_LOG=info
ENV EXPOSE_PORT=80

ENTRYPOINT ["/app/website"]
