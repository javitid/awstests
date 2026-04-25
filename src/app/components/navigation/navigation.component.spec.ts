import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { NavigationComponent } from './navigation.component';
import { HelperService } from '../../services/helper.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        ToggleSwitchModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: HelperService,
          useValue: {
            isSmallScreen: false
          }
        },
        {
          provide: ThemeService,
          useValue: {
            getTheme: jest.fn().mockReturnValue(''),
            setTheme: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            signOutExternal: jest.fn().mockResolvedValue(undefined)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
