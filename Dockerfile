FROM node:22.11.0-alpine

WORKDIR /app

COPY . .
COPY .env .env

RUN yarn install
RUN yarn build

EXPOSE 5000

RUN ["chmod","+x","./entrypoint.sh"]

ENTRYPOINT [ "sh","./entrypoint.sh" ]