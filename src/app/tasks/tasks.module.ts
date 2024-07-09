import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TasksService } from '../-services/tasks.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksPageRoutingModule,
    NgxDatatableModule,
    TranslateModule
  ],
  declarations: [TasksPage],
  providers: [TasksService]
})
export class TasksPageModule {}
