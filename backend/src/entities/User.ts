import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Role } from './Role';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  /** Not selected by default to avoid accidentally leaking the hash. */
  @Column({ type: 'varchar', select: false, nullable: true })
  password!: string | null;

  /**
   * Eagerly loaded so that every `findOne` / `find` call automatically
   * includes the role and its permissions — no manual `relations` option needed.
   */
  @ManyToOne(() => Role, { eager: true, nullable: false })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
