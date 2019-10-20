"use strict";

export default class Map { 
  
  constructor() {
  }

  addCell(grid, row, col) {
    grid[row][col] = undefined; 
  };

  createArray(rowCount, colCount) {
    const grid = [];
    for (let row = 0; row < rowCount; row++) {
      grid[row] = [];
      for (let col = 0; col < colCount; col++) {
        this.addCell(grid, row, col);
      }
    }  return grid;
  }

}







