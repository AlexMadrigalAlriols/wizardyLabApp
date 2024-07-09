import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendancePage } from './attendance.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AttendancePageeRoutingModule } from './attendance-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AttendancePageeRoutingModule,
    TranslateModule
  ],
  declarations: [AttendancePage]
})
export class AttendancePageModule {}
