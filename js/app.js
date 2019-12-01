"use strict";

import Grid from './grid.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Player from './player.js'
import Display from './display.js'
import Config from './config.js'

/************************************* ETAPE 1 : GENERATE MAP *************************************/

////////////////////////////// INSTANCES //////////////////////////////

const dagger = new Weapon("dagger", 10);
const mace = new Weapon("mace", 14);
const axe = new Weapon("axe", 20);
const sword = new Weapon("sword", 24);

const noctua = new Player("Noctua", 100, dagger);
const marcus = new Player("Marcus", 100, dagger);

////////////////////////////// DISPLAY GAME INFORMATION//////////////////////////////

// Weapons informations // TODO METHOD DISPLAYJS
$("#daggerName").append(dagger.name);
$("#daggerInfo").append(dagger.damage + " points<br>", "<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>");
$("#maceName").append(mace.name);
$("#maceInfo").append(mace.damage + " points<br>", "<img class='weaponImg' id='maceImg' src='assets/img/mace.svg'/>") ;
$("#axeName").append(axe.name);
$("#axeInfo").append(axe.damage + " points<br>", "<img class='weaponImg' id='axeImg' src='assets/img/axe.svg'/>");
$("#swordName").append(sword.name);
$("#swordInfo").append(sword.damage + " points<br>", "<img class='weaponImg' id='swordImg' src='assets/img/sword.svg'/>");

// Players Informations //
$("#" + noctua.name).append("<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>");
$("#noctuaTitle").append(noctua.name + "<br><br>", "<img class='playerImg' id='NoctuaImg' src='assets/img/noctua.svg'/>"); 
$("#" + marcus.name).append("<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>");
$("#marcusTitle").append(marcus.name + "<br><br>", "<img class='playerImg' id='MarcusImg' src='assets/img/marcus.svg'/>"); 

////////////////////////////// CREATE MAP ARRAY //////////////////////////////
const rowsNumber = 10; // TODO
const colsNumber = 10; // TODO
const grid = new Grid(rowsNumber, colsNumber); // Utilisation de la methode statique 

////////////////////////////// CHANGE VALUES //////////////////////////////
const obstacleNumber = 10; // Choose the number of obstacles in the grid //
const moveNumber = 3; // Choose the number of moves a player can do //

////////////////////////////// ARRAYS //////////////////////////////

const obstacleArr = []; // Obstacles array//
for (let i = 0; i < obstacleNumber; i++) {
    obstacleArr.push(new Obstacle());
};  

const weaponArr = []; // Weapons array//
weaponArr.push(mace, axe, sword);

const playerArr = []; // Players array//
playerArr.push(noctua, marcus); 

////////////////////////////// ADD ELEMENTS TO GRID //////////////////////////////
for (let i = 0; i < obstacleArr.length; i++){
    grid.addElement(obstacleArr[i]);
};

for (let i = 0; i < weaponArr.length; i++){
    grid.addElement(weaponArr[i]);
};

for (let i = 0; i < playerArr.length; i++){
    grid.addElement(playerArr[i])
};

////////////////////////////// DISPLAY GRID, OBSTACLES, WEAPONS, PLAYERS //////////////////////////////
const gridDiv = document.createElement("div"); // TODO DISPLAYJS
for(let row = 0; row < rowsNumber; row++) {
    let newRowDiv = document.createElement("div");
      newRowDiv.setAttribute("id", `grid-row-${row}`);
      newRowDiv.setAttribute("class", "grid-row");

    for (let col = 0; col < colsNumber; col++) {
        let newColDiv = document.createElement("div");
        newColDiv.setAttribute("id", `grid-cell-${row}-${col}`);
        newColDiv.setAttribute("class", "grid-cell");
        newRowDiv.appendChild(newColDiv);

        if (grid.getElement(row, col) instanceof Obstacle) {
            $(newColDiv).append("<img class='obstacleImg' src='assets/img/obstacle.svg'/>");
        } else if (grid.getElement(row, col) instanceof Weapon) {
            const weaponName = grid.getElement(row, col).name;
                $(newColDiv).append("<img class='weaponImg' id='" + weaponName + "Img' src='assets/img/" + weaponName + ".svg'/>");
        } else if (grid.getElement(row, col) instanceof Player) {
            const playerName = grid.getElement(row, col).name;
            $(newColDiv).append("<img class='playerImg' id='" + playerName + "Img' src='assets/img/" + playerName + ".svg'/>"); 
            grid.getElement(row, col).position = [row, col]; 
        }
    }
    $(gridDiv).append(newRowDiv);
}; $('#wrapper').append(gridDiv);

