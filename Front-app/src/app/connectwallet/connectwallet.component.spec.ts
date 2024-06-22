import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectwalletComponent } from './connectwallet.component';

describe('ConnectwalletComponent', () => {
  let component: ConnectwalletComponent;
  let fixture: ComponentFixture<ConnectwalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectwalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
