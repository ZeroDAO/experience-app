FROM nginx:1.14

COPY dist /dist

COPY nginx_vue.conf /etc/nginx/conf.d/

RUN /bin/bash -c 'echo nginx init ok!'
