import chalk from "chalk";
import { MetaAssociationAttribute } from "entities/meta-association-attribute.entity";
import { MetaAttribute } from "entities/meta-attribute.entity";
import { MetaClass } from "entities/meta-class.entity";

export function isPrimitiveType(type?: string) {
  return type === 'int' || type === 'double' || type === 'float' || type === 'char' || type === 'boolean' || type === 'String' || type === 'long' || type === 'short' || type === 'byte' || type === 'Date' || type === 'Integer';
}

export function translateAssociations(classes: MetaClass[], javaClasses: MetaClass[]) {
  classes.forEach((metaClass) => {
    metaClass.ownedAttribute.forEach((attribute: MetaAssociationAttribute ) => {
      if(attribute.hasOwnProperty('association')) {
        let attributeType = '';
        if(attribute.upperValue && attribute.upperValue.value === '*') {
          attributeType = attribute.type + '[]';
        } else {
          attributeType = attribute.type!;
        }
        const javaClass = javaClasses.find((javaClass) => javaClass.name === metaClass.name);
        if(javaClass) {
          javaClass.ownedAttribute.forEach((javaAttribute) => {
            if(javaAttribute.type === attributeType) {
              console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgGreen.bold('FOUND'), 'as', chalk.underline.italic.bold(`${javaAttribute.name}: ${javaAttribute.type}`));
            }
          });
        } else {
          console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgRed.bold('NOT FOUND'));
        }
      }
    });
  });
}