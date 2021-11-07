FROM nginx:alpine

COPY . .

RUN rm -rf /usr/share/nginx/html/*

COPY /dist/app /usr/share/nginx/html
COPY /dist/swagger /usr/share/nginx/swagger
COPY /.nginx/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]