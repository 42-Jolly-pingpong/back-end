FROM node:lts-alpine3.18

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT

RUN npm i npm@latest -g

RUN npm i -g @nestjs/cli

USER node

WORKDIR /app

COPY --chown=node:node package.json package-lock.json* ./

RUN npm ci --include=dev && npm cache clean --force

COPY --chown=node:node . .

EXPOSE $PORT

CMD [ "npm", "run", "start:dev" ]
