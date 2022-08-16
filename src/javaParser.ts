import * as fs from 'fs'
import { MetaClass } from './entities/meta-class.entity'
import { MetaAttribute } from './entities/meta-attribute.entity';
import { MetaOperation } from './entities/meta-operation.entity';

export function javaClassParser(filePath: string) : MetaClass {
  const source = fs.readFileSync(filePath, 'utf-8');
  const lines = source.split(/\r?\n/);
  const newClass = new MetaClass();
  for (const line of lines) {
    let newLine = ltrim(line);
    const words = newLine.split(/[\s;(), ]+/);
    let flag = newLine[newLine.length-1] == ";";
    let flagClass = false;

    // if it is import, empty line or braces, skip
    if (words[0] == 'import' || words[0] == '}' || words[0] == '' || words[0] == '{') continue;
    if (words[0] == 'class'){
      newClass.name = words[1];
      flagClass = true;
    }
    if (words[1] == 'class'){
      newClass.name = words[2];
      flagClass = true;
    }
    if (!flagClass){
      if (flag) {
        parseAttribute(words, newClass);
      } else {
        parseOperation(words, newClass);
      }
    }
  }
  console.log(JSON.stringify(newClass, null, 2));
  return newClass;
}

function parseAttribute(words: string[], newClass: MetaClass) {
 
  const attribute = new MetaAttribute();
  attribute.visibility = words[0];
  attribute.type = words[1];
  attribute.name = words[2];
  newClass.ownedAttribute.push(attribute);
}

function parseOperation(words: string[], newClass: MetaClass) {
  const op = new MetaOperation();
  op.visibility = words[0];
  op.name = words[1];
  newClass.ownedOperation.push(op);
}

function ltrim(line: string) {
  if(!line) return line;
  return line.replace(/^\s+/g, '');
}