import { ProvidersEnum } from 'src/shared/enums/provider.enums';
import { RolesEnum } from 'src/shared/enums/role.enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'refresh',
    nullable: true,
    select: false,
    type: 'text',
  })
  refresh: string | null;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @Column({
    type: 'enum',
    enum: ProvidersEnum,
    default: ProvidersEnum.LOCAL,
  })
  provider: ProvidersEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
