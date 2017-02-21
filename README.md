# Polled

Real time polling web application.


### Set up

1. Create a `.env` file, and add:
  - REDISCLOUD_URL=XXX
  - DB_URL=XXX
1. `yarn install`
1. `npm run webpack` / `npm start`
1. Go to `http://localhost:5000`

### Docker
# build polled.io container
sudo docker build -t my-own-container/polled DOCKER/.

# start redis container
sudo docker run --name some-redis -d redis redis-server --appendonly yes

# start mongodb container
sudo docker run -d -p 27017:27017 -p 28017:28017 -e AUTH=no --name mongodb tutum/mongodb

# starte polled container
sudo docker run  -it -d --name polldaddy --link mongodb:mongodb --link some-redis:redis unclesamwk/polldaddy

# open url
http://ip-from-container:5000
