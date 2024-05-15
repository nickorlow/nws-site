.PHONY: run

run: 
	RUST_LOG=debug cargo run

docker-build:
	docker build . -t smc-website:dev

docker-run: docker-build 
	docker run -p 8085:80 smc-website:dev
