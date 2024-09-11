# Avro schemas documentation

## What is it?

Package for generation of documentation in html format for avro schemas.

**Disclaimer!** This is a raw version, issues are possible.

## Usage

To generate from a file or folder with schemas run:

```bash

avro-doc-gen --input {path_to_folder_or_file} --output {documentation.html}

```

## Docker example

If you want to run generation inside of the docker container you can use:

```Dockerfile

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

```

Generation script:

```bash

#!/bin/bash

SOURCE_DIR="./events"
DEST_FILE="./events-docs.html"

avro-doc-gen --input ${SOURCE_DIR} --output ${DEST_FILE} --group-by name

```
