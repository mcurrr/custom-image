# create your custom node image here, based of official node:argon
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies and bundle app source
COPY ./src /usr/src/app/
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
