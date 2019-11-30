"use strict";

import Map from './map.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Player from './character.js'

/************************************* ETAPE 1 : GENERATE MAP *************************************/

////////////////////////////// INSTANCES //////////////////////////////
const gameMap = new Map ();

const obstacle = new Obstacle();

const dagger = new Weapon("dagger", 10);
const mace = new Weapon("mace", 14);
const axe = new Weapon("axe", 20);
const sword = new Weapon("sword", 24);

const noctua = new Player("Noctua", 100, dagger);
const marcus = new Player("Marcus", 100, dagger);

////////////////////////////// IMAGES //////////////////////////////
const obstacleImage = "<img class='obstacleImg' src='assets/img/obstacle.svg'/>";

const daggerImage = "<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>";
const maceImage = "<img class='weaponImg' id='maceImg' src='assets/img/mace.svg'/>";
const axeImage = "<img class='weaponImg' id='axeImg' src='assets/img/axe.svg'/>";
const swordImage = "<img class='weaponImg' id='swordImg' src='assets/img/sword.svg'/>";
const weaponImages = { daggerImage, maceImage, axeImage, swordImage }

const NoctuaImage = "<img class='playerImg' id ='noctuaImg' src='assets/img/perso1.svg'/>";
const MarcusImage = "<img class='playerImg' id ='marcusImg' src='assets/img/perso2.svg'/>";
const playerImages = { NoctuaImage, MarcusImage }

////////////////////////////// DISPLAY GAME INFORMATION//////////////////////////////

// Weapons informations
$("#daggerName").append(dagger.name);
$("#daggerInfo").append(dagger.damage + " points<br>", daggerImage);
$("#maceName").append(mace.name);
$("#maceInfo").append(mace.damage + " points<br>", maceImage) ;
$("#axeName").append(axe.name);
$("#axeInfo").append(axe.damage + " points<br>", axeImage);
$("#swordName").append(sword.name);
$("#swordInfo").append(sword.damage + " points<br>", swordImage);

// Players Informations
$("#" + noctua.name).append(daggerImage);
$("#noctuaTitle").append(noctua.name + "<br><br>", NoctuaImage); 
$("#" + marcus.name).append(daggerImage);
$("#marcusTitle").append(marcus.name + "<br><br>", MarcusImage); 

////////////////////////////// CREATE MAP ARRAY //////////////////////////////
const gridContent = gameMap.createArray(10,10);

////////////////////////////// CHANGE VALUES //////////////////////////////
const obstacleNumber = 10; // Choose the number of obstacles in the grid //
const moveNumber = 3; // Choose the number of moves a player can do //

////////////////////////////// ARRAYS //////////////////////////////
// Players positions on grid //
let noctuaPosition = [];
let marcusPosition = [];

const obstacleArr = []; // Obstacles array//
for (let i = 0; i < obstacleNumber; i++) {
    obstacleArr.push(obstacle);
};  

const weaponArr = []; // Weapons array//
weaponArr.push.apply(weaponArr, [mace, axe, sword]);

const playerArr = []; // Players array//
playerArr.push.apply(playerArr, [noctua, marcus]); 

////////////////////////////// CREATE A RANDOM NUMBER //////////////////////////////
function randomNumber(){
    return Math.floor(Math.random() * gridContent.length)
}

////////////////////////////// ADD OBSTACLES IN GRIDCONTENT ARRAY //////////////////////////////
for (let i = 0; i < obstacleArr.length; i++){
    function addObstacles(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] == undefined) {
            gridContent[randomRow][randomCol] = obstacleArr[i];
        } else {
            addObstacles();
        }
    };  addObstacles()
};

////////////////////////////// ADD WEAPONS IN GRIDCONTENT ARRAY //////////////////////////////
for (let i = 0; i < weaponArr.length; i++){
    function addWeapons(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] === undefined) {
            gridContent[randomRow][randomCol] = weaponArr[i];
        } else {
            addWeapons();
        }
    };  addWeapons();
};

