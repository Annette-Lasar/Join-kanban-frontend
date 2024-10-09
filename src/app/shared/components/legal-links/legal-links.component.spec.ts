import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalLinksComponent } from './legal-links.component';

describe('LegalLinksComponent', () => {
  let component: LegalLinksComponent;
  let fixture: ComponentFixture<LegalLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalLinksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
