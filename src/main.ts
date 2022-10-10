import * as fs from 'fs';
import { MetaClass } from './entities/meta-class.entity';
import { isPrimitiveType, javaClassParser } from './javaParser.js';
import chalk from 'chalk';
import { MetaAssociationLink } from 'entities/meta-association-link.entity';

async function main() {
  try {
    const json = fs.readFileSync('./carbonOut.json', 'utf-8');
    const data = JSON.parse(json).XMI.Model.packagedElement;
    const classes: MetaClass[] = [];
    const associations: MetaAssociationLink[] = [];

    data.forEach((element: any) => {
      if(element.xmitype === 'uml:Class' && element.name != '') {
        classes.push(element);
      } else if(element.xmitype == 'uml:Association') {
        const associationList = element.memberEnd.split(' ');
        associations.push({classStart: associationList[0], classEnd: associationList[1]});
      }
    });

    

    const fileList = fs.readdirSync('./java-src');
    const javaClasses: MetaClass[] = [];
    fileList.forEach((file) => {
      const javaClass: MetaClass = javaClassParser(`java-src/${file}`);
      javaClasses.push(javaClass);
    });

    classes.forEach((metaClass) => {
      console.log('Analysing class', `${chalk.underline.italic.bold(metaClass.name)}...`,);
      const javaClass = javaClasses.find((javaClass) => javaClass.name == metaClass.name);
      if(javaClass) {
        console.log('\tCorresponding Java class', chalk.bgGreen.bold('FOUND'));
        console.log('\tComparing attributes...');
        compareAttributes(metaClass, javaClass);
        console.log('\tComparing operations...');
        compareOperations(metaClass, javaClass);
      } else {

      }
    });

    associations.forEach((associationLink) => {
      console.log('Analysing associationLink', chalk.underline.italic.bold(`${associationLink.classStart}`), '->', chalk.underline.italic.bold(`${associationLink.classEnd}`));
    });
  } catch(err) {
    throw err;
  }

}

function compareAttributes(metaClass: MetaClass, javaClass: MetaClass) {
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

function compareOperations(metaClass: MetaClass, javaClass: MetaClass) {
  if(!metaClass.ownedOperation) return;
  const metaOperations = Array.isArray(metaClass.ownedOperation) ? metaClass.ownedOperation : [metaClass.ownedOperation];
  const javaOperations = javaClass.ownedOperation;
  metaOperations.forEach((metaOperation) => {
    const javaOperation = javaOperations.find((javaOperation) => javaOperation.name == metaOperation.name);
    if(javaOperation) {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgGreen.bold('FOUND'));
      /* metaOperation.ownedParameter.length includes return attribute */
      if((metaOperation.ownedParameter.length) && metaOperation.ownedParameter.length - 1 != javaOperation.ownedParameter.length) {
        console.log(metaOperation);
        console.log(javaOperation);
        console.log(`\t\t\t${chalk.bgRed('Parameter mismatch')}: Expected`, chalk.green.bold(metaOperation.ownedParameter.length), 'parameters, but found', chalk.red.bold(javaOperation.ownedParameter.length));
      }
    } else {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}

main().then(() => {
  console.log('success');
}).catch((err) => {
  console.error(chalk.bgRed(err));
})