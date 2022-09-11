import json
import re
from sys import argv
import xmltodict

input = argv[1]
with open(input) as xml_file:
    for line in xml_file:
        if(re.search('(?<=<)packagedElement'))
        attType = re.search('(?<=name=")([A-z])+', line)
        attId = re.search('(?<=xmi:id=")([A-z_0-9-])+', line)
        attClass = re.search('(?<=xmi:type=")([A-z_:0-9-])+', line)
        if(attType and attId):
            if(attClass and attClass.group() == "uml:Class"):
                print(attType.group() + ", " + attId.group() + ", " + attClass.group())
    xml_file.close()
with open(input) as xml_file:
    data_dict = xmltodict.parse(xml_file.read())
    xml_file.close()
     
    # generate the object using json.dumps()
    # corresponding to json data
     
    json_data = json.dumps(data_dict, indent=2)
     
    # Write the json data to output
    # json file
    with open("out.json", "w") as json_file:
        json_file.write(json_data, )
        json_file.close()