# FROM node:22.11.0-alpine

# WORKDIR /app

# COPY . .
# COPY .env .env

# RUN yarn install
# RUN yarn build

# EXPOSE 5000

# RUN ["chmod","+x","./entrypoint.sh"]

# ENTRYPOINT [ "sh","./entrypoint.sh" ]



FROM node:22.11.0-alpine AS builder
WORKDIR /app
COPY . .
COPY .env .env
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn build

FROM node:22.11.0-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["sh", "./entrypoint.sh"]
