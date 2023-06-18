import { MetaAttribute } from "./meta-attribute.entity";

export class MetaAssociationAttribute extends MetaAttribute {
  constructor() {
    super();
    this.lowerValue = { value: '' };
    this.upperValue = { value: '' };
  }
  aggregation?: string;
  association?: string;
  lowerValue?: {
    value?: string;
  };
  upperValue?: {
    value?: string;
  };
} 