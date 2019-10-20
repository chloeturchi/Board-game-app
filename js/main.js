import Map from './map.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Character from './character.js'

/************************************* ETAPE 1 *************************************/

////////////////////////////// GENERATE 2DARRAY //////////////////////////////
const gameMap = new Map (10);
const gridContent = gameMap.createArray(10,10);

////////////////////////////// INSTANCES //////////////////////////////
const obstacle = new Obstacle("<img class='obstacleImg' src='assets/img/obstacle.svg'/>");

const dagger = new Weapon("dagger", 10, "<img class='weaponImg' id='daggerImg' src='assets/img/dagger.svg'/>");
const bow = new Weapon("bow", 20, "<img class='weaponImg' id='bowImg' src='assets/img/bow.svg'/>");
const axe = new Weapon("axe", 30, "<img class='weaponImg' id='axeImg' src='assets/img/axe.svg'/>");
const sword = new Weapon("sword", 40, "<img class='weaponImg' id='swordImg' src='assets/img/sword.svg'/>");

const character1 = new Character("Combattant 1", 100, dagger, "<img class='characterImg' id ='character1Img' src='assets/img/perso1.svg'/>");
const character2 = new Character("Combattant 2", 100, dagger, "<img class='characterImg' id ='character2Img' src='assets/img/perso2.svg'/>");

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

// Characters
const characterArr = [];
characterArr.push.apply(characterArr, [character1, character2]); // Put Characters in an array

// Get Characters positions on grid
let character1Pos = [];
let character2Pos = [];

////////////////////////////// ADD OBSTACLES, WEAPONS, CHARACTER IN A GLOBAL ARRAY AND DISPLAY //////////////////////////////
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

////////////////////////////// CHARACTERS //////////////////////////////
// Characters
for (let i = 0; i < characterArr.length; i++){
    function displayCharacter(){
        const randomRow = randomNumber();
        const randomCol = randomNumber();
        // Test if value around Character in Grid Array has Obstacle or character and not push
        if (randomRow - 1 !== -1 && gridContent[randomRow - 1][randomCol] !== undefined) {
            displayCharacter();
        } else if (randomRow + 1 !== gridContent.length && gridContent[randomRow + 1][randomCol] !== undefined) {
            displayCharacter();
        } else if (randomCol - 1 !== -1 && gridContent[randomRow][randomCol - 1] !== undefined) {
            displayCharacter();
        } else if (randomCol + 1 !== gridContent.length && gridContent[randomRow][randomCol + 1] !== undefined) {
            displayCharacter();
        // Test if the chosen Character area is undefined and push in array
        } else if (gridContent[randomRow][randomCol] == undefined){
            gridContent[randomRow][randomCol] = characterArr[i];
        } else {
            displayCharacter();
        }
    } displayCharacter();
};

////////////////////////////// DISPLAY GRID //////////////////////////////
// CREATE DIVS
for (let row = 0; row < gridContent.length; row++) {
    let column = gridContent[row];
    let newRowDiv = document.createElement("div");
      newRowDiv.setAttribute("id", `grid-row-${row}`);
      newRowDiv.setAttribute("class", "grid-row");
    for (let col = 0; col < column.length; col++) {
        let newColDiv = document.createElement("div");
        newColDiv.setAttribute("id", `grid-cell-${row}-${col}`);
        newColDiv.setAttribute("class", "grid-cell");
        newRowDiv.appendChild(newColDiv);
        $('#wrapper').append(newRowDiv);
    }
}

// DISPLAY OBSTACLES, WEAPONS, CHARACTERS
for(let row = 0; row < gridContent.length; row++) {
    let column = gridContent[row];
    for (let col = 0; col < column.length; col++) {
        // Display obstacles
        if (column[col] instanceof Obstacle) {
            //$("#grid-cell-" + row + "-" + col).addClass("obstacle");
            $("#grid-cell-" + row + "-" + col).append(obstacle.img);
        // Display weapons
        } else if (column[col] instanceof Weapon) {
            //$("#grid-cell-" + row + "-" + col).addClass("weapon");
            if (column[col].name == 'bow') {
                $("#grid-cell-" + row + "-" + col).append(bow.img);
            } else if (column[col].name == 'axe') {
                $("#grid-cell-" + row + "-" + col).append(axe.img);
            } else if (column[col].name == 'sword') {
                $("#grid-cell-" + row + "-" + col).append(sword.img);
            }
        // Display characters
        } else if (column[col] instanceof Character) {
            if (column[col].name =='Combattant 1') { 
                // Put Character 1 position in an array
                character1Pos.push.apply(character1Pos, [[row][0], [col][0]]);
                $("#grid-cell-" + row + "-" + col).append(character1.img); 
                //$("#grid-cell-" + row + "-" + col).addClass("character1");
            } else if (column[col].name =='Combattant 2') { 
                // Put Character 1 position in an array
                character2Pos.push.apply(character2Pos, [[row][0], [col][0]]);
                $("#grid-cell-" + row + "-" + col).append(character2.img); 
                //$("#grid-cell-" + row + "-" + col).addClass("character2");
            }
        }
    }
};

/************************************* ETAPE 2 *************************************/

////////////////////////////// MOVES //////////////////////////////
// Set the first player turn
move (character1Pos[0], character1Pos[1], character1)

