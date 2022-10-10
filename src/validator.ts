import chalk from "chalk";
import { MetaAssociationAttribute } from "./entities/meta-association-attribute.entity";
import { MetaAssociationLink } from "./entities/meta-association-link.entity";
import { MetaClass } from "./entities/meta-class.entity";
import { isPrimitiveType } from "./utils/utils";

export function validateClasses(classes: MetaClass[], javaClasses: MetaClass[], associations: MetaAssociationLink[]) {
  classes.forEach((metaClass) => {
    console.log('Analysing class', `${chalk.underline.italic.bold(metaClass.name)}...`,);
    const javaClass = javaClasses.find((javaClass) => javaClass.name == metaClass.name);
    if(javaClass) {
      console.log('\tCorresponding Java class', chalk.bgGreen.bold('FOUND'));
      console.log('\tComparing attributes...');
      validateAttributes(metaClass, javaClass);
      console.log('\tComparing operations...');
      validateOperations(metaClass, javaClass);
    } else {
      console.log('\tCorresponding Java class', chalk.bgRed.bold('NOT FOUND'));
    }
  });
  
  associations.forEach((associationLink) => {
    console.log('Analysing associationLink', chalk.underline.italic.bold(`${associationLink.classStart}`), '->', chalk.underline.italic.bold(`${associationLink.classEnd}`));
  });
  
  validateAssociations(classes, javaClasses);
}

function validateAssociations(classes: MetaClass[], javaClasses: MetaClass[]) {
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
          const javaAttribute = javaClass.ownedAttribute.find((javaAttribute) => {
            if(javaAttribute.type === attributeType) {
              console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgGreen.bold('FOUND'), 'as', chalk.underline.italic.bold(`${javaAttribute.name}: ${javaAttribute.type}`));
              return javaAttribute;
            }
          });
          if(!javaAttribute) {
            console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgRed.bold('NOT FOUND'));
          }
        } else {
          console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgRed.bold('NOT FOUND'));
        }
      }
    });
  });
}

function validateAttributes(metaClass: MetaClass, javaClass: MetaClass) {
  if(!metaClass.ownedAttribute) return;
  const metaAttributes = Array.isArray(metaClass.ownedAttribute) ? metaClass.ownedAttribute : [metaClass.ownedAttribute];
  const javaAttributes = javaClass.ownedAttribute;

  metaAttributes.forEach((metaAttribute) => {
    if(metaAttribute.name === '' || !isPrimitiveType(metaAttribute.type)) return;

    const javaAttribute = javaAttributes.find((javaAttribute) => javaAttribute.name == metaAttribute.name);
    if(javaAttribute) {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgGreen.bold('FOUND'));
      if((metaAttribute.type != javaAttribute.type) && (metaAttribute.type != 'Integer' && javaAttribute.type != 'int') && (metaAttribute.type != '_HM7-dUgpEe2638QIGuHyGQ' && javaAttribute.type != 'Date')) {
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(metaAttribute.type), 'but found', chalk.red.bold(javaAttribute.type));
      }
    } else {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}

function validateOperations(metaClass: MetaClass, javaClass: MetaClass) {
  if(!metaClass.ownedOperation) return;
  const metaOperations = Array.isArray(metaClass.ownedOperation) ? metaClass.ownedOperation : [metaClass.ownedOperation];
  const javaOperations = javaClass.ownedOperation;
  metaOperations.forEach((metaOperation) => {
    const javaOperation = javaOperations.find((javaOperation) => javaOperation.name == metaOperation.name);
    if(javaOperation) {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgGreen.bold('FOUND'));
      /* metaOperation.ownedParameter.length includes return attribute */
      if((metaOperation.ownedParameter.length) && metaOperation.ownedParameter.length - 1 != javaOperation.ownedParameter.length) {
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(metaOperation.ownedParameter.length-1), 'parameters, but found', chalk.red.bold(javaOperation.ownedParameter.length));
      }
    } else {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}