import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTaskDialog } from './input-task-dialog';

describe('InputTaskDialog', () => {
  let component: InputTaskDialog;
  let fixture: ComponentFixture<InputTaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTaskDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTaskDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
