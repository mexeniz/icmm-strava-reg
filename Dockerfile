FROM node:10.16.0-jessie-slim

COPY . /icmm-strava-reg
WORKDIR /icmm-strava-reg

# Install nodemon for hot reload
RUN npm install -g nodemon

RUN npm install

CMD ["npm", "start"]