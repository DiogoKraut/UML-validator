while getopts i:o: flag
do
  case "${flag}" in
    i) input=${OPTARG}
      ;;
    o) output=${OPTARG}
      ;;
  esac
done

if [ -z ${input} ] || [ -z ${output} ]
then
  echo "Usage: parse.sh -i <input XMI> -o <output JSON>\n"
else
  python3 xmiToJson.py ${input};
  python3 cleaner.py ${output};
fi