import { TestBed } from '@angular/core/testing';

import { KnapsackService } from './knapsack.service';
import { KnapsackItem } from '../model/knapsack';

const item100: KnapsackItem = {
  value: 100,
  size: 1,
}

const item10: KnapsackItem = {
  value: 10,
  size: 2,
}

const item1: KnapsackItem = {
  value: 1,
  size: 3
}

const testItems = [item100, item10, item1];

describe('KnapsackService', () => {
  let service: KnapsackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KnapsackService);
  });

  it('should optimize for size 3', () => {
    const result = service.optimize(3, testItems);

    expect(result).toEqual({
      total: 110,
      items: [item100, item10]
    });
  });

  it('should optimize for size 10', () => {
    const result = service.optimize(10, testItems);

    expect(result).toEqual({
      total: 111,
      items: [item100, item10, item1]
    });
  });

  it('should optimize for size 0', () => {
    const result = service.optimize(0, testItems);

    expect(result).toEqual({
      total: 0,
      items: []
    });
  });


  it('should optimize for non elements ', () => {
    const result = service.optimize(10, []);

    expect(result).toEqual({
      total: 0,
      items: []
    });
  });

});
