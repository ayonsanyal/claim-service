
    FROM node:20 AS builder
    
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY tsconfig*.json ./
    COPY nest-cli.json ./
    COPY prisma ./prisma
    COPY src ./src
    
    ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
    
    RUN npx prisma generate
    RUN npm run build
    
    
  
    FROM node:20
    
    WORKDIR /app
    
    RUN apt-get update && apt-get install -y openssl
    
    COPY --from=builder /app/package*.json ./
    RUN npm install --omit=dev
    
    
    COPY --from=builder /app/dist ./dist
    
   
    COPY --from=builder /app/src/config ./dist/config
    
  
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    
    EXPOSE 3000
    
    CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]