/************************************* ETAPE 2 : LES MOUVEMENTS *************************************/

////////////////////////////// MOVES //////////////////////////////

// Variables and arrays //
let movementCounter = 0 // Count number of moves per turn

// Initialize first player playerTurn //
playerTurn(noctua.position, noctua, marcus);

// Global function for player turns //
function playerTurn(playerPosition, mainPlayer, secondPlayer) {
    // Stop turn button
    $(".stopTurnContainer").empty();
    $(".stopTurnContainer").append("<div class='block'><h3>Stop your turn</h3><button class='stopTurnBtn'>Stop here</button></div>");
    $(".stopTurnBtn").click(function(){
        $(".stopTurnContainer").empty();
        $(".grid-cell").off();
        $(".grid-cell").removeClass("highlight");
        movementCounter = 0;
        changeTurn(mainPlayer, secondPlayer);
    });
    // Movements
    Object.values(Grid.directions).forEach(function(directionsArrays) {
        const nextRow = directionsArrays[0] + playerPosition[0]
        const nextCol = directionsArrays[1] + playerPosition[1]

        if (nextRow < 0 || nextRow > rowsNumber - 1 || nextCol < 0 || nextCol > colsNumber || grid.getElement(nextRow, nextCol) instanceof Obstacle) {
            return;
        } 
        if (grid.getElement(nextRow, nextCol) === undefined || grid.getElement(nextRow, nextCol) instanceof Weapon) {
            $(`#grid-cell-${nextRow}-${nextCol}`).addClass("highlight");
            $(`#grid-cell-${nextRow}-${nextCol}`).one( "click", function(){

                if (grid.getElement(nextRow, nextCol) instanceof Weapon){
                    weaponClicked (nextRow, nextCol, mainPlayer, playerPosition);
                }
                move (nextRow, nextCol, mainPlayer);
                leavePreviousWeapon(mainPlayer);
                $(".grid-cell").off();
                checkFight();

                const willFight = checkFight();

                if (willFight){
                    $(".stopTurnContainer").empty();
                    return initFight(mainPlayer, secondPlayer);
                }
                movementCounter++;

                if (movementCounter < moveNumber ) {
                    playerTurn(playerPosition, mainPlayer, secondPlayer);   
                } else {
                    movementCounter = 0;
                    return changeTurn(mainPlayer, secondPlayer);
                }
            })
        } 
    });
}

////////////////////////////// FUNCTIONS //////////////////////////////

// Change player turn//
function changeTurn(mainPlayer, secondPlayer) {
    if (mainPlayer == noctua){
        playerTurn(marcus.position, secondPlayer, mainPlayer);
    } else if (mainPlayer == marcus) {
        playerTurn(noctua.position, secondPlayer, mainPlayer);
    }
}

// What to do when player click on a weapon //
function weaponClicked (nextRow, nextCol, mainPlayer){
    mainPlayer.previousWeapon = mainPlayer.weapon
    $("#" + mainPlayer.name + " img").remove();
    mainPlayer.weapon = grid.getElement(nextRow, nextCol);
    $(`#grid-cell-${nextRow}-${nextCol}`).empty()
    $("#" + mainPlayer.name).append("<img class='weaponImg' id='" + mainPlayer.weapon.name + "Img' src='assets/img/" + mainPlayer.weapon.name + ".svg'/>"); 
        mainPlayer.weaponCounter = 1
        mainPlayer.previousWeaponPosition[0] = nextRow
        mainPlayer.previousWeaponPosition[1] = nextCol
}

// movement function //
function move (nextRow, nextCol, player){
    grid.moveElement(player.position[0], player.position[1], nextRow, nextCol);
    player.move(nextRow, nextCol);
    Display.moveDisplay(player);
}

// leave previous weapon in the right case //
function leavePreviousWeapon(mainPlayer){
    if (mainPlayer.weaponCounter === 1){
        mainPlayer.weaponCounter = mainPlayer.weaponCounter + 1
    } else if (mainPlayer.weaponCounter === 2){
        grid.setElement(mainPlayer.previousWeaponPosition[0], mainPlayer.previousWeaponPosition[1], mainPlayer.previousWeapon);
        $(`#grid-cell-${mainPlayer.previousWeaponPosition[0]}-${mainPlayer.previousWeaponPosition[1]}`).append("<img class='weaponImg' id='" + mainPlayer.previousWeapon.name + "Img' src='assets/img/" + mainPlayer.previousWeapon.name + ".svg'/>");
        mainPlayer.weaponCounter = 0;
    }
}