// Function to move up, down, left and right 
function move (characRow, characCol, character) {
    // MOVE RIGHT
    for (let i = 0; i < 3; i++){
        let row = characRow 
        let col = characCol + (i + 1)
        if (col < gridContent.length) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, character, characRow, characCol);
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col, character, characRow, characCol);
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, character, characRow, characCol);
                }
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, character, characRow, characCol);
            } else {
                break;
            }
        }  
    };

    // MOVE LEFT
    for (let i = 0; i < 3; i++){
        let row = characRow 
        let col = characCol - (i + 1)
        if (col > -1) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, character, characRow, characCol);
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col), character, characRow, characCol;
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, character, characRow, characCol);
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, character, characRow, characCol);
            } else {
                break;
            }
        } 
    };

    // MOVE UP
    for (let i = 0; i < 3; i++){
        let row = characRow - (i + 1)
        let col = characCol 
        if (row > -1) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, character, characRow, characCol);
                    character1.weapon = bow;
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col, character, characRow, characCol);
                    character1.weapon = axe;
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, character, characRow, characCol);
                    character1.weapon = sword;
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, character, characRow, characCol);
            } else {
                break;
            }
        } 
    };

    // MOVE DOWN
    for (let i = 0; i < 3; i++){
        let row = characRow + (i + 1)
        let col = characCol
        if (row < gridContent.length) {
            if (gridContent[row][col] instanceof Weapon) {
                if (gridContent[row][col].name === 'bow'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col, character, characRow, characCol);
                } else if (gridContent[row][col].name === 'axe'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col, character, characRow, characCol);
                } else if (gridContent[row][col].name === 'sword'){
                    weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col, character, characRow, characCol);
                }   
            } else if (gridContent[row][col] == undefined){
                undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col, character, characRow, characCol);
            } else {
                break;
            }
        } 
    };
}

////////////////////////////// DISPLAYED INFORMATION GAME //////////////////////////////
$(".turn").text("-");
$(".actual-weapon").append(character1.weapon.img);

////////////////////////////// FUNCTIONS & LOGS //////////////////////////////
// Create random Number
function randomNumber(){
    return Math.floor(Math.random() * gridContent.length)
}

// What to do when click on a weapon
function weaponOnClick(mainDiv, imgToRemove, row, col, character, characRow, characCol) {
    $(mainDiv).click(function(){
        // change weapon to character
        gridContent[row][col] = character;
        gridContent[characRow][characCol] = undefined;
        $(imgToRemove).remove(); 
        clearAfterClick(mainDiv, character);
        checkForFight();
        // if character 1 was playing, play with charac 2
        if (character == character1) {
            move (character2Pos[0], character2Pos[1], character2);
        } else if (character == character2){
            move (character1Pos[0], character1Pos[1], character1);
        }
    })
};

// What to do when click on an undefined 
function undefinedOnClick (mainDiv, row, col, character, characRow, characCol) {
    $(mainDiv).addClass("highlight");
    $(mainDiv).click(function(){
        gridContent[row][col] = character;
        gridContent[characRow][characCol] = undefined;
        clearAfterClick(mainDiv, character);
        checkForFight();
        // if character 1 was playing, play with charac 2
        if (character == character1) {
            move (character2Pos[0], character2Pos[1], character2);
        } else if (character == character2){
            move (character1Pos[0], character1Pos[1], character1);
        }
    })
};

// Function clearAfterClick
function clearAfterClick(mainDiv, character) {
    $('div').removeClass('highlight');
    if (character == character1){
        $('img#character1Img').remove();
        $('div').removeClass('character1');
        //$(mainDiv).addClass('character1');
        $(mainDiv).append(character1.img);
    
    } else if (character == character2){
        $('img#character2Img').remove();
        $('div').removeClass('character2');
        //$(mainDiv).addClass('character2');
        $(mainDiv).append(character2.img);    
    }
}

// Function check for fight
function checkForFight(){
    for (let row = 0; row < gridContent.length; row++) {
        let column = gridContent[row];
        for (let col = 0; col < column.length; col++) {
            if (column[col] instanceof Character && column[col].name =='Combattant 1'){
                if (row + 1 !== gridContent.length && gridContent[row + 1][col] instanceof Character) {
                    console.log('FIGHT');
                } else if (row - 1 !== gridContent.length && gridContent[row - 1][col] instanceof Character){
                    console.log('FIGHT');
                } else if (col + 1 !== gridContent.length && gridContent[row][col + 1] instanceof Character){
                    console.log('FIGHT');   
                } else if (col - 1 !== gridContent.length && gridContent[row][col - 1] instanceof Character){
                    console.log('FIGHT');
                }
            }
        }
    }
};

// BUG : ENLEVER LES CLASSES WEAPON, CHARACTER DES DIVS APRES CHAQUE CLIC

// MODIFIER LA POSITION DES JOUEURS APRES CHAQUE MOUVEMENT 

// METTRE POINT DANS CONSTRUCTEUR ARMES 

// AJOUTER DIV AVEC JS PLUTOT QUE CREER HTML DIRECT ARMES - IDEM POINTS

// ESSAYER PLUTOT DE FAIRE UN CHEKC AUTOUR DES OBSTACLES POUR QU'ILS NE SOIENT JAMAIS A COTE

// PB INSTANCE OF CHARACTER : changer dans le tableau pour chaque mouvement !!!!