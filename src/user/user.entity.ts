import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: true,
  })
  email: string;
}