// Check if there is a fight //
function checkFight () {
    let rowDif = Math.abs(noctua.position[0] - marcus.position[0]);
    let colDif = Math.abs(noctua.position[1] - marcus.position[1]);
    if (rowDif + colDif === 1) {
        return true;
    } return false;
}

/************************************* STEP 3 : FIGHT *************************************/

////////////////////////////// FIGHT //////////////////////////////
// Variable //
let defense = false;

// Display fight container and call fight function //
function initFight(mainPlayer, secondPlayer){
    $(".stopTurnContainer").empty();
    $("#fightContainer").append("<div class='block'><h3>Let's Fight</h3><div class='fightBlock'><p class='playerTurn'></p></div><div class='fightBlock'><button class='attack fightBtn' type='button'>Attack</button><button class='defend fightBtn' type='button'>Defend</button></div><div class='playerLifeContainer'><p class='playerLife' id='NoctuaLife'>" + noctua.name + " : " + noctua.life + " life points</p><p class='playerLife' id='MarcusLife'>" + marcus.name + " : " + marcus.life + " life points</p></div><div class='fightDescription' id='comments'></div> </div>");
    fight(mainPlayer, secondPlayer)
}

// Fight function //
function fight(mainPlayer, secondPlayer){
        $(".playerTurn").empty()
        $(".playerTurn").append("<div class='" + mainPlayer.name + "Turn'>" + mainPlayer.name + "' turn : </div>");
        // Attack button //
        $(".attack").click(function(){
            $(".fightDescription").empty();
            if (defense == true){
                displayAttack (2, mainPlayer, secondPlayer);
                if (secondPlayer.life <= 0 || mainPlayer.life <= 0){
                    return displayEndFight (mainPlayer, secondPlayer);
                } else if (secondPlayer.life > 0){
                    defense = false
                }
            } else if (defense == false){
                displayAttack (1, mainPlayer, secondPlayer)
                if (secondPlayer.life <= 0 || mainPlayer.life <= 0){
                    return displayEndFight (mainPlayer, secondPlayer)
                }
            }
            $(".attack").off();
            $(".defend").off();
            if (secondPlayer.life > 0 || mainPlayer.life > 0){
                return changeTurnFight(mainPlayer, secondPlayer);
            }
        });
        // Defend button //
        $(".defend").click(function(){
            $(".fightDescription").empty();
            $(".fightDescription").append("<p>" + mainPlayer.name + " choose to defend himself for next round</p>");
            defense = true
            $(".attack").off();
            $(".defend").off();
            return changeTurnFight(mainPlayer, secondPlayer);
        });
}

// Change player turn during fight
function changeTurnFight(mainPlayer, secondPlayer) {
    if (mainPlayer == noctua){
        fight(marcus, noctua);
    } else if (secondPlayer == noctua) {
        fight(noctua, marcus);
    }
}

// Attack function
function displayAttack (divisionNumber, mainPlayer, secondPlayer){
    secondPlayer.life = secondPlayer.life - (mainPlayer.weapon.damage/divisionNumber)
    $("#"+secondPlayer.name+"Life").empty();
    $("#"+secondPlayer.name+"Life").append(secondPlayer.name + " : " + secondPlayer.life + " life points");
    $(".fightDescription").append("<p> " + mainPlayer.name + " does " + (mainPlayer.weapon.damage/divisionNumber) + " damages to "+ secondPlayer.name +"</p>");
    $(".fightDescription").append("<p>" + secondPlayer.name + " has now " + secondPlayer.life + " life points</p>");
}

// End the fight
function displayEndFight (mainPlayer, secondPlayer){
    $(".attack").off();
    $(".defend").off();
    $(".fightDescription").empty();
    $("#"+secondPlayer.name+"Life").empty();
    $("#"+secondPlayer.name+"Life").append(secondPlayer.name + " : " + 0 + " life points");
    $(".fightDescription").append("<p>" + mainPlayer.name + " WIN !</p>")
    $(".fightDescription").append("<button class='retryBtn'> Try again ? </button>")
     return $(".retryBtn").click(function(){
        window.location.reload();
    }); 
}