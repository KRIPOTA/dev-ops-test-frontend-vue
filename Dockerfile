FROM node:16.19-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json /app/package.json

RUN npm install

COPY . /app

CMD ["npm","run", "dev"]
