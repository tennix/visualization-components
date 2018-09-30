default: build

setup:
	npm install -g yarn
	yarn
	go get -u github.com/rakyll/statik

frontend:
	npm run build
	statik -f -src=build

build: frontend
	go build -o bin/tidb-admin

.PHONY: setup frontend
