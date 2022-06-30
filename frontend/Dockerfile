# pull official base image
FROM node as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
# ENV PYTHONUNBUFFERED=1
# ENV NODE_OPTIONS="--max-old-space-size=6144"

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# RUN apk update && apk upgrade && apk add --update alpine-sdk && \
#     apk add --no-cache bash git openssh make cmake g++
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install 

# add app & build
FROM node as app_bulider
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY . ./
RUN npm run build

EXPOSE 3000
# start app
CMD ["serve", "-s", "-n", "build"]
