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

COPY ./src ./src
COPY ./dist ./dist

RUN npm run build


FROM nginx:latest

COPY --from=build /dist /var/www/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]