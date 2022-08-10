import * as fs from 'fs'
import { MetaClass } from 'entities/meta-class.entity'

export function javaClassParser(filePath: string) : [MetaClass?] {
  const source = fs.readFileSync('broadband.sql', 'utf-8');
  const lines = source.split(/\r?\n/);
  const newClass = new MetaClass();
  for (const line of lines) {
    const words = line.split(' ');
    for (const element of words) {
      if (element == 'import') break;
      if (element == 'public' || 'private') continue; // TODO check class visibility
      if (element == 'class') continue;
      newClass.name = element; 
    }
  }
  return [];
}