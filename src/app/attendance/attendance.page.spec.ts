import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AttendancePage } from './attendance.page';

describe('Tab1Page', () => {
  let component: AttendancePage;
  let fixture: ComponentFixture<AttendancePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendancePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
