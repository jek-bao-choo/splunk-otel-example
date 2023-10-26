The motivation to create this folder is to have a long chain of microservices in different languages for APM's service map illustration while keeping the code as simple as possible - so that anyone can modify and use it.

# Idea
## Initial Iteration 1
A (Node.js Express) --> B (Node.js Express) --> C (Node.js Express) --> D (Golang net/http)

## Next Iteration 2
A (Node.js Express) --> B (Node.js Nest.js) --> Kafka --> C (Node.js Express) --> D (Golang net/http)

# How to run each app
## A
```
cd a/
npm install
node a.js
```

## B
```
cd b/
npm install
node b.js
```

## C
```
cd c/
npm install
node c.js
```

## D
```
cd d/
go run main.go
```

## Trigger
```
curl http://localhost:3001/a
```