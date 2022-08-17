import { MetaParameter } from "./meta-parameter.entity";

export class MetaOperation {
  "name": string;
  "returnType": string;
  "visibility": string;
  "id": string;
  "xmitype": string;
  "ownedParameter": MetaParameter[] = [];
}