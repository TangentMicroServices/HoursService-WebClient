FROM node:5.9
RUN mkdir /code
WORKDIR /code
ADD . /code/
RUN npm install -g grunt-cli http-server bower
RUN npm install
RUN bower install --allow-root

