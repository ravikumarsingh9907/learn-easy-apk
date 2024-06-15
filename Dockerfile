FROM node:19-alpine

WORKDIR /learn-easy

ENV DB_URL='mongodb+srv://ravikumarsingh9907:learneasy123@cluster0.5fhoj.mongodb.net/learn-easy?retryWrites=true&w=majority&appName=Cluster0'
ENV CLOUD_NAME=dupvoqioo
ENV CLOUD_API_KEY=124299373281251
ENV CLOUD_API_SECRET=VcT4G_RZzXcbEKQOX_v3CP-Kdjk
ENV SECRET_KEY=ravikumarsingh
ENV GMAIL=ravikumarsingh9907@gmail.com
ENV G_PASS='qrjk ewwz dziy psjx'
ENV WEB_TOKEN=ravikumarsingh

COPY ./package.json ./

RUN npm install

COPY ./ ./

EXPOSE 3300

CMD ["node", "index.js"]