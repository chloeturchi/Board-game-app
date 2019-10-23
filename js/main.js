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

const player1 = new Player("Combattant 1", 100, dagger, "<img class='playerImg' id ='player1Img' src='assets/img/perso1.svg'/>");
const player2 = new Player("Combattant 2", 100, dagger, "<img class='playerImg' id ='player2Img' src='assets/img/perso2.svg'/>");

////////////////////////////// VARIABLES & ARRAYS //////////////////////////////
// Obstacles
const obstacleNumber = 8; // Choose the number of obstacles you want 
const obstacleArr = [];
for (let i = 0; i < obstacleNumber; i++) { // Put Obstacles in an array
    obstacleArr.push(obstacle);
};  

// Weapons
const weaponArr = [];
weaponArr.push.apply(weaponArr, [bow, axe, sword]); // Put Weaponsin an array

// players
const playerArr = [];
playerArr.push.apply(playerArr, [player1, player2]); // Put players in an array

// Get players positions on grid
let player1Position = [];
let player2Position = [];

////////////////////////////// ADD OBSTACLES, WEAPONS, player IN A GLOBAL ARRAY AND DISPLAY //////////////////////////////
// Obstacles
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

////////////////////////////// WEAPONS //////////////////////////////
// Weapons
for (let i = 0; i < weaponArr.length; i++){
    function displayWeapons(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        if (gridContent[randomRow][randomCol] == undefined) {
            gridContent[randomRow][randomCol] = weaponArr[i];
        } else {
            displayWeapons();
        }
    };  displayWeapons();
};

////////////////////////////// playerS //////////////////////////////
// players
for (let i = 0; i < playerArr.length; i++){
    function displayplayer(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        // Test if value around player in Grid Array has Obstacle or player and not push
        if (randomRow - 1 !== -1 && gridContent[randomRow - 1][randomCol] !== undefined) {
            displayplayer();
        } else if (randomRow + 1 !== gridContent.length && gridContent[randomRow + 1][randomCol] !== undefined) {
            displayplayer();
        } else if (randomCol - 1 !== -1 && gridContent[randomRow][randomCol - 1] !== undefined) {
            displayplayer();
        } else if (randomCol + 1 !== gridContent.length && gridContent[randomRow][randomCol + 1] !== undefined) {
            displayplayer();
        // Test if the chosen player area is undefined and push in array
        } else if (gridContent[randomRow][randomCol] == undefined){
            gridContent[randomRow][randomCol] = playerArr[i];
        } else {
            displayplayer();
        }
    } displayplayer();
};

////////////////////////////// DISPLAY GRID //////////////////////////////
// DISPLAY OBSTACLES, WEAPONS, playerS
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
        // Display obstacles
        if (column[col] instanceof Obstacle) {
            $(newColDiv).append(obstacle.img);
        // Display weapons
        } else if (column[col] instanceof Weapon) {
            if (column[col].name == 'bow') {
                $(newColDiv).append(bow.img);
            } else if (column[col].name == 'axe') {
                $(newColDiv).append(axe.img);
            } else if (column[col].name == 'sword') {
                $(newColDiv).append(sword.img);
            }
        // Display players
        } else if (column[col] instanceof Player) {
            if (column[col].name =='Combattant 1') { 
                player1Position.push.apply(player1Position, [[row][0], [col][0]]); // Put player 1 position in an array
                $(newColDiv).append(player1.img); 
            } else if (column[col].name =='Combattant 2') { 
                player2Position.push.apply(player2Position, [[row][0], [col][0]]); // Put player 2 position in an array
                $(newColDiv).append(player2.img); 
            }
        }
    } 
    $(grid).append(newRowDiv);
}; 
$('#wrapper').append(grid);

/************************************* ETAPE 2 *************************************/

////////////////////////////// MOVES //////////////////////////////

let previousWeapon = [];

