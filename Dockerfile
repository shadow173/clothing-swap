FROM node:20-alpine

RUN yarn install
RUN tsc

CMD [ "node", "dist/index.js" ]