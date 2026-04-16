import { createRouter, createWebHistory } from 'vue-router';
import { LoginView } from '../views/LoginView';
import { SignupView } from '../views/SignupView';
import { DashboardView } from '../views/DashboardView';
import { ForbiddenView } from '../views/ForbiddenView';
import { useAuth } from '../composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/signup', component: SignupView, meta: { guestOnly: true } },
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

  const requiredPermissions = to.meta.permissions;
  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPermissions = auth.user.value?.role?.permissions ?? [];
    const hasAll = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );
    if (!hasAll) {
      next('/403');
      return;
    }
  }

  next();
});

export default router;
