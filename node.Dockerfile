FROM node:9.5.0

RUN mkdir -p /code
COPY ./src/package.json /code
WORKDIR /code

RUN npm install

COPY ./src /code
EXPOSE 5000

USER node

CMD [ "npm", "start" ]