if (gridContent[player1Position[0]][player1Position[1] + 1] === undefined ){
    let nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
    let previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
    $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
    $(nextDiv).click(function(){
        gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
        $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
        gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
        $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
        $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
        player1Position[1] = player1Position[1] + 1

        if (gridContent[player1Position[0]][player1Position[1] + 1] === undefined ){
            nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
            previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
            $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
            $(nextDiv).click(function(){
                gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
                $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
                gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
                $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
                $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
                player1Position[1] = player1Position[1] + 1
                nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`

                if (gridContent[player1Position[0]][player1Position[1] + 1] === undefined ){
                    nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                    previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
                    $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
                    $(nextDiv).click(function(){
                        gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
                        $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
                        gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
                        $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
                        $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
                        player1Position[1] = player1Position[1] + 1
                        nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                        previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
                    });
                } else if (gridContent[player1Position[0]][player1Position[1] + 1] instanceof Weapon ) {
                    nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                    previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
                    $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
                    $(nextDiv).click(function(){
                        previousWeapon.push(player1.weapon);
                        player1.weapon = gridContent[player1Position[0]][player1Position[1] + 1] // Donner l'arme de la case au joueur
                        console.log(gridContent);
                        console.log(previousWeapon);

                        $(nextDiv).empty(); // Enlever l'image du weapon sur l'ancienne case
                        gridContent[player1Position[0]][player1Position[1] + 1] = undefined
                        gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
                        $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
                        gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
                        $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
                        $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
                        player1Position[1] = player1Position[1] + 1
                        nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                        previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
                    });
                }
            });
        } else if (gridContent[player1Position[0]][player1Position[1] + 1] instanceof Weapon ) {
            nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
            previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
            $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
            $(nextDiv).click(function(){
                previousWeapon.push(player1.weapon);
                player1.weapon = gridContent[player1Position[0]][player1Position[1] + 1] // Donner l'arme de la case au joueur
                console.log(gridContent);
                console.log(previousWeapon);

                $(nextDiv).empty(); // Enlever l'image du weapon sur l'ancienne case
                gridContent[player1Position[0]][player1Position[1] + 1] = undefined
                gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
                $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
                gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
                $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
                $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
                player1Position[1] = player1Position[1] + 1
                nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
                previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
            });
        }
    });
} else if (gridContent[player1Position[0]][player1Position[1] + 1] instanceof Weapon) {
    nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
    previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
    $(nextDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
    $(nextDiv).click(function(){
        previousWeapon.push(player1.weapon);
        player1.weapon = gridContent[player1Position[0]][player1Position[1] + 1] // Donner l'arme de la case au joueur
        console.log(gridContent);
        console.log(previousWeapon);

        $(nextDiv).empty(); // Enlever l'image du weapon sur l'ancienne case
        gridContent[player1Position[0]][player1Position[1] + 1] = undefined
        gridContent[player1Position[0]][player1Position[1] + 1] = player1; // Ajout de l'instance player à la case cliquée
        $(nextDiv).append(player1.img); // Ajouter L'image du player sur la case cliquée
        gridContent[player1Position[0]][player1Position[1]] = undefined// Enlever l'instance player de l'ancienne case
        $(previousDiv).empty(); // Enlever l'image du player sur l'ancienne case
        $(nextDiv).removeClass("highlight") // Enlever la classe à la div actuelle
        player1Position[1] = player1Position[1] + 1
        nextDiv = `#grid-cell-${player1Position[0]}-${player1Position[1] + 1}`
        previousDiv = `#grid-cell-${player1Position[0]}-${player1Position[1]}`
    });
}

console.log(gridContent);

////////////////////////////// DISPLAYED INFORMATION GAME //////////////////////////////
$(".turn").text("-");
$("#weapon-player1").append(dagger.img);
$("#weapon-player2").append(dagger.img);

////////////////////////////// FUNCTIONS & LOGS //////////////////////////////
// Create random Number
function randomNumber(){
    return Math.floor(Math.random() * gridContent.length)
}

/*
// What to do when click on a weapon
function weaponOnClick(mainDiv, imgToRemove, row, col, actualPlayer, initialRowPosition, initialColPosition, weaponType) {
    $(mainDiv).addClass("highlight");

    $(mainDiv).click(function(){
        gridContent[initialRowPosition][initialColPosition] = undefined;
        gridContent[row][col] = actualPlayer;
        $(imgToRemove).remove(); 
        $('div').removeClass('highlight');

        if (actualPlayer == player1){
            $('img#player1Img').remove();
            player.weapon = weaponType;
            $("#weapon-player1").append(player1.weapon.img);
            $(mainDiv).append(player1.img);
            player1Position[0] = row;
            player1Position[1] = col;
            console.log(player1Position);
            console.log(gridContent);
            move (player2Position[0], player2Position[1], player2);
    
        } else if (actualPlayer == player2){
            $('img#player2Img').remove();
            $("#weapon-player2").append(player2.weapon.img);
            $(mainDiv).append(player2.img);
            player2Position[0] = row;
            player2Position[1] = col;
            console.log(player2Position);
            console.log(gridContent);
            move (player1Position[0], player1Position[1], player1);  
        }
    })
};

// What to do when click on an undefined 
function undefinedOnClick (mainDiv, row, col, actualPlayer, initialRowPosition, initialColPosition) {
    $(mainDiv).addClass("highlight");
    $(mainDiv).click(function(){
        gridContent[row][col] = actualPlayer;
        gridContent[initialRowPosition][initialColPosition] = undefined;
        $('div').removeClass('highlight');

        if (actualPlayer == player1){
            $('img#player1Img').remove();
            $(mainDiv).append(player1.img);
            player1Position[0] = row;
            player1Position[1] = col;
            move (player2Position[0], player2Position[1], player2);
        
        } else if (actualPlayer == player2){
            $('img#player2Img').remove();
            $(mainDiv).append(player2.img);
            player2Position[0] = row;
            player2Position[1] = col;
            move (player1Position[0], player1Position[1], player1);  
        }
        //checkForFight();
    })
};

        //let rightCol = initialCol + 1 // Right       
        //let leftCol = initialCol - 1 // Left
        //let upRow = initialRow - 1 // Up
        //let downRow = initialRow + 1 // Down

        if (rightCol < gridContent.length) {

        }
        if (leftCol > -1){

        }
        if (upRow > -1){

        }
        if (downRow < gridContent.length){

        }

 // Function one movement
function movement (initialRow, initialCol, newRow, newCol, actualPlayer, playerPosition){
    let actualDiv = `#grid-cell-${newRow}-${newCol}`
    let newDiv = `#grid-cell-${initialRow}-${initialCol}`
    $(actualDiv).addClass("highlight"); // Ajout de la classe Highlight à la case visée
    $(actualDiv).click(function(){ // Lors du clic
        gridContent[newRow][newCol] = actualPlayer; // Ajout de l'instance player à la case cliquée
        gridContent[initialRow][initialCol] = undefined// Enlever l'instance player de l'ancienne case
        $(actualDiv).append(actualPlayer.img); // Ajouter L'image du player sur la case cliquée
        $(newDiv).empty(); // Enlever l'image du player sur l'ancienne case
        $("Div").removeClass("highlight") // Enlever la classe à la div actuelle
        playerPosition[0] = newRow // Set nouvelle position player dans le tableau 
        playerPosition[1] = newCol
        console.log(gridContent);
    }); 
}

//move right
        if (col < gridContent.length) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                } else if (gridContent[row][col].name === 'axe'){
                } else if (gridContent[row][col].name === 'sword'){
                }
            } else 

    // MOVE LEFT
    for (let i = 0; i < 3; i++){
        let row = initialRowPosition 
        let col = initialColPosition - (i + 1)
        if (col > -1) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, actualPlayer, initialRowPosition, initialColPosition, bow);
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col), actualPlayer, initialRowPosition, initialColPosition, axe;
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, actualPlayer, initialRowPosition, initialColPosition, sword);
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, actualPlayer, initialRowPosition, initialColPosition);
            } else {
                break;
            }
        } 
    };

    // MOVE UP
    for (let i = 0; i < 3; i++){
        let row = initialRowPosition - (i + 1)
        let col = initialColPosition 
        if (row > -1) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, actualPlayer, initialRowPosition, initialColPosition, bow);
                    player1.weapon = bow;
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col, actualPlayer, initialRowPosition, initialColPosition, axe);
                    player1.weapon = axe;
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, actualPlayer, initialRowPosition, initialColPosition, sword);
                    player1.weapon = sword;
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, actualPlayer, initialRowPosition, initialColPosition);
            } else {
                break;
            }
        } 
    };

    // MOVE DOWN
    for (let i = 0; i < 3; i++){
        let row = initialRowPosition + (i + 1)
        let col = initialColPosition
        if (row < gridContent.length) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, actualPlayer, initialRowPosition, initialColPosition, bow);
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col, actualPlayer, initialRowPosition, initialColPosition, axe);
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, actualPlayer, initialRowPosition, initialColPosition, sword);
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, actualPlayer, initialRowPosition, initialColPosition);
            } else {
                break;
            }
        } 
    };
} 

// Function check for fight
function checkForFight(){
    for (let row = 0; row < gridContent.length; row++) {
        let column = gridContent[row];
        for (let col = 0; col < column.length; col++) {
            if (column[col] instanceof player && column[col].name =='Combattant 1'){
                if (row + 1 !== gridContent.length && gridContent[row + 1][col] instanceof player) {
                    console.log('FIGHT');
                } else if (row - 1 !== gridContent.length && gridContent[row - 1][col] instanceof player){
                    console.log('FIGHT');
                } else if (col + 1 !== gridContent.length && gridContent[row][col + 1] instanceof player){
                    console.log('FIGHT');   
                } else if (col - 1 !== gridContent.length && gridContent[row][col - 1] instanceof player){
                    console.log('FIGHT');
                }
            }
        }
    }
}; */

// BUG : ENLEVER LES CLASSES WEAPON, player DES DIVS APRES CHAQUE CLIC

// MODIFIER LA POSITION DES JOUEURS APRES CHAQUE MOUVEMENT 

// METTRE POINT DANS CONSTRUCTEUR ARMES 

// AJOUTER DIV AVEC JS PLUTOT QUE CREER HTML DIRECT ARMES - IDEM POINTS

// ESSAYER PLUTOT DE FAIRE UN CHEKC AUTOUR DES OBSTACLES POUR QU'ILS NE SOIENT JAMAIS A COTE

// PB INSTANCE OF player : changer dans le tableau pour chaque mouvement !!!!