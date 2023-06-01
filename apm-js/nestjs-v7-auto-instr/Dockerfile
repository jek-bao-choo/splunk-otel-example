FROM node:12-alpine

EXPOSE 4003 5003 6003

RUN mkdir /app
WORKDIR /app
ADD package.json /app
ADD package-lock.json /app
ADD . /app
RUN npm install
RUN npm run build

CMD ["npm", "run", "start:prodotel"]
