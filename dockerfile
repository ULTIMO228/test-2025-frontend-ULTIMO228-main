FROM node:20-bookworm

RUN npx -y playwright@1.49.1 install --with-deps

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]