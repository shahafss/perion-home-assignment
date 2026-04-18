import 'vue-router';
import { type Permission } from './permissions';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    permission?: Permission;
  }
}
