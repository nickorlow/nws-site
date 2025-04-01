FROM rust:1.82 as build

ENV PKG_CONFIG_ALLOW_CROSS=1

WORKDIR .
COPY . .

RUN cargo install --path .

ENV RUST_LOG=info
ENV EXPOSE_PORT=80

EXPOSE 80
ENTRYPOINT ["website"]
