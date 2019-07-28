FROM node:10.16.0-jessie-slim

COPY . /icmm-strava-reg
WORKDIR /icmm-strava-reg
RUN npm install

CMD ["node", "/icmm-strava-reg/app.js"]