FROM node:14.17.6-alpine3.13

WORKDIR /Backend
COPY . .
RUN yarn install --production

CMD ["node", "/Backend/server.js"]