#!/bin/bash

SOURCE_DIR="./events"
DEST_FILE="./events-docs.html"

avro-doc-gen --input ${SOURCE_DIR} --output ${DEST_FILE} --group-by name