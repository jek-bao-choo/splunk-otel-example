# Purpose
Validate Nest.js v7 with Node.js v12.12 using splunk-otel-js v1.4.1

# Steps
- `nest new nestjs-v7-auto-instr`.
- Change package.json to use nestjs v7
- `rm -rf node_modules`
- `npm install`
- `npm run build`
- `npm run start:prod`
- Go to localhost:3000 to verify there is Hello World
- 