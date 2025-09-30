import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandList } from './expand-list';

describe('ExpandList', () => {
  let component: ExpandList;
  let fixture: ComponentFixture<ExpandList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
