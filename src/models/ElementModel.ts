import { IsNumber, IsObject, IsString } from 'class-validator';

export class ElementModel {
  id: number;
  parent_id: number;
  type: string;
  atributes: object;
}

export class ElementDTO {
  id?: number;

  parent_id: number;

  @IsString()
  type: string;

  @IsObject()
  atributes: object;
}