////////////////////////////// ADD PLAYERS IN GRIDCONTENT ARRAY  //////////////////////////////
for (let i = 0; i < playerArr.length; i++){
    function addPlayer(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (randomRow - 1 !== -1 && gridContent[randomRow - 1][randomCol] !== undefined) { // Test if value around player in Grid Array has obstacle or player //
            addPlayer();
        } else if (randomRow + 1 !== gridContent.length && gridContent[randomRow + 1][randomCol] !== undefined) {
            addPlayer();
        } else if (randomCol - 1 !== -1 && gridContent[randomRow][randomCol - 1] !== undefined) {
            addPlayer();
        } else if (randomCol + 1 !== gridContent.length && gridContent[randomRow][randomCol + 1] !== undefined) {
            addPlayer();
        } else if (gridContent[randomRow][randomCol] == undefined){ // Test if the chosen player area is undefined and push in array if so//
            gridContent[randomRow][randomCol] = playerArr[i];
        } else {
            addPlayer();
        }
    } addPlayer();
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
            $(newColDiv).append(obstacleImage);
        } else if (column[col] instanceof Weapon) {
            if (column[col].name == 'mace') {
                $(newColDiv).append(maceImage);
            } else if (column[col].name == 'axe') {
                $(newColDiv).append(axeImage);
            } else if (column[col].name == 'sword') {
                $(newColDiv).append(swordImage);
            }
        } else if (column[col] instanceof Player) {
            if (column[col].name =='Noctua') { 
                noctuaPosition.push.apply(noctuaPosition, [[row][0], [col][0]]); // Put player 1 position in an array
                $(newColDiv).append(NoctuaImage); 
            } else if (column[col].name =='Marcus') { 
                marcusPosition.push.apply(marcusPosition, [[row][0], [col][0]]); // Put player 2 position in an array
                $(newColDiv).append(MarcusImage); 
            }
        }
    } 
    $(grid).append(newRowDiv);
}; $('#wrapper').append(grid);

/************************************* ETAPE 2 : LES MOUVEMENTS *************************************/

////////////////////////////// MOVES //////////////////////////////
// Directions around player in grid//
const directions = {
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0]
};

// Variables and arrays //
let movementCounter = 0 // Count number of moves per turn

let NoctuaPreviousWeapon = []; // Store where (col and row) to leave previous weapon
let NoctuaWeaponCounter = 0 // If counter = 2, leave behind the previous weapon thanks to stored datas

let MarcusPreviousWeapon = []; // Store where (col and row) to leave previous weapon
let MarcusWeaponCounter = 0 // If counter = 2, leave behind the previous weapon thanks to stored datas


// Initialize first player playerTurn //
playerTurn(noctuaPosition, noctua, marcus);

// Global function for player turns //
function playerTurn(playerPosition, mainPlayer, otherPlayer) {
    // Stop turn button
    $(".stopTurnContainer").empty();
    $(".stopTurnContainer").append("<div class='block'><h3>Stop your turn</h3><button class='stopTurnBtn'>Stop here</button></div>");
    $(".stopTurnBtn").click(function(){
        $(".stopTurnContainer").empty();
        $(".grid-cell").off();
        $(".grid-cell").removeClass("highlight");
        movementCounter = 0;
        changeTurn(mainPlayer, otherPlayer);
    });
    // Movements
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
                    weaponClicked (nextRow, nextCol, mainPlayer, playerPosition);
                }
                move (nextRow, nextCol, mainPlayer, playerPosition);
                $(".grid-cell").off();
                checkFight();
                const willFight = checkFight()
                if (willFight){
                    $(".stopTurnContainer").empty();
                    return initFight(mainPlayer, otherPlayer);
                }
                movementCounter++;
                if (movementCounter < moveNumber ) {
                    playerTurn(playerPosition, mainPlayer, otherPlayer);   
                } else {
                    movementCounter = 0;
                    return changeTurn(mainPlayer, otherPlayer);
                }
            })
        } 
    });
}

