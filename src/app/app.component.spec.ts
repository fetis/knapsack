import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KnapsackService } from './services/knapsack.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const knapsackMockService: Partial<KnapsackService> = {
  optimize() {
    return {
      total: 10,
      items: [{ value: 100, size: 1}]
    }
  }
}
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [
        AppComponent
      ],
      providers: [
        FormBuilder,
        { provide: KnapsackService, useValue: knapsackMockService }
      ],
      imports: [
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;
  });

  describe('Form', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('should render size control', () => {
      expect(nativeEl.querySelector('[formControlName=size]')).toBeTruthy();
    });

    it('should render item controls', () => {
      expect(nativeEl.querySelector('.item-form [formControlName=size]')).toBeTruthy();
      expect(nativeEl.querySelector('.item-form [formControlName=value]')).toBeTruthy();
    });

    it('should add element', () => {
      expect(component.items.length).toBe(3);

      const btn = nativeEl.querySelector('[mat-raised-button]') as HTMLButtonElement;
      btn.click();

      expect(component.items.length).toBe(4);
    });

    it('should remove element', () => {
      expect(component.items.length).toBe(3);

      const btn = nativeEl.querySelector('[mat-icon-button]') as HTMLButtonElement;
      btn.click();

      expect(component.items.length).toBe(2);
    });
  });

  describe('Result output', () => {
    let service: KnapsackService;

    beforeEach(() => {
      service = TestBed.inject(KnapsackService);
    })

    it('should call service on init', () => {
      spyOn(service, 'optimize').and.callThrough();

      fixture.detectChanges();

      expect(service.optimize).toHaveBeenCalled();
    });

    it('should call service on form change', () => {
      fixture.detectChanges();

      spyOn(service, 'optimize').and.callThrough();

      component.form.patchValue({
        size: 5
      });

      expect(service.optimize).toHaveBeenCalled();
    });

    it('should NOT call service if form invalid', () => {
      fixture.detectChanges();

      spyOn(service, 'optimize').and.callThrough();

      component.form.patchValue({
        size: -5
      });

      expect(service.optimize).not.toHaveBeenCalled();
    });

    it('should render result', () => {
      fixture.detectChanges();

      const output = nativeEl.querySelector('.layout__col2')?.textContent;

      expect(output).toContain('Total value 10');
    });

    it('should render result items', () => {
      fixture.detectChanges();

      const output = nativeEl.querySelector('li')?.textContent;

      expect(output).toContain('value 100');
      expect(output).toContain('size 1');
    });
  })


});
