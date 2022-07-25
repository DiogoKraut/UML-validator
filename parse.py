from ast import Param
import json
class Class:
    def __init__(self, name, id, attributes, operations) -> None:
        self.name = name
        self.id = id
        self.atributes = attributes
        self.operations = operations
    def __str__(self):
        return vars(self)
        pass

class Operation:
    def __init__(self, name, id, visibility, parameters) -> None:
        self.name = name
        self.id = id
        self.visibility = visibility
        self.parameters = parameters
    def __str__(self):
        return self.name + ' ' + self.id + ' ' + self.visibility + ' '

class Parameter:
    def __init__(self, direction, type, id) -> None:
        self.direction = direction
        self.type = type
        self.id = id
        pass

class Attribute:
    def __init__(self, name, type, visibillity, id, xmitype) -> None:
        self.name = name
        self.type = type
        self.visibility = visibillity
        self.id = id
        self.xmitype = xmitype

def parseParameters(ownedParameters):
    parameters = []
    if isinstance(ownedParameters, list):
        for param in ownedParameters:
            print(param["id"])
            parameters.append(Parameter(param["direction"], param["type"], param["id"]))
    else:
        print(ownedParameters["id"])
        parameters.append(Parameter(ownedParameters["direction"], ownedParameters["type"], ownedParameters["id"]))
    return parameters

def parseOperations(ownedOperations):
    operations = []
    for operation in ownedOperations:
        print(operation["name"])
        parameters = []
        if "ownedParameter" in operation:
            parameters = parseParameters(operation["ownedParameter"])
        operations.append(Operation(operation["name"], operation["id"], operation["visibility"], operation["ownedParameter"]))
    return operations
        
def parseAttributes(ownedAttributes):
    attributes = []
    for att in ownedAttributes:
        print(att["name"])
        attributes.append(Attribute(att["name"], att["type"], att["visibility"], att["id"], att["xmitype"]))
    return attributes

def parseClass(element):
    name = element["name"]
    print(name)
    id = element["id"]
    operations = []
    attributes = []
    if "ownedOperation" in element:
        operations = parseOperations(element["ownedOperation"])
    if "ownedAttribute" in element:
        attributes = parseAttributes(element["ownedAttribute"])
    pass

def parseJson():
    print('test')
    with open("out.json", "r") as read_file:
        model = json.load(read_file)["XMI"]["Model"]
        for element in model["packagedElement"]:
            if element["xmitype"] == "uml:Class":
                parseClass(element)
    print 
parseJson()