////////////////////////////// FUNCTIONS //////////////////////////////

// Change player turn//
function changeTurn(mainPlayer, otherPlayer) {
    if (mainPlayer == noctua){
        playerTurn(marcusPosition, otherPlayer, mainPlayer);
    } else if (mainPlayer == marcus) {
        playerTurn(noctuaPosition, otherPlayer, mainPlayer);
    }
}

// What to do when player click on a weapon //
function weaponClicked (nextRow, nextCol, mainPlayer){
    mainPlayer.previousWeapon = mainPlayer.weapon
    $("#" + mainPlayer.name + " img").remove();
    mainPlayer.weapon = gridContent[nextRow][nextCol];
    $(`#grid-cell-${nextRow}-${nextCol}`).empty()
    $("#" + mainPlayer.name).append(weaponImages[mainPlayer.weapon.name + "Image"]); 
    if (mainPlayer === noctua){
        NoctuaWeaponCounter = 1
        NoctuaPreviousWeapon[0] = nextRow
        NoctuaPreviousWeapon[1] = nextCol
    } else if (mainPlayer === marcus){
        MarcusWeaponCounter = 1
        MarcusPreviousWeapon[0] = nextRow
        MarcusPreviousWeapon[1] = nextCol
    }
}

// movement function //
function move (nextRow, nextCol, mainPlayer, playerPosition){
    $(`#grid-cell-${playerPosition[0]}-${playerPosition[1]}`).empty(); // Enlever l'image du player sur l'ancienne case
    $(`#grid-cell-${nextRow}-${nextCol}`).append(playerImages[mainPlayer.name + "Image"]); // Ajouter L'image du player sur la case cliquée
    gridContent[playerPosition[0]][playerPosition[1]] = undefined// Enlever l'instance player de l'ancienne case
    gridContent[nextRow][nextCol] = mainPlayer
    $("div").removeClass("highlight") // Enlever la classe à la div actuelle   
    leavePreviousWeapon(mainPlayer);
    playerPosition[0] = nextRow;
    playerPosition[1] = nextCol;
}

// leave previous weapon in the right case //
function leavePreviousWeapon(mainPlayer){
    if (mainPlayer == noctua && NoctuaWeaponCounter === 1){
        NoctuaWeaponCounter = NoctuaWeaponCounter + 1
    } else if (mainPlayer == noctua && NoctuaWeaponCounter === 2){
        gridContent[NoctuaPreviousWeapon[0]][NoctuaPreviousWeapon[1]] = mainPlayer.previousWeapon;
        $(`#grid-cell-${NoctuaPreviousWeapon[0]}-${NoctuaPreviousWeapon[1]}`).append(weaponImages[mainPlayer.previousWeapon.name + "Image"]);
        NoctuaWeaponCounter = 0;
    } 
    if (mainPlayer == marcus && MarcusWeaponCounter === 1){
        MarcusWeaponCounter = MarcusWeaponCounter + 1
    } else if (mainPlayer == marcus && MarcusWeaponCounter === 2){
        gridContent[MarcusPreviousWeapon[0]][MarcusPreviousWeapon[1]] = mainPlayer.previousWeapon;
        $(`#grid-cell-${MarcusPreviousWeapon[0]}-${MarcusPreviousWeapon[1]}`).append(weaponImages[mainPlayer.previousWeapon.name + "Image"]);
        MarcusWeaponCounter = 0;
    }
}

// Check if there is a fight //
function checkFight () {
    let rowDif = Math.abs(noctuaPosition[0] - marcusPosition[0]);
    let colDif = Math.abs(noctuaPosition[1] - marcusPosition[1]);
    if (rowDif + colDif === 1) {
        return true;
    } return false;
}

