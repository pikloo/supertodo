FROM node:latest AS dev


RUN mkdir -p /srv/todo/app/dist && chown -R node:node /srv/todo

# USER node

WORKDIR /srv/todo/app
COPY package.json package-lock.json ./
RUN npm install --quiet
# COPY ./ .

# RUN npm run build
CMD ["npm", "run", "start"]

FROM dev AS build

COPY ./ .

RUN npm run build