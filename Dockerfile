FROM node:20-alpine

COPY /src /src
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json

RUN yarn install
RUN yarn build

CMD [ "node", "dist/index.js" ]