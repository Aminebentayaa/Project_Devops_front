# Use an official Nginx image as a parent image
FROM nginx:latest

# Copy the built Angular app files into the Nginx web server directory
COPY dist/ /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx with the "daemon off;" option to run in the foreground
CMD ["nginx", "-g", "daemon off;"]
