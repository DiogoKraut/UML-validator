import shutil
import os

def cleaner():
    replace_list = ["\"xmi:", "\"xmlns:", "\"uml:"]
    shutil.copy2('./data.json', './temp.txt')
    newJson = open("out.json", "w")
    with open("temp.txt", "r") as filej:
        for line in filej:
            count=0
            spc=0
            for char in line:
                if(char != " "):
                    count+=1
                spc+=1
                if(count == 2):
                    if (char == '@'):
                        line = line.replace("@", "", 1)
                    for text in replace_list:
                        if(line.startswith(text, spc-2)):
                            line = line.replace(text, text[:-1])
            newJson.write(line)
        filej.close()
    os.remove(filej.name)

cleaner()