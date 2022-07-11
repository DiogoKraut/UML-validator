import json
class Class:
    def __init__(self, name, id, attributes, operations) -> None:
        self.name = name
        self.id = id
        self.atributes = attributes
        self.operations = operations
        
def parseClass(element):
    name = element["@name"]
    id = element["@xmi:id"]
    print(name, id)
    pass

def parseJson():
    with open("data.json", "r") as read_file:
        model = json.load(read_file)["xmi:XMI"]["uml:Model"]
        for element in model["packagedElement"]:
            if element["@xmi:type"] == "uml:Class":
                parseClass(element)

parseJson()