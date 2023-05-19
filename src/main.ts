import * as fs from 'fs';
import { MetaClass } from './entities/meta-class.entity';
import { javaClassParser } from './javaParser.js';
import chalk from 'chalk';
import { MetaAssociationLink } from './entities/meta-association-link.entity';
import { validateClasses } from './validator';

const path = process.argv.slice(2)[0];
const splitPath = path.split('/');
async function main() {
  try {
    console.log(process.argv)
    console.log(`args: ${path}`)
    console.log(process.cwd())
    const json = fs.readFileSync(path , 'utf-8');
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

    const fileList = fs.readdirSync(splitPath.slice(0, 2).join('/')).filter((file) => file.endsWith('.java'));
    const javaClasses: MetaClass[] = [];
    fileList.forEach((file) => {
      const javaClass: MetaClass = javaClassParser(`${splitPath.slice(0, 2).join('/')}/${file}`);
      // console.log('javaClass', javaClass)
      javaClasses.push(javaClass);
    });

    validateClasses(classes, javaClasses, associations);
  } catch(err) {
    throw err;
  }

}

main().then(() => {
  console.log('success');
}).catch((err) => {
  console.error(chalk.bgRed(err));
})