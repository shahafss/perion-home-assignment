import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role';
import { User } from '../entities/User';

/** Canonical permission strings used across the RBAC system. */
export const PERMISSIONS = {
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  ROLES_VIEW: 'roles:view',
  ROLES_EDIT: 'roles:edit'
} as const;

interface RoleSeed {
  name: string;
  permissions: string[];
}

interface UserSeed {
  name: string;
  email: string;
  roleName: string;
}

const ROLE_SEEDS: RoleSeed[] = [
  {
    name: 'Admin',
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.ROLES_EDIT
    ]
  },
  {
    name: 'Editor',
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.ROLES_VIEW
    ]
  },
  {
    name: 'Viewer',
    permissions: [PERMISSIONS.USERS_VIEW]
  }
];

const USER_SEEDS: UserSeed[] = [
  { name: 'Admin User', email: 'admin@test.com', roleName: 'Admin' },
  { name: 'Editor User', email: 'editor@test.com', roleName: 'Editor' },
  { name: 'Viewer User', email: 'viewer@test.com', roleName: 'Viewer' }
];

/**
 * Runs once on application bootstrap to ensure the database contains
 * the canonical set of roles and seed users. The operation is idempotent:
 * if roles already exist, the seeder skips all inserts.
 */
@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
    await this.seedUsers();
  }

  private async seedRoles(): Promise<void> {
    const existingCount = await this.roleRepository.count();
    if (existingCount > 0) {
      this.logger.log(`Roles already seeded (${existingCount} found). Skipping.`);
      return;
    }

    for (const seed of ROLE_SEEDS) {
      const role = this.roleRepository.create(seed);
      await this.roleRepository.save(role);
      this.logger.log(`Seeded role: ${seed.name}`);
    }
  }

  private async seedUsers(): Promise<void> {
    for (const seed of USER_SEEDS) {
      const existing = await this.userRepository.findOne({
        where: { email: seed.email }
      });

      if (existing) {
        this.logger.log(`User ${seed.email} already exists. Skipping.`);
        continue;
      }

      const role = await this.roleRepository.findOne({
        where: { name: seed.roleName }
      });

      if (!role) {
        this.logger.warn(
          `Role "${seed.roleName}" not found — skipping user ${seed.email}`
        );
        continue;
      }

      const user = this.userRepository.create({
        name: seed.name,
        email: seed.email,
        password: null,
        role
      });

      await this.userRepository.save(user);
      this.logger.log(`Seeded user: ${seed.email} (${seed.roleName})`);
    }
  }
}
