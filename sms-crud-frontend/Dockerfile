# Create image based on the official Node 10 image from dockerhub
FROM node:10

COPY package.json package-lock.json ./

RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN npm run ng build -- --prod --output-path=dist

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]