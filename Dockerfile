FROM node:16.19-alpine as build-stage

WORKDIR /app

EXPOSE 3000

COPY package.json /app/package.json

RUN npm install

COPY . /app

#RUN yarn run lint

RUN npx eslint --fix /app/src/pages/Test.vue

RUN yarn quasar build

FROM nginx:alpine
#RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /app/dist/spa
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


#CMD ["npm","run", "dev"]
