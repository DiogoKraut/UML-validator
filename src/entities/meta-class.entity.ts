import { MetaAssociationAttribute } from "./meta-association-attribute.entity";
import { MetaAttribute } from "./meta-attribute.entity";
import { MetaOperation } from "./meta-operation.entity";

export class MetaClass {
  "name": string;
  "id": string;
  "xmitype": string;
  "ownedAttribute": MetaAttribute[] | MetaAssociationAttribute[] = [];
  "ownedOperation": MetaOperation[] = [];
}