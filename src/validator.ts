import chalk from "chalk";
import { MetaAssociationAttribute } from "./entities/meta-association-attribute.entity";
import { MetaClass } from "./entities/meta-class.entity";
import { isPrimitiveType } from "./utils/utils";

export function validateClasses(classes: MetaClass[], javaClasses: MetaClass[]) {
  classes.forEach((metaClass) => {
    console.log('Analysing class', `${chalk.underline.italic.bold(metaClass.name)}...`,);
    const javaClass = javaClasses.find((javaClass) => javaClass.name === metaClass.name);
    if(javaClass) {
      console.log('\tMatching class', chalk.bgGreen.bold('FOUND'));
      if(metaClass.visibility != javaClass.visibility) {
        console.log(`\t${chalk.bgRed('Visibility mismatch')}: Expected`, chalk.green.bold(metaClass.visibility), 'but found', chalk.red.bold(javaClass.visibility));
      }
      console.log('\tComparing attributes...');
      validateAttributes(metaClass, javaClass);
      console.log('\tComparing operations...');
      validateOperations(metaClass, javaClass);
    } else {
      console.log('\tMatching class', chalk.bgRed.bold('NOT FOUND'));
    }
  });
  

  
}

export function validateAssociations2(classes: MetaClass[], javaClasses: MetaClass[]) {
  console.log('Analysing associations Code -> Diagram...');
  classes.forEach((metaClass) => {
    if(!metaClass.ownedAttribute) return;
    const metaAttributes = Array.isArray(metaClass.ownedAttribute) ? metaClass.ownedAttribute : [metaClass.ownedAttribute];
    metaAttributes.forEach((attribute: MetaAssociationAttribute ) => {
      if(classes.some((metaClass) => metaClass.name === attribute.type || metaClass.name + '[]' === attribute.type)) {
        const javaClass = javaClasses.find((javaClass) => javaClass.name === metaClass.name);
        if(javaClass) {
          const javaAttributes = Array.isArray(javaClass.ownedAttribute) ? javaClass.ownedAttribute : [javaClass.ownedAttribute];
          const javaAttribute: MetaAssociationAttribute | undefined = javaAttributes.find((javaAttribute: MetaAssociationAttribute) => {
            if(javaAttribute.type === attribute.type || javaAttribute.type + '[]' === attribute.type) {
              if(!javaAttribute.lowerValue?.value) {
                javaAttribute.lowerValue = {value: '1'};
              }
              return javaAttribute;
            }
          });
          if(!javaAttribute) {
            console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type?.split('[]')[0]}`), chalk.bgRed.bold('NOT FOUND'));
            return false;
          }
          if(javaAttribute.lowerValue?.value != attribute.lowerValue!.value) {
            console.log(`\tAssociation ${chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type?.split('[]')[0]}`)} ${chalk.bgRed('Multiplicity mismatch')}: Expected`, chalk.green.bold(attribute.lowerValue!.value), 'but found', chalk.red.bold(javaAttribute.lowerValue?.value));

            return false;
          }
          console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type?.split('[]')[0]}`), chalk.bgGreen.bold('FOUND'), 'as', chalk.underline.italic.bold(`${javaAttribute.name}: ${javaAttribute.type?.endsWith('[]') ? javaAttribute.type : javaAttribute.type + '[]'}`));

        } else {
          console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type?.split('[]')[0]}`), chalk.bgRed.bold('NOT FOUND'));
        }
      }
    });
  });
}

