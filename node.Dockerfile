FROM node:8.2.1

RUN mkdir -p /code
COPY ./src/package.json /code
WORKDIR /code

RUN npm install

COPY ./src /code
EXPOSE 3000

CMD [ "npm", "start" ]
