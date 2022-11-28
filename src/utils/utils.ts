export function isPrimitiveType(type?: string) {
  return type === 'int' || type === 'double' || type === 'float' || type === 'char' || type === 'boolean' || type === 'String' || type === 'long' || type === 'short' || type === 'byte' || type === 'Date' || type === 'Integer';
}

// remove spaces from the beggining of a line
export function trimSpaces(line: string) {
  if(!line) return line;
  return line.replace(/^\s+/g, '');
}
