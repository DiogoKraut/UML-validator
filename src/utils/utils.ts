export function isPrimitiveType(type?: string) {
  return type === 'int' || type === 'double' || type === 'float' || type === 'char' || type === 'boolean' || type === 'String' || type === 'long' || type === 'short' || type === 'byte' || type === 'Date' || type === 'Integer' || type === '_I45gIRU0Ee6PAM8hniUwVQ' || type === '_I46HoxU0Ee6PAM8hniUwVQ';
}

// remove spaces from the beggining of a line
export function trimSpaces(line: string) {
  if(!line) return line;
  return line.replace(/^\s+/g, '');
}
