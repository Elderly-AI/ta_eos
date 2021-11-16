FROM node:14.18.1-alpine as frontend_builder

WORKDIR /code

COPY dev/yarn.lock .
COPY dev/package.json .
RUN yarn install

COPY dev/public public
COPY dev/src src
COPY dev/tsconfig.json .
RUN yarn build


FROM nginx:alpine

COPY .nginx .nginx

RUN rm -rf /usr/share/nginx/html/*

COPY --from=frontend_builder /dist/app /usr/share/nginx/html/
COPY /.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
