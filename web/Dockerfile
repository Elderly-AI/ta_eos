FROM node:14.18.1-alpine as frontend_builder

WORKDIR /code

COPY dist/swagger /dist/swagger
COPY dev/package.json dev/yarn.lock ./
RUN yarn install
COPY dev .
RUN yarn build && rm -rf node_modules


FROM nginx:alpine

COPY .nginx .nginx

RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend_builder /dist /usr/share/nginx/html/
COPY /.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
