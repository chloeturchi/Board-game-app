import Map from './map.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Player from './character.js'

/************************************* ETAPE 1 *************************************/

////////////////////////////// GENERATE 2DARRAY //////////////////////////////

const gameMap = new Map ();
const gridContent = gameMap.createArray(10,10);

////////////////////////////// INSTANCES //////////////////////////////

const obstacle = new Obstacle("<img class='obstacleImg' src='assets/img/obstacle.svg'/>");

const dagger = new Weapon("dagger", 10, "<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>");
const bow = new Weapon("bow", 20, "<img class='weaponImg' id='bowImg' src='assets/img/bow.svg'/>");
const axe = new Weapon("axe", 30, "<img class='weaponImg' id='axeImg' src='assets/img/axe.svg'/>");
const sword = new Weapon("sword", 40, "<img class='weaponImg' id='swordImg' src='assets/img/sword.svg'/>");

const player1 = new Player("Player1", 100, dagger, "nothing", "<img class='playerImg' id ='player1Img' src='assets/img/perso1.svg'/>", 'weaponPlayer1');
const player2 = new Player("Player2", 100, dagger, "nothing", "<img class='playerImg' id ='player2Img' src='assets/img/perso2.svg'/>", 'weaponPlayer2');

////////////////////////////// DISPLAYED INFORMATION GAME //////////////////////////////

$("#" + player1.weaponId).append(dagger.img);
$("#" + player2.weaponId).append(dagger.img);

////////////////////////////// CHANGEABLE VALUES //////////////////////////////
const obstacleNumber = 8; // Choose the number of obstacles you want 
const moveNumber = 3; // Choose the number of moves a player can do

////////////////////////////// VARIABLES & ARRAYS //////////////////////////////

// Get players positions on grid //
let player1Position = [];
let player2Position = [];

const obstacleArr = []; // Obstacles //
for (let i = 0; i < obstacleNumber; i++) {
    obstacleArr.push(obstacle);
};  

const weaponArr = []; // Weapons //
weaponArr.push.apply(weaponArr, [bow, axe, sword]);

const playerArr = []; // Players //
playerArr.push.apply(playerArr, [player1, player2]); 

////////////////////////////// ADD OBSTACLES IN A GLOBAL ARRAY AND DISPLAY //////////////////////////////

for (let i = 0; i < obstacleArr.length; i++){
    function displayObstacles(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] == undefined) {
            gridContent[randomRow][randomCol] = obstacleArr[i];
        } else {
            displayObstacles();
        }
    };  displayObstacles()
};

////////////////////////////// ADD WEAPONS //////////////////////////////

for (let i = 0; i < weaponArr.length; i++){
    function displayWeapons(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] === undefined) {
            gridContent[randomRow][randomCol] = weaponArr[i];
        } else {
            displayWeapons();
        }
    };  displayWeapons();
};

////////////////////////////// ADD PLAYERS //////////////////////////////

for (let i = 0; i < playerArr.length; i++){
    function displayplayer(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (randomRow - 1 !== -1 && gridContent[randomRow - 1][randomCol] !== undefined) { // Test if value around player in Grid Array has Obstacle or player and not push
            displayplayer();
        } else if (randomRow + 1 !== gridContent.length && gridContent[randomRow + 1][randomCol] !== undefined) {
            displayplayer();
        } else if (randomCol - 1 !== -1 && gridContent[randomRow][randomCol - 1] !== undefined) {
            displayplayer();
        } else if (randomCol + 1 !== gridContent.length && gridContent[randomRow][randomCol + 1] !== undefined) {
            displayplayer();
        } else if (gridContent[randomRow][randomCol] == undefined){ // Test if the chosen player area is undefined and push in array
            gridContent[randomRow][randomCol] = playerArr[i];
        } else {
            displayplayer();
        }
    } displayplayer();
};

////////////////////////////// DISPLAY GRID, OBSTACLES, WEAPONS, PLAYERS //////////////////////////////

