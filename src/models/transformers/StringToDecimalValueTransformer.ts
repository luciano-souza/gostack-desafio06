import { ValueTransformer } from 'typeorm';

export default class StringToDecimalValueTransformer
  implements ValueTransformer {
  // In this case I want to remain as number because the field is nuber on the DB
  to(value: number): number {
    return value;
  }

  from(value: string): number {
    return parseFloat(value);
  }
}
