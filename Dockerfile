FROM node:14 AS builder
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package*.json ./

COPY tsconfig*.json ./

COPY ./src ./src

# Install all Packages
RUN npm install
# Copy all other source code to work directory
ADD . /usr/src/app
# TypeScript
RUN npm ci --quiet && npm run build
# Start
CMD [ "npm", "start" ]
EXPOSE 7001