export function validateAssociations(classes: MetaClass[], javaClasses: MetaClass[]) {
  console.log('Analysing associations Diagram -> Code...');
  classes.forEach((metaClass) => {
    if(!metaClass.ownedAttribute) return;
    const metaAttributes = Array.isArray(metaClass.ownedAttribute) ? metaClass.ownedAttribute : [metaClass.ownedAttribute];
    metaAttributes.forEach((attribute: MetaAssociationAttribute ) => {
      if(attribute.hasOwnProperty('association')) {
        const javaClass = javaClasses.find((javaClass) => javaClass.name === metaClass.name);
        if(javaClass) {
          const javaAttributes = Array.isArray(javaClass.ownedAttribute) ? javaClass.ownedAttribute : [javaClass.ownedAttribute];
          const javaAttribute: MetaAssociationAttribute | undefined = javaAttributes.find((javaAttribute: MetaAssociationAttribute) => {
            if(javaAttribute.type === attribute.type || javaAttribute.type === attribute.type + '[]') {
              if(!attribute.lowerValue?.value) {
                attribute.lowerValue = {value: '1'};
              }
              return javaAttribute;
            }
          });
          if(!javaAttribute) {
            const destinationClass = javaClasses.find((javaClass) => javaClass.name === attribute.type);
            if(destinationClass) {
              const destinationAttribute = destinationClass.ownedAttribute.find((destinationAttribute) => destinationAttribute.type === javaClass.name || destinationAttribute.type === javaClass.name + '[]');
              if(destinationAttribute) {
                console.log('\tAggregation*', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgGreen.bold('FOUND'), 'as', chalk.underline.italic.bold(`${destinationAttribute.name}: ${destinationAttribute.type}`));
                return;
              } else if(!attribute.hasOwnProperty('aggregation')) {
                console.log('\tAggregation*', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgRed.bold('NOT FOUND'), ' (missing on parent class)');
                return;
              }
            }
            console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgRed.bold('NOT FOUND'));
            return;
          }
          if(
            (attribute.upperValue?.value === '*') &&
            (!javaAttribute.type?.endsWith('[]') && !javaAttribute.type?.includes('ArrayList'))
          ) {
            console.log(`\tAssociation ${chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`)} ${chalk.bgRed('Multiplicity mismatch')}: Expected`, chalk.green.bold(attribute.upperValue?.value), 'but found', chalk.red.bold(javaAttribute.upperValue?.value));
            return;
          }
          if(javaAttribute.lowerValue?.value != attribute.lowerValue!.value) {
            console.log(`\tAssociation ${chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`)} ${chalk.bgRed('Multiplicity mismatch')}: Expected`, chalk.green.bold(attribute.lowerValue!.value), 'but found', chalk.red.bold(javaAttribute.lowerValue?.value));

            return false;
          }
          console.log('\tAssociation', chalk.underline.italic.bold(`${metaClass.name} --> ${attribute.type}`), chalk.bgGreen.bold('FOUND'), 'as', chalk.underline.italic.bold(`${javaAttribute.name}: ${javaAttribute.type?.endsWith('[]') ? javaAttribute.type : javaAttribute.type + '[]'}`));

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
  const javaAttributes = Array.isArray(javaClass.ownedAttribute) ? javaClass.ownedAttribute : [javaClass.ownedAttribute];
    
  metaAttributes.forEach((metaAttribute) => {
    if(metaAttribute.name === '' || !isPrimitiveType(metaAttribute.type)) return;

    const javaAttribute = javaAttributes.find((javaAttribute) => javaAttribute.name === metaAttribute.name);
    if(javaAttribute) {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgGreen.bold('FOUND'));
      if(
        (metaAttribute.type != javaAttribute.type) &&
        ((metaAttribute.type != 'Integer' && javaAttribute.type != 'int') && javaAttribute.type != '_I46HoxU0Ee6PAM8hniUwVQ') &&
        (metaAttribute.type != '_I45gIRU0Ee6PAM8hniUwVQ' && (javaAttribute.type != 'Date' && javaAttribute.type != '_I45gIRU0Ee6PAM8hniUwVQ'))
      ) {
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(metaAttribute.type), 'but found', chalk.red.bold(javaAttribute.type));
      } else if(
        (javaAttribute.type != metaAttribute.type) &&
        ((metaAttribute.type != 'Integer' && javaAttribute.type != 'int') && javaAttribute.type != '_I46HoxU0Ee6PAM8hniUwVQ') &&
        ((javaAttribute.type != '_I45gIRU0Ee6PAM8hniUwVQ' && javaAttribute.type != 'Date') && metaAttribute.type != 'Date')
      ) {
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(javaAttribute.type), 'but found', chalk.red.bold(metaAttribute.type));
      }
      if(metaAttribute.visibility != javaAttribute.visibility) {
        console.log(`\t\t\t${chalk.bgRed('Visibility mismatch')}: Expected`, chalk.green.bold(metaAttribute.visibility), 'but found', chalk.red.bold(javaAttribute.visibility));
      }
    } else {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}

function validateOperations(metaClass: MetaClass, javaClass: MetaClass) {
  if(!metaClass.ownedOperation) return;
  const metaOperations = Array.isArray(metaClass.ownedOperation) ? metaClass.ownedOperation : [metaClass.ownedOperation];
  const javaOperations = Array.isArray(javaClass.ownedOperation) ? javaClass.ownedOperation : [javaClass.ownedOperation];
  metaOperations.forEach((metaOperation) => {
    const metaParameters = Array.isArray(metaOperation.ownedParameter) ? metaOperation.ownedParameter : [metaOperation.ownedParameter];
    const index = metaParameters.findIndex((parameter) => parameter.direction);
    if(index != -1) {
      metaParameters.splice(index, 1);
    }
    const javaOperation = javaOperations.find((javaOperation) => javaOperation.name === metaOperation.name);
    if(javaOperation) {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgGreen.bold('FOUND'));
      const javaParameters = Array.isArray(javaOperation.ownedParameter) ? javaOperation.ownedParameter : [javaOperation.ownedParameter];
      const index = javaParameters.findIndex((parameter) => parameter.direction);
      if(index != -1) {
        javaParameters.splice(index, 1);
      }
      if((metaParameters.length && javaParameters.length) && metaParameters.length != javaParameters.length) {
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(metaOperation.ownedParameter.length-1), 'parameters, but found', chalk.red.bold(javaOperation.ownedParameter.length));
      }
    } else {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}