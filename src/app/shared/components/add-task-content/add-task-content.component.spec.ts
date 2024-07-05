import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskContentComponent } from './add-task-content.component';

describe('AddTaskContentComponent', () => {
  let component: AddTaskContentComponent;
  let fixture: ComponentFixture<AddTaskContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTaskContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
