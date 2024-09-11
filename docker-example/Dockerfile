FROM node:18-alpine AS base
ENV HOME=/root
RUN apk update && apk add bash
RUN npm install -g avro-doc-gen@1.0.4

FROM base AS documentation
WORKDIR /app
COPY ./manufacturing_events ./manufacturing_events
COPY ./documentation/generate_docs.sh ./generate_docs.sh
RUN mkdir -p documentation
CMD ["sh", "./generate_docs.sh"]