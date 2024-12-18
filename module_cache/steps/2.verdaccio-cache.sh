npm config delete registry
npx verdaccio --config ./module_cache/config.yaml &
VERDACCIO_PID=$!
echo $VERDACCIO_PID
sleep 10
npm set registry http://localhost:4873/
npm i --no-audit --cache ./module_cache/cache --force --loglevel=silly
kill $VERDACCIO_PID