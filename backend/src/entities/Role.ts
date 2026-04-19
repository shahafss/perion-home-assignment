import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Represents a role in the RBAC system.
 * Each role carries a flat list of permission strings (e.g. "users:view").
 * The `simple-array` column type stores the array as a comma-separated
 * string in a single VARCHAR column — no join table required.
 */
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
    transformer: {
      to: (value: string[]): string => (value ?? []).join(','),
      from: (value: string | null): string[] =>
        value ? value.split(',').filter(Boolean) : [],
    },
  })
  permissions!: string[];
}
