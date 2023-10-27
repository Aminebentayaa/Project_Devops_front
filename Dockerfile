# Use an official Nginx image as a parent image
FROM nginx:latest

# Copy the built Angular app into the container
COPY dist /usr/share/nginx/html

# Expose port 80 for the Nginx web server
EXPOSE 80
