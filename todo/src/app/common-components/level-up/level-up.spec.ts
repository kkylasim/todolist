import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelUp } from './level-up';

describe('LevelUp', () => {
  let component: LevelUp;
  let fixture: ComponentFixture<LevelUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
