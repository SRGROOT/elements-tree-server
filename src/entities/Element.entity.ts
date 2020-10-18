import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ElementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column()
  type: string;

  @Column('json')
  atributes: object;
}
