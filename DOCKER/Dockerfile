FROM ubuntu
MAINTAINER Sam

RUN apt-get update
RUN apt install -y curl git apt-transport-https sudo nano
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN cd /root && git clone https://github.com/tomspeak/polled.io.git
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash
RUN sudo apt-get update && sudo apt-get install yarn -y
RUN cd /root/polled.io && yarn install
ADD .env /root/polled.io/.env
CMD cd /root/polled.io && npm start

