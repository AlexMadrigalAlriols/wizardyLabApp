import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './-guard/auth.guard';
import { PortalResolver } from './portal.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
    resolve: {
      portal: PortalResolver
    }
  },
  {
    path: 'create-task',
    loadChildren: () => import('./create-task/create-task.module').then(m => m.CreateTaskPageModule)
  },
  {
    path: 'edit-task/:id',
    loadChildren: () => import('./create-task/create-task.module').then(m => m.CreateTaskPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
