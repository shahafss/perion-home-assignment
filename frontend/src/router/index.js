import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';
import DashboardView from '../views/DashboardView';
import { useAuth } from '../composables/useAuth';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', component: LoginView, meta: { guestOnly: true } },
        { path: '/signup', component: SignupView, meta: { guestOnly: true } },
        { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
        { path: '/:pathMatch(.*)*', redirect: '/login' }
    ]
});
router.beforeEach(async (to, _from, next) => {
    const { init, isAuthenticated } = useAuth();
    await init();
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login');
        return;
    }
    if (to.meta.guestOnly && isAuthenticated.value) {
        next('/dashboard');
        return;
    }
    next();
});
export default router;
