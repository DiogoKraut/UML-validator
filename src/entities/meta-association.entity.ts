import { MetaAttribute } from "./meta-attribute.entity";

export class MetaAssociation extends MetaAttribute {
  constructor() {
    super();
    this.lowerValue = { value: '' };
    this.upperValue = { value: '' };
  }
  
  association?: string;
  lowerValue?: {
    value?: string;
  };
  upperValue?: {
    value?: string;
  };
} 



// export class MetaAssociation {
//   memberEnd?: string;
//   name?: string;
//   id?: string;
//   xmitype?: string;
// }