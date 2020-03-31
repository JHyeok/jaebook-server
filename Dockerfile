FROM node:12.13.0-alpine

ARG PROJECT_DIR=/usr/src/app

COPY . $PROJECT_DIR
WORKDIR $PROJECT_DIR

RUN apk add --no-cache --update bash make gcc g++ python && \
  npm install -g yarn && \
  yarn install && \
  npm rebuild bcrypt --build-from-source && \
  yarn build && \
  apk del make gcc g++ python

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /
RUN chmod +x /wait-for-it.sh