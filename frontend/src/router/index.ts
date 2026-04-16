import { createRouter, createWebHistory } from 'vue-router';
import { LoginView } from '../views/LoginView';
import { DashboardView } from '../views/DashboardView';
import { ForbiddenView } from '../views/ForbiddenView';
import { useAuth } from '../composables/useAuth';
import { usePermissions } from '../composables/usePermissions';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    { path: '/403', component: ForbiddenView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuth();

  if (!auth.initialized.value) {
    await auth.fetchUser();
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    next('/login');
    return;
  }

  if (to.meta.guestOnly && auth.isAuthenticated.value) {
    next('/dashboard');
    return;
  }

  if (to.meta.permission) {
    const { hasPermission } = usePermissions();
    if (!hasPermission(to.meta.permission)) {
      next('/403');
      return;
    }
  }

  next();
});

export default router;
