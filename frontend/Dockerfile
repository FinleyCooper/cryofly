# node base image
FROM node:16-alpine as build-step

# set work directory
WORKDIR /frontend

# set environment variables
ENV PATH ./node_modules/.bin$PATH

# copy project
COPY . ./

# install and build create-react-app
RUN yarn install
RUN yarn build

# start and configure nginx 
FROM nginx:stable-alpine
COPY --from=build-step /frontend/build /usr/share/nginx/html
COPY /deployment/nginx.default.conf /etc/nginx/conf.d/default.conf