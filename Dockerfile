# Official Playwright image
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

RUN npx playwright install

# Execute Playwright tests
CMD ["npx", "playwright", "test"]