import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenIntegrationComponent } from './token-integration.component';

describe('TokenIntegrationComponent', () => {
  let component: TokenIntegrationComponent;
  let fixture: ComponentFixture<TokenIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
