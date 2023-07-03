import * as fs from 'fs'
import { MetaClass } from './entities/meta-class.entity'
import { MetaAttribute } from './entities/meta-attribute.entity';
import { MetaOperation } from './entities/meta-operation.entity';
import { MetaAssociationAttribute } from './entities/meta-association-attribute.entity';
import { MetaParameter } from './entities/meta-parameter.entity';
import { isPrimitiveType, trimSpaces } from './utils/utils';

export function javaClassParser(filePath: string) : MetaClass {
  const source = fs.readFileSync(filePath, 'utf-8');
  const lines = source.split(/\r?\n/).filter((line) => line != '');
  const newClass = new MetaClass();
  let wasOp = false;
  let count = 0;
  for (let line of lines) {
    let newLine = trimSpaces(line);
    // skip comments whole line comments
    if(newLine.startsWith('//')) {
      continue;
    }
    // trim comments
    if(newLine.includes(' //')) {
      newLine = newLine.split(' //')[0];
    }

    const words = newLine.split(/[\s;, ]+/);
    let flagAtt = newLine[newLine.length-1] === ";";
    let flagFuncName = false;
    let flagClass = false;

    // check if it has return type
    let compLine = newLine.replace(/[(){}]+/, '');
    if (compLine != newLine)
      flagFuncName = true;

    // check if it is inside an operation and ignore
    if (wasOp){
      if(newLine[newLine.length-1] == '{' || words[0] === '{')
        count ++;
      if(newLine[newLine.length-1] == '}' || words[0] === '}'){
        count --;
        if (count === 0)
          wasOp = false;
      }
      continue;
    }

    // if it is import, empty line or braces, skip
    if (words[0] === 'import' || words[0] === '}' || words[0] === '' || words[0] === '{') {
      continue;
    } 
    
    if (words[0] === 'class'){
      newClass.name = words[1];
      flagClass = true;
    }
    if (words[1] === 'class'){
      newClass.visibility = words[0];
      newClass.name = words[2];
      flagClass = true;
    }
    if (!flagClass){
      if (flagAtt) {
        parseAttribute(words, newClass);
      } else {
        if(newLine[newLine.length-1] === '{' || words[0] === '{') {
          count ++;
        }

        wasOp = true;
        parseOperation(words, newClass, flagFuncName);
      }
    }
  }
  return newClass;
}

function parseAttribute(words: string[], newClass: MetaClass) {
  let attribute;
  if(words[0] !== 'private' && words[0] !== 'public') {
    words.unshift('package');
  }
  if(isPrimitiveType(words[1])) {
    attribute = new MetaAttribute();
  attribute.type = words[1];
  } else {
    attribute = new MetaAssociationAttribute();
    attribute.lowerValue!.value = '1';
    words[1].includes('[]') || words[1].includes('ArrayList')
      ? attribute.upperValue!.value = '*' 
      : attribute.upperValue!.value = '1';
    const arrayType = words[1].split(/[<>]+/)[1];
    attribute.type = arrayType ? arrayType : words[1];
  }
  attribute.visibility = words[0];
  attribute.name = words[2];
  newClass.ownedAttribute.push(attribute);
}

function parseOperation(words: string[], newClass: MetaClass, flag: boolean) {
  const op = new MetaOperation();
  if(words[0] !== 'private' && words[0] !== 'public') {
    words.unshift('package');
  }
  op.visibility = words[0];
  op.name = flag ? words[2] : words[1];
  op.name = op.name.split('(')[0];
  op.returnType = flag ? words[1] : '';
  parseParameters(words, op);

  newClass.ownedOperation.push(op);
}

function parseParameters(words: string[], op: MetaOperation) {
  let params: any = words.join(',').split('(')[1];
  params = params.split(')')[0].split(',');
  for (let i = 0; i < params.length; i+=2) {
    const param = new MetaParameter();
    param.type = params[i];
    param.name = params[i+1];
    op.ownedParameter.push(param);
  }
}
