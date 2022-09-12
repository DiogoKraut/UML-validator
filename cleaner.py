import shutil
import os
from sys import argv

output = "teste.json"
def cleaner():
    replace_dict = {"xmi:type":"xmitype"}
    replace_id = {}
    remove_list = ["xmlns:", "uml:", "xmi:"]
    shutil.copy2('./out.json', './temp.txt')
    newJson = open(output, "w")
    file = open("replaceDict.txt", "r")
    for line in file:
        x = line.split(',')
        replace_id[x[0]] = x[1][:-1]
    with open("temp.txt", "r") as filej:
        for line in filej:
            count=0
            spc=0
            #Pula as linhas em branco em busca do início dos nomes dos atributos.
            for char in line:
                if(char != " "):
                    count+=1
                spc+=1
                if(count == 2):
                    #Troca os caracteres iniciais que deseja ser removido.
                    if (char == '@'):
                        line = line.replace("@", "", 1)
                    for key in replace_dict:
                        if(line.startswith(key, spc-1)):
                            line = line.replace(key, replace_dict[key])
                    if(line.startswith("type", spc-1) or line.startswith("id", spc-1)):
                        for key in replace_id:
                            line = line.replace(replace_id[key], key + "\",\n\"oldId\": \"" + replace_id[key], 1)
                    for text in remove_list:
                        if(line.startswith(text, spc-1)):
                            line = line.replace(text, "", 1)
            newJson.write(line)
        filej.close()
        file.close()
    os.remove(filej.name)
    os.remove(file.name)

cleaner()