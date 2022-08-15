import { MetaAssociation } from './entities/meta-association.entity';
import { MetaClass } from './entities/meta-class.entity';
import * as fs from 'fs';
import { javaClassParser } from './javaParser.js';

async function main() {
  try {
    const json = fs.readFileSync('./carbonOut.json', 'utf-8');
    const data = JSON.parse(json).XMI.Model.packagedElement;
    const classes: MetaClass[] = [];
    data.forEach((element: MetaClass /*| MetaAssociation*/) => {
      if(element.xmitype == 'uml:Class') {
        classes.push(element);
      }
    })
    const javaClass: MetaClass | undefined = javaClassParser('./GST.java');
    let found = 'Not Found';
    classes.forEach((metaClass) => {
      if(metaClass.name == javaClass?.name) found = 'Found';
    });
    console.log(found);

  } catch(err) {
    console.error(err)
    throw new Error('Error in main');
  }

}


main().then(() => {
  console.log('success');
}).catch((err) => {
  console.error(err);
})