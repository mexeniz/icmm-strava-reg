FROM node:10.16.0-jessie-slim

# Install nodemon for hot reload
RUN npm install -g nodemon

COPY package.json package-lock.json /icmm-strava-reg/
RUN npm install

COPY . /icmm-strava-reg
WORKDIR /icmm-strava-reg

CMD ["npm", "start"]