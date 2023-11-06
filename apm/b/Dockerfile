# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first, for efficient Docker caching
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source code inside the Docker image
COPY . .

# Make port 3002 available to the outside world
EXPOSE 3002

# Define the command that will run your app
CMD ["npm", "start"]
