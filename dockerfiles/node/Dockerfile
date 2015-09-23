FROM node:0.10

RUN npm install -g pm2
RUN pm2 dump

EXPOSE 443

CMD pm2 start /code/server.json && pm2 logs