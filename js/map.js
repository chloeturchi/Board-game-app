"use strict";

export default class Map { 
  
  constructor(grid_size) {
    this.grid_size = grid_size;
  }
  
  generateGrid(parentID) {
    for (let i = 0; i < this.grid_size; i++) {
      let new_row_div = document.createElement("div");
      new_row_div.setAttribute("id", `grid-row-${i}`);
      new_row_div.setAttribute("class", "grid-row");
      for (let x = 0; x < this.grid_size; x++) {
        let new_col_div = document.createElement("div");
        new_col_div.setAttribute("id", `grid-cell-${i}-${x}`);
        new_col_div.setAttribute("class", "grid-cell");
        new_row_div.appendChild(new_col_div);
      }
      $(parentID).append(new_row_div);
    }
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







