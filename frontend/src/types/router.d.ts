import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    /**
     * A single permission string the authenticated user must possess.
     * Example: 'users:create'
     */
    permission?: string;
  }
}
