FROM node:0.10

RUN npm install -g pm2
RUN pm2 dump

EXPOSE 3000

CMD pm2 start /code/server.json && pm2 logs