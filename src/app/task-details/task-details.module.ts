import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsPageRoutingModule } from './task-details-routing.module';

import { TaskDetailsPage } from './task-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailsPageRoutingModule
  ],
  declarations: [TaskDetailsPage]
})
export class TaskDetailsPageModule {}
