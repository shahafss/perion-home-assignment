import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    /**
     * List of permission strings the authenticated user must possess.
     * All listed permissions must be present (AND logic).
     * Example: ['users:view', 'users:edit']
     */
    permissions?: string[];
  }
}
