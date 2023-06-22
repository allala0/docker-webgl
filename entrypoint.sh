#!/bin/sh

# If provided, execute user command, if not, run server by default
if [ $# -eq 0 ];
then
    npm run test
else
    exec "$@"
fi;
