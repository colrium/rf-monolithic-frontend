################################
# DEVELOPMENT
################################
#
#
FROM node:alpine
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
COPY package.json .
COPY yarn.lock .
# RUN npm install -g yarn npm-run-all
RUN npm install -g npm-run-all --loglevel verbose
RUN yarn install --verbose
# Copy app files
# COPY . .
# Expose port
EXPOSE 5000
# Change USER
# USER node
# Start the app
CMD [ "yarn", "start" ]
