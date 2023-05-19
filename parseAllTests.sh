cd tests
for d in */ ; do
  echo $d;
  (cd $d;
  f="$(find . -name "*.xmi" -type f)";
  if [ ! -z "${f}" ]
  then
    echo "$f";
    python3 /home/diogokraut/UML-validator/xmiToJson.py "$f";
    python3 /home/diogokraut/UML-validator/cleaner.py ./diagram.json;
    rm out.json;
  else
    echo "No XMI file found"
  fi
  );

done