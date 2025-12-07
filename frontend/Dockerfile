# Use Node official image
FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port for React dev server
EXPOSE 5173

# Start React
CMD ["npm", "start", "--", "--host"]
