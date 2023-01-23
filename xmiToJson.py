import json
import re
from sys import argv
import xmltodict
print(argv)
input = argv[1]
with open(input) as xml_file:
    #Gera um arquivo com as informações a serem substituídas.
    file = open("replaceDict.txt", "w")
    flag = False
    run = True
    #Percorre o arquivo xmi procurando por atributos e classes a serem substituídos.
    #Classes
    for line in xml_file:
        if(line.startswith("    <packagedElement")):    
            classType = re.search('(?<=xmi:type=")([A-z_:0-9-])+', line)
            if(classType and classType.group() == "uml:Class"):
                className = re.search('(?<=name=")([A-z_:0-9-])+', line)
                classId = re.search('(?<=xmi:id=")([A-z_:0-9-])+', line)
                if(className and classId and className.group() != ""):
                    file.write(className.group() + "," + classId.group() + "\n")
        if (run):
            #Atributos
            if(re.search('(?<=<)packagedElement', line)):
                attClass = re.search('(?<=xmi:type=")([A-z_:0-9-])+', line)
                if(attClass and attClass.group() == "uml:Class"):
                    attType = re.search('(?<=name=")([A-z])+', line)
                    attId = re.search('(?<=xmi:id=")([A-z_0-9-])+', line)
                    flag = True
                    if(attType and attId and flag and attClass):
                        line = line.replace(attId.group(), attType.group())
                        file.write(attType.group()+","+attId.group()+"\n")
                else:
                    if(flag):
                        run = False
    file.close()                
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