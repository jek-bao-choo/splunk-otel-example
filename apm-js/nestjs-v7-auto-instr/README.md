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
- `node --version` if it is not node v12.12 then use nvm to lower to 
  - `nvm use 12.12`
  - `node --version`
- With Node v12.12 rerun 
- - `npm run build`
  - `npm run start:prod`
  - Go to localhost:3000 to verify there is Hello World
- `export OTEL_SERVICE_NAME=jek-nestjs-v7-auto-instr`
- `export SPLUNK_ACCESS_TOKEN=redacted`
- `export SPLUNK_REALM=redacted`
- `export OTEL_RESOURCE_ATTRIBUTES='deployment.environment=jekdev'`
- `printenv` to view variables are added
- `node --version`
- `npm run build`
- `node -r @splunk/otel/instrument dist/main`
- Invoke request http://localhost:3000

# Proof
![](proof1.png)
![](proof2.png)
![](proof3.png)
