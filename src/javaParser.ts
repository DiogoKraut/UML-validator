import * as fs from 'fs'
import { MetaClass } from './entities/meta-class.entity'
import { MetaAttribute } from './entities/meta-attribute.entity';
import { MetaOperation } from './entities/meta-operation.entity';

export function javaClassParser(filePath: string) : MetaClass | undefined {
  const source = fs.readFileSync(filePath, 'utf-8');
  const lines = source.split(/\r?\n/);
  const newClass = new MetaClass();

  for (const line of lines) {
    const words = line.split(/[\s;(),]+/);
    // if is import or empty line, skip
    if (words[0] == 'import' || words[0] == '') continue;
    
    let i;
    for (i = 0; i < words.length; i++) {
      if (words[1] == 'class' || words[0] == 'class') {
        newClass.name = words[2]; 
      }
    }
    if (words[words.length] == ';') {
      parseAttribute(words, newClass);
    } else {
      parseOperation(words, newClass);
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
  op.name = words[2];
  newClass.ownedOperation.push(op);
}