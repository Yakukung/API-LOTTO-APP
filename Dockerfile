FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm init -y
RUN npm install express sqlite3

EXPOSE 3000

CMD ["node", "server.js"]
