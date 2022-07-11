import json
class Class:
    def __init__(self, name, id, attributes, operations) -> None:
        self.name = name
        self.id = id
        self.atributes = attributes
        self.operations = operations

class Operation:
    def __init__(self, name, id, visibility, parameters) -> None:
        self.name = name
        self.id = id
        self.visibility = visibility
        self.parameters = parameters
    def __str__(self):
        return self.name + ' ' + self.id + ' ' + self.visibility + ' '

def parseOperations(ownedOperations):
    operations = []
    for operation in ownedOperations:
        operations.append(Operation(operation["@name"], operation["@xmi:id"], operation["@visibility"], operation["ownedParameter"]))
    return operations
        

def parseClass(element):
    name = element["@name"]
    id = element["@xmi:id"]
    operations = []
    if "ownedOperation" in element:
        operations = parseOperations(element["ownedOperation"])
    print(name, ' '+id)
    for op in operations:
        print(op)
    pass

def parseJson():
    with open("data.json", "r") as read_file:
        model = json.load(read_file)["xmi:XMI"]["uml:Model"]
        for element in model["packagedElement"]:
            if element["@xmi:type"] == "uml:Class":
                parseClass(element)

parseJson()