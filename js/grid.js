export default class Grid { 
  
  static directions = {
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0]
  };

  constructor (rowCount, colCount){
    this.grid = this.create(rowCount, colCount)
  }

  create(rowCount = 10, colCount = 10) {
    const grid = [];
    for (let row = 0; row < rowCount; row++) {
      grid[row] = [];
      for (let col = 0; col < colCount; col++) {
        grid[row][col] = undefined; 
      }
    }  
    return grid;
  }

  ////////////////////////////// CREATE A RANDOM NUMBER //////////////////////////////
  generateRandomNumber(){
    return Math.floor(Math.random() * this.grid.length)
  }

  ////////////////////////////// FUNCTION TO ADD OBJECTS IN ARRAY //////////////////////////////
  addElement(element){
    const randomRow = this.generateRandomNumber();
    const randomCol = this.generateRandomNumber();
    if (randomRow - 1 !== -1 && this.grid[randomRow - 1][randomCol] !== undefined) { 
        this.addElement(element);
    } else if (randomRow + 1 !== this.grid.length && this.grid[randomRow + 1][randomCol] !== undefined) {
        this.addElement(element);
    } else if (randomCol - 1 !== -1 && this.grid[randomRow][randomCol - 1] !== undefined) {
        this.addElement(element);
    } else if (randomCol + 1 !== this.grid.length && this.grid[randomRow][randomCol + 1] !== undefined) {
        this.addElement(element);
    } else if (this.grid[randomRow][randomCol] == undefined){ 
        this.grid[randomRow][randomCol] = element;
    } else {
        this.addElement(element);
    }
  }

  getElement(row, col){
    return this.grid[row][col];
  }

  setElement(row, col, element){
    this.grid[row][col] = element;
  }

  moveElement(previousRow, previousCol, nextRow, nextCol){
    const element = this.grid[previousRow][previousCol];
    this.grid[previousRow][previousCol] = undefined
    this.grid[nextRow][nextCol] = element;
  }

}







