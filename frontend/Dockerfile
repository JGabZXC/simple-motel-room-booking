FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Argument to determine which environment file to use (default: production)
ARG BUILD_ENV=production
# If building for development, overwrite .env with .env.development
RUN if [ "$BUILD_ENV" = "development" ]; then cp .env.development .env; fi

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
