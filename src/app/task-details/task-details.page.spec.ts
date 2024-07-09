import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsPage } from './task-details.page';

describe('TaskDetailsPage', () => {
  let component: TaskDetailsPage;
  let fixture: ComponentFixture<TaskDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
