install:
		npm ci
link:
		npm link
lint:
		npx eslint .
webpack:
		npx webpack serve
build:
		NODE_ENV=production npx webpack
