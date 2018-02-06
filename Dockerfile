FROM node:9.5.0
LABEL name "test-docker-deployment"

RUN mkdir -p /code
COPY ./src/package.json /code
WORKDIR /code

RUN npm install

COPY ./src /code
EXPOSE 8080

CMD [ "npm", "start" ]