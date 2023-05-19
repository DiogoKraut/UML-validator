cd tests
for d in */ ; do
  echo $d;
  (cd $d;
  f="$(find . -name "*.xmi" -type f)";
  if [ ! -z "${f}" ]
  then
    cd ../..
    node ./dist/main.js "tests/${d}diagram.json"
  else
    echo "No XMI file found"
  fi
  );

done