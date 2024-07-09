import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailsPage } from './task-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDetailsPageRoutingModule {}
