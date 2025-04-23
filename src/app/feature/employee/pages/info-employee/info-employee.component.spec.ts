import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEmployeeComponent } from './info-employee.component';

describe('InfoEmployeeComponent', () => {
  let component: InfoEmployeeComponent;
  let fixture: ComponentFixture<InfoEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
