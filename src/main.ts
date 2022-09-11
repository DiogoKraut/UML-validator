import * as fs from 'fs';
import { MetaClass } from './entities/meta-class.entity';
import { javaClassParser } from './javaParser.js';
import chalk from 'chalk';

async function main() {
  try {
    const json = fs.readFileSync('./carbonOut.json', 'utf-8');
    const data = JSON.parse(json).XMI.Model.packagedElement;
    const classes: MetaClass[] = [];
    data.forEach((element: MetaClass) => {
      if(element.xmitype == 'uml:Class' && element.name != '') {
        classes.push(element);
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
  } catch(err) {
    throw err;
  }

}

function compareAttributes(metaClass: MetaClass, javaClass: MetaClass) {
  const metaAttributes = metaClass.ownedAttribute;
  if(!metaAttributes) return;
  const javaAttributes = javaClass.ownedAttribute;
  metaAttributes.forEach((metaAttribute) => {
    if(metaAttribute.name === '') return;
    const javaAttribute = javaAttributes.find((javaAttribute) => javaAttribute.name == metaAttribute.name);
    if(javaAttribute) {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgGreen.bold('FOUND'));
      if(metaAttribute.type != javaAttribute.type) {
        console.log('\t\t\tType mismatch', chalk.bgRed.bold(metaAttribute.type), 'vs', chalk.bgGreen.bold(javaAttribute.type));
      }
    } else {
      console.log('\t\tAttribute', chalk.underline.italic.bold(metaAttribute.name), chalk.bgRed.bold('NOT FOUND'));
    }
  });
}

function compareOperations(metaClass: MetaClass, javaClass: MetaClass) {
  const metaOperations = metaClass.ownedOperation;
  if(!metaOperations) return;
  console.log(metaOperations);
  const javaOperations = javaClass.ownedOperation;
  metaOperations.forEach((metaOperation) => {
    const javaOperation = javaOperations.find((javaOperation) => javaOperation.name == metaOperation.name);
    if(javaOperation) {
      console.log('\t\tOperation', chalk.underline.italic.bold(metaOperation.name), chalk.bgGreen.bold('FOUND'));
      if(metaOperation.ownedParameter.length != javaOperation.ownedParameter.length) {
        console.log('\t\t\tParameter mismatch', chalk.bgRed.bold(metaOperation.ownedParameter.length), 'vs', chalk.bgGreen.bold(javaOperation.ownedParameter.length));
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