# while getopts i:o: flag
# do
#   case "${flag}" in
#     i) input=${OPTARG}
#       ;;
#     o) output=${OPTARG}
#       ;;
#   esac
# done

# if [ -z ${input} ] || [ -z ${output} ]
# then
#   echo "Usage: parse.sh -i <input XMI> -o <output JSON>\n"
# else
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
    node ../../dist/main.js "${d}diagram.json"
  else
    echo "No XMI file found"
  fi
  );

done