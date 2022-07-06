import json
import xmltodict


xml_file = open("test.xmi")
     
data_dict = xmltodict.parse(xml_file.read())
xml_file.close()
 
# generate the object using json.dumps()
# corresponding to json data
 
json_data = json.dumps(data_dict, indent=2)

    
newJson = open("testeout.json", "w+")

for line in json_data:
    line = line.replace("@", "")
    newJson.write(line)