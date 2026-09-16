import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the menu', () => {
    const hamburgerButton = fixture.nativeElement.querySelector('.hamburger-btn');
    const overlay = fixture.nativeElement.querySelector('.overlay');
    const sidebar = fixture.nativeElement.querySelector('.sidebar');

    hamburgerButton.click();
    fixture.detectChanges();

    expect(component.isOpen).toBeTrue();
    expect(sidebar.classList).toContain('active');
    expect(overlay.classList).toContain('active');

    overlay.click();
    fixture.detectChanges();

    expect(component.isOpen).toBeFalse();
    expect(sidebar.classList).not.toContain('active');
    expect(overlay.classList).not.toContain('active');
  });
});
