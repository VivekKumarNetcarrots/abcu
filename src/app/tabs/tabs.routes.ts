import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'games',
        loadComponent: () =>
          import('../pages/games/games.page').then((m) => m.GamesPage),
      },
      {
        path: 'reels',
        loadComponent: () =>
          import('../pages/reels/reels.page').then((m) => m.ReelsPage),
      },
      {
        path: 'more',
        loadComponent: () =>
          import('../pages/more/more.page').then((m) => m.MorePage),
      },
      {
        path: '',
        redirectTo: '/tabs/games',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/games',
    pathMatch: 'full',
  },
];
