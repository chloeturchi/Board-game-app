"use strict";

export default class Map { 
  
  constructor(gridSize) {
    this.gridSize = gridSize;
  }
  
  generateGrid(parentID) {
    for (let i = 0; i < this.gridSize; i++) {
      let newRowDiv = document.createElement("div");
      newRowDiv.setAttribute("id", `grid-row-${i}`);
      newRowDiv.setAttribute("class", "grid-row");
      for (let x = 0; x < this.gridSize; x++) {
        let newColDiv = document.createElement("div");
        newColDiv.setAttribute("id", `grid-cell-${i}-${x}`);
        newColDiv.setAttribute("class", "grid-cell");
        newRowDiv.appendChild(newColDiv);
      }
      $(parentID).append(newRowDiv);
    }
  }

  createArray(rowCount, colCount) {
    const grid = [];
    for (let row = 0; row < rowCount; row++) {
      grid[row] = [];
      for (let col = 0; col < colCount; col++) {
        grid[row][col] = undefined; 
      }
    }  return grid;
  }

}







