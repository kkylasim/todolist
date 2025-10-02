import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskView } from './edit-task-view';

describe('EditTaskView', () => {
  let component: EditTaskView;
  let fixture: ComponentFixture<EditTaskView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
