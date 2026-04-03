import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView';
import SignupView from '../views/SignupView';
import DashboardView from '../views/DashboardView';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/signup', component: SignupView },
    { path: '/dashboard', component: DashboardView },
    { path: '/:pathMatch(.*)*', redirect: '/login' }
  ]
});

export default router;
