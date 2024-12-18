npm set registry http://localhost:4873/

node ./module_cache/server.js &
FAKEDACCIO_PID=$!
sleep 5

npm i --no-audit --cache ./module_cache/cache --force --loglevel=silly
kill $FAKEDACCIO_PID