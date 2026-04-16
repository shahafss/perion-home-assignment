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

  /**
   * Stores permissions as a comma-separated list in a single column.
   * Example value in DB: "users:view,users:edit,roles:view"
   */
  @Column({ type: 'simple-array', default: '' })
  permissions!: string[];
}
