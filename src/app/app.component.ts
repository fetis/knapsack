import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { KnapsackService, OptimizedKnapsack } from './services/knapsack.service';
import { KnapsackItems } from './model/knapsack';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup;
  solution: OptimizedKnapsack | undefined;

  get items(): FormGroup[] {
    return this.itemArray.controls as FormGroup[];
  }

  private get itemArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private sub = new Subscription();

  constructor(
    private knapsackService: KnapsackService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.subscribeToForm();

    this.calculate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addItem() {
    this.itemArray.push(this.getNewGroup())
  }

  removeItem(i: number) {
    this.itemArray.removeAt(i);
  }

  calculate() {
    const items = this.mapToKnapsack();
    const size = this.form.get('size')!.value;

    this.solution = this.knapsackService.optimize(size, items);
  }

  private mapToKnapsack(): KnapsackItems {
    return this.items.map(group => {
      const { value, size } = group.value;

      return {
        value,
        size
      }
    })
  }

  private buildForm() {
    this.form = this.fb.group({
      size: [3, Validators.min(0)],
      items: this.fb.array([
        this.getNewGroup(50, 1),
        this.getNewGroup(100, 2),
        this.getNewGroup(20, 2)
      ])
    });
  }

  private subscribeToForm() {
    this.sub.add(
      this.form.valueChanges.pipe(
        filter(() => {
          return this.form.valid
        })
      ).subscribe(() => {
        this.calculate();
      })
    )
  }

  private getNewGroup(value = 20, size = 1): FormGroup {
    return this.fb.group({
      value: [value, Validators.min(0)],
      size: [size, Validators.min(0)]
    })
  }

}