let grid = document.createElement("div");
for(let row = 0; row < gridContent.length; row++) {
    let column = gridContent[row];
    let newRowDiv = document.createElement("div");
      newRowDiv.setAttribute("id", `grid-row-${row}`);
      newRowDiv.setAttribute("class", "grid-row");
    for (let col = 0; col < column.length; col++) {
        let newColDiv = document.createElement("div");
        newColDiv.setAttribute("id", `grid-cell-${row}-${col}`);
        newColDiv.setAttribute("class", "grid-cell");
        newRowDiv.appendChild(newColDiv);
        if (column[col] instanceof Obstacle) {
            $(newColDiv).append(obstacle.img);
        } else if (column[col] instanceof Weapon) {
            if (column[col].name == 'bow') {
                $(newColDiv).append(bow.img);
            } else if (column[col].name == 'axe') {
                $(newColDiv).append(axe.img);
            } else if (column[col].name == 'sword') {
                $(newColDiv).append(sword.img);
            }
        } else if (column[col] instanceof Player) {
            if (column[col].name =='Player1') { 
                player1Position.push.apply(player1Position, [[row][0], [col][0]]); // Put player 1 position in an array
                $(newColDiv).append(player1.img); 
            } else if (column[col].name =='Player2') { 
                player2Position.push.apply(player2Position, [[row][0], [col][0]]); // Put player 2 position in an array
                $(newColDiv).append(player2.img); 
            }
        }
    } 
    $(grid).append(newRowDiv);
}; $('#wrapper').append(grid);

////////////////////////////// FUNCTIONS //////////////////////////////

// Create random Number
function randomNumber(){
    return Math.floor(Math.random() * gridContent.length)
}

/************************************* ETAPE 2 *************************************/

////////////////////////////// MOVES //////////////////////////////

// Directions //
const directions = {
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0]
};

// Init counter //
let counter = 0

// Init first player movement //
movement(player1Position, player1);

// Global function for player movements //
function movement(playerPosition, player) {
    Object.values(directions).forEach(function(directionsArrays) {
        const nextRow = directionsArrays[0] + playerPosition[0]
        const nextCol = directionsArrays[1] + playerPosition[1]
        if (nextRow < 0 || nextRow > gridContent.length - 1 || nextCol < 0 || nextCol > gridContent[0].length || gridContent[nextRow][nextCol] instanceof Obstacle) {
            return;
        } 
        if (gridContent[nextRow][nextCol] === undefined || gridContent[nextRow][nextCol] instanceof Weapon) {
            $(`#grid-cell-${nextRow}-${nextCol}`).addClass("highlight");
            $(`#grid-cell-${nextRow}-${nextCol}`).one( "click", function(){
                if (gridContent[nextRow][nextCol] instanceof Weapon){
                    weaponClicked (nextRow, nextCol, player);
                } 
                move (nextRow, nextCol, player, playerPosition);
                $(".grid-cell").off();
                checkFight();
                const willFight = checkFight()
                if (willFight){
                    return fight(player);
                }
                counter += 1;
                if (counter < moveNumber) {
                    movement(playerPosition, player);   
                } else {
                    counter = 0;
                    return changeTurn(player);
                }
            })
        } 
    });
}

////////////////////////////// FUNCTIONS //////////////////////////////

// What to do when click on a case //
function move (nextRow, nextCol, player, playerPosition){
    $(`#grid-cell-${playerPosition[0]}-${playerPosition[1]}`).empty(); // Enlever l'image du player sur l'ancienne case
    $(`#grid-cell-${nextRow}-${nextCol}`).append(player.img); // Ajouter L'image du player sur la case cliquée
    gridContent[playerPosition[0]][playerPosition[1]] = undefined// Enlever l'instance player de l'ancienne case
    gridContent[nextRow][nextCol] = player
    $("div").removeClass("highlight") // Enlever la classe à la div actuelle   
    leavePreviousWeapon(player, playerPosition);
    playerPosition[0] = nextRow;
    playerPosition[1] = nextCol;
}