/************************************* STEP 3 : FIGHT *************************************/

////////////////////////////// FIGHT //////////////////////////////
// Variable //
let defense = false;

// Display fight container and call fight function //
function initFight(mainPlayer, otherPlayer){
    $(".stopTurnContainer").empty();
    $("#fightContainer").append("<div class='block'><h3>Let's Fight</h3><div class='fightBlock'><p class='playerTurn'></p></div><div class='fightBlock'><button class='attack fightBtn' type='button'>Attack</button><button class='defend fightBtn' type='button'>Defend</button></div><div class='playerLifeContainer'><p class='playerLife' id='NoctuaLife'>" + noctua.name + " : " + noctua.life + " life points</p><p class='playerLife' id='MarcusLife'>" + marcus.name + " : " + marcus.life + " life points</p></div><div class='fightDescription' id='comments'></div> </div>");
    fight(mainPlayer, otherPlayer)
}

// Fight function //
function fight(mainPlayer, otherPlayer){
        $(".playerTurn").empty()
        $(".playerTurn").append("<div class='" + mainPlayer.name + "Turn'>" + mainPlayer.name + "' turn : </div>");
        // Attack button //
        $(".attack").click(function(){
            $(".fightDescription").empty();
            if (defense == true){
                displayAttack (2, mainPlayer, otherPlayer);
                if (otherPlayer.life <= 0 || mainPlayer.life <= 0){
                    return displayEndFight (mainPlayer, otherPlayer);
                } else if (otherPlayer.life > 0){
                    defense = false
                }
            } else if (defense == false){
                displayAttack (1, mainPlayer, otherPlayer)
                if (otherPlayer.life <= 0 || mainPlayer.life <= 0){
                    return displayEndFight (mainPlayer, otherPlayer)
                }
            }
            $(".attack").off();
            $(".defend").off();
            if (otherPlayer.life > 0 || mainPlayer.life > 0){
                return changeTurnFight(mainPlayer, otherPlayer);
            }
        });
        // Defend button //
        $(".defend").click(function(){
            $(".fightDescription").empty();
            $(".fightDescription").append("<p>" + mainPlayer.name + " choose to defend himself for next round</p>");
            defense = true
            $(".attack").off();
            $(".defend").off();
            return changeTurnFight(mainPlayer, otherPlayer);
        });
}

// Change player turn during fight
function changeTurnFight(mainPlayer, otherPlayer) {
    if (mainPlayer == noctua){
        fight(marcus, noctua);
    } else if (otherPlayer == noctua) {
        fight(noctua, marcus);
    }
}

// Attack function
function displayAttack (divisionNumber, mainPlayer, otherPlayer){
    otherPlayer.life = otherPlayer.life - (mainPlayer.weapon.damage/divisionNumber)
    $("#"+otherPlayer.name+"Life").empty();
    $("#"+otherPlayer.name+"Life").append(otherPlayer.name + " : " + otherPlayer.life + " life points");
    $(".fightDescription").append("<p> " + mainPlayer.name + " does " + (mainPlayer.weapon.damage/divisionNumber) + " damages to "+ otherPlayer.name +"</p>");
    $(".fightDescription").append("<p>" + otherPlayer.name + " has now " + otherPlayer.life + " life points</p>");
}

// End the fight
function displayEndFight (mainPlayer, otherPlayer){
    $(".attack").off();
    $(".defend").off();
    $(".fightDescription").empty();
    $("#"+otherPlayer.name+"Life").empty();
    $("#"+otherPlayer.name+"Life").append(otherPlayer.name + " : " + 0 + " life points");
    $(".fightDescription").append("<p>" + mainPlayer.name + " WIN !</p>")
    $(".fightDescription").append("<button class='retryBtn'> Try again ? </button>")
     return $(".retryBtn").click(function(){
        window.location.reload();
    }); 
}