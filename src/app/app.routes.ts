import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/stylekart/onboarding/onboarding.page').then(
        (m) => m.OnboardingPage
      ),
  },
  {
    path: 'start',
    loadComponent: () => import('./pages/stylekart/start/start.page').then( m => m.StartPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/stylekart/home/home.page').then( m => m.HomePage)
  },
];