// What to do when player click on a weapon //
function weaponClicked (nextRow, nextCol, player){
        player.previousWeapon = player.weapon
        $("#" + player.weaponId + " img").remove();
        player.weapon = gridContent[nextRow][nextCol];
        $(`#grid-cell-${nextRow}-${nextCol}`).empty()
        $("#" + player.weaponId).append(player.weapon.img);
}

// Put previousweapon in previous case //
function leavePreviousWeapon(player, playerPosition){
    if (player.previousWeapon instanceof Weapon) {
        $(`#grid-cell-${playerPosition[0]}-${playerPosition[1]}`).append(player.previousWeapon.img)
        gridContent[playerPosition[0]][playerPosition[1]] = player.previousWeapon
        player.previousWeapon = '';
    }
}

// Change player turn//
function changeTurn(player) {
    if (player === player1){
        movement(player2Position, player2);
    } else if (player === player2) {
        movement(player1Position, player1);
    }
}

// Check if there is a fight //
function checkFight () {
    let rowDif = Math.abs(player1Position[0] - player2Position[0]);
    let colDif = Math.abs(player1Position[1] - player2Position[1]);
    if (rowDif + colDif === 1) {
        return true;
    } return false;
}

/************************************* ETAPE 3 *************************************/

////////////////////////////// FIGHT //////////////////////////////

// General fight function //
function fight(player){
    $("#fightContainer").append("<div class='block'> <h3>Let's Fight</h3> <div class='fightBlock'> <p class='playerTurn'></p> </div> <div class='fightBlock'> <button class='attack fightBtn' type='button'>Attack</button> <button class='defend fightBtn' type='button'>Defend</button> </div> <div class='fightDescription' id='comments'> <p class='playerLife' id='player1Life'>" + player1.name + " : " + player1.life + " life points</p><p class='playerLife' id='player2Life'>" + player2.name + " : " + player2.life + " life points</p></div> </div>");
    if (player === player1) {
        $(".playerTurn").append(player.name + " turn : ");
        $(".attack").click(function(){
            attack(player, player2)
        });
        $(".defend").click(function(){
            defend(player);
        });
    } else if (player === player2) {
        $(".playerTurn").append(player.name + " turn : ");
        $(".attack").click(function(){
            attack(player, player1)
        });
        $(".defend").click(function(){
            defend(player);
        });    
    }
}

// Attack function //
function attack(mainPlayer, otherPlayer){
    $(".fightDescription").append("<p>" + mainPlayer.name + " choose to attack " + otherPlayer.name + "</p>");
    console.log(otherPlayer.life - mainPlayer.weapon.damage)
    $(".fightDescription").append("<p> " + mainPlayer.name + " do " + (mainPlayer.weapon.damage) + " damages to Player2</p>");
    $(".fightDescription").append("<p> Player2 has now " + (otherPlayer.life - mainPlayer.weapon.damage) + " life points</p>");
    otherPlayer.life = otherPlayer.life - mainPlayer.weapon.damage
    $("#player2Life").empty();
    $("#player2Life").append(otherPlayer.name + " : " + otherPlayer.life + " life points");
}

// Defend function //
function defend(mainPlayer){
    $(".fightDescription").append("<p>" + mainPlayer.name + " choose to defend himself for next round</p>");

}

// REGLER LE BUG DU J1 DERNIER CLIQUE POUR FIGHT FAIT BOUGER J2
// REGLER LE PB DE GRILLE DESTRUCTUREE LORSQU'ON REDUIT LA PAGE
// FAIRE QUE LES OBSTACLES NE PEUVENT PAS SPAWNER EN DIAGONALE !!!
// AJOUTER DIV AVEC JS PLUTOT QUE CREER HTML DIRECT ARMES - IDEM POINTS
// AJOUTER BOUTON POUR DIRE STOP JE NE FAIS QUE UN, OU DEUX PAS OU TROIS
// REGLER PB DARME, ELLE DOIT TOMBER SUR LA CASE RECUEILLI
// LE RESPONSIVE