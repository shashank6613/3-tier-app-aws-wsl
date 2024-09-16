# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy the local code to the container
COPY index.html /usr/share/nginx/html/index.html

# copy backend sending javascript
COPY script.js /usr/share/nginx/html/script.js

# copy css for html graphics
COPY style.css /usr/share/nginx/html/style.css

# Expose port 80 to the outside world
EXPOSE 80
