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
  echo "${$d/*.xmi}"
  python3 ../xmiToJson.py $d/*.xmi;
  python3 ../cleaner.py $d/diagram.json;
done
# fi