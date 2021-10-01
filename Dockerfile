FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY app/package.json /usr/src/app
RUN npm install
COPY app/. /usr/src/app

EXPOSE 7500

CMD ["npm", "run", "dev"]