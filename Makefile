install:
		npm ci
lint:
		npx eslint .
webpack:
		npx webpack serve
build:
		NODE_ENV=production npx webpack
test: 
		npx playwright test