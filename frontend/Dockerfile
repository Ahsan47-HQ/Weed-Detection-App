# Building the React app
# base image
FROM node:20-alpine as builder

# working directory
WORKDIR /app

# copy requirements
COPY package*.json ./

# Run
RUN npm install

# copy all files
COPY . .

# run
RUN npm run build


# Serving the production build
# base image
FROM nginx:alpine

# copy
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# exposing ports
EXPOSE 80

# command
CMD ["nginx","-g","daemon off;"] 
# daemon-off: we dont want the nginx server to run as a background service immediately, else docker might think the container is done