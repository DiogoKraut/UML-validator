import { MetaAssociation } from 'entities/meta-association.entity';
import { MetaClass } from 'entities/meta-class.entity';
import * as fs from 'fs';

async function main() {

  try {
    const json = fs.readFileSync('cabonOut.json', 'utf-8');
    const data = JSON.parse(json).XMI.Model.packagedElement;

    data.forEach((element: MetaClass | MetaAssociation) => {
      if(element.xmitype == 'uml:Class') {
        //@ts-ignore
        const newClass: MetaClass = element;
        console.log(newClass);
      }
    })

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