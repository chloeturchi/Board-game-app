import Map from './map.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Character from './character.js'

/******************* Generate grid divs and 2D array */
const gameMap = new Map (10);
gameMap.generateGrid("#wrapper");
const gridContent = gameMap.createArray(10,10);

/******************** Obstacles */
// Put obstacles in an array
const obstacleArray = [];

function obstacleInArray (number){
    for (let i = 0; i < number; i++) {
        const newObstacle = new Obstacle(i);
        obstacleArray.push(newObstacle);
    };  
} 
obstacleInArray(8);

// Add obstacles array & display in grid
for (let i = 0; i < obstacleArray.length; i++){
    function obstacleRandom(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] == undefined) {
            gridContent[randomRow][randomCol] = obstacleArray[i];
            $("#grid-cell-" + randomRow + "-" + randomCol).addClass("obstacle");
            $("#grid-cell-" + randomRow + "-" + randomCol).append("<img class='obstacleImg' src='assets/img/obstacle.svg'/>");
        } else {
            obstacleRandom();
        }
    } obstacleRandom();
};

/******************** Functions */
// Create random Number
function randomNumber(){
    return Math.floor(Math.random() * gridContent.length)
}

console.log(gridContent);