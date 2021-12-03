import { Injectable } from '@angular/core';

import { KnapsackItem, KnapsackItems } from '../model/knapsack';

export interface OptimizedKnapsack {
  items: KnapsackItems;
  total: number;
}

interface GridItem {
  value: number;
  contains: KnapsackItems;
}

type Index1Based = number;

@Injectable({
  providedIn: 'root'
})
export class KnapsackService {
  private grid: GridItem[][] = [];

  optimize(size: number, items: KnapsackItems): OptimizedKnapsack {
    this.buildGrid(size, items);

    const solution = this.getGridItem(items.length, size);
    const total = solution.contains.reduce((acc, item) => acc + item.value, 0);

    return {
      total,
      items: [
        ...solution.contains
      ],
    };
  }

  private buildGrid(size: number, items: KnapsackItems) {
    this.grid = new Array(items.length);

    items.forEach((item, row0) => {
      this.grid[row0] = new Array(size);

      for (let i = 1; i <= size; i++) {
        this.grid[row0][i - 1] = this.buildGridItem(item, row0 + 1, i);
      }

    })
  }

  private buildGridItem(current: KnapsackItem, row: Index1Based, col: Index1Based): GridItem {
    const prevRowCell = this.getGridItem(row - 1, col);
    let result: GridItem = {
      value: prevRowCell.value,
      contains: [...prevRowCell.contains]
    }

    if (current.size <= col) {
      const restCell = this.getGridItem(row - 1, col - current.size);

      const currentValue = restCell.value + current.value;
      if (currentValue > prevRowCell.value) {
        result = {
          value: currentValue,
          contains: [...restCell.contains, current]
        }
      }
    }

    return result
  }

  private getGridItem(row: Index1Based, col: Index1Based): GridItem {
    const row0 = row - 1;
    const col0 = col - 1;

    if (row0 < 0 || col0 < 0) {
      return {
        value: 0,
        contains: []
      }
    } else {
      return this.grid[row0][col0];
    }
  }

}
