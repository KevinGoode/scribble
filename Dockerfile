# Base image for raspbian_docker_base
# docker build  -t scribble:latest .
# docker run -p 80:80 -d scribble:latest
# docker run -p 80:80 -v /home/user/Dev/scribble/content:/etc/nginx/html -d scribble:latest
# docker container exec -it <container-id> /bin/sh
#FROM yobasystems/alpine-nginx
FROM jfloff/alpine-python:3.7
RUN apk add nginx
RUN apk add nano
RUN apk add --no-cache python3-dev libffi-dev gcc musl-dev make

RUN pip3 install greenlet
RUN pip3 install gevent
RUN pip install gevent-websocket
RUN pip3 install flask-socketio
RUN mkdir /scribble
RUN mkdir /scribble/games
RUN chmod a+rwx /scribble/games
ADD server /scribble
RUN chmod a+x /scribble/start.sh
#ADD content /etc/nginx/html
ADD config/nginx.conf /etc/nginx/nginx.conf
RUN  mkdir -p /etc/nginx/conf.d
RUN chmod a+r  /etc/nginx/conf.d
ADD config/websocket.conf /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /run/nginx
RUN nginx -t
CMD  /scribble/start.sh


