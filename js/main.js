import Map from './map.js'
import Obstacle from './obstacle.js'
import Weapon from './weapon.js'
import Character from './character.js'

/************************************* ETAPE 1 *************************************/

////////////////////////////// GENERATE GRID DIVS AND 2DARRAY //////////////////////////////
const game_map = new Map (10);
game_map.generateGrid("#wrapper");
const grid_content = game_map.createArray(10,10);

////////////////////////////// OBSTACLES //////////////////////////////
// Put obstacles in an array
const obstacle_arr = [];
function pushObstacles (number) {
    for (let i = 0; i < number; i++) {
        const obstacle = new Obstacle(i);
        obstacle_arr.push(obstacle);
    };  
} pushObstacles(8);

// Add obstacles in grid array & display 
for (let i = 0; i < obstacle_arr.length; i++){
    function displayObstacles(){
        const random_row = randomNumber();
        const random_col = randomNumber();
        console.log(random_row, random_col);
        if (grid_content[random_row][random_col] == undefined) {
            grid_content[random_row][random_col] = obstacle_arr[i];
            $("#grid-cell-" + random_row + "-" + random_col).addClass("obstacle");
            $("#grid-cell-" + random_row + "-" + random_col).append("<img class='obstacleImg' src='assets/img/obstacle.svg'/>");
        } else {
            displayObstacles();
        }
    };  displayObstacles()
};

////////////////////////////// WEAPONS //////////////////////////////
// Instances of Weapon
const dagger = new Weapon("dagger", 10);
const bow = new Weapon("bow", 20);
const axe = new Weapon("axe", 30);
const sword = new Weapon("sword", 40);

// Add weapons in an array
const weapon_arr = [];
weapon_arr.push.apply(weapon_arr, [bow, axe, sword]);

// Add weapon in grid array & display 
for (let i = 0; i < weapon_arr.length; i++){
    function displayWeapons(){
        const random_row = randomNumber();
        const random_col = randomNumber();
        if (grid_content[random_row][random_col] == undefined) {
            grid_content[random_row][random_col] = weapon_arr[i];
            $("#grid-cell-" + random_row + "-" + random_col).addClass("weapon");
            if (weapon_arr[i].name == 'bow'){
                $("#grid-cell-" + random_row + "-" + random_col).append("<img class='weaponImg' id='bowImg' src='assets/img/bow.svg'/>"); 
            } else if (weapon_arr[i].name == 'axe'){
                $("#grid-cell-" + random_row + "-" + random_col).append("<img class='weaponImg' id='axeImg' src='assets/img/axe.svg'/>"); 
            } else if (weapon_arr[i].name == 'sword'){
                $("#grid-cell-" + random_row + "-" + random_col).append("<img class='weaponImg' id='swordImg' src='assets/img/sword.svg'/>"); 
            }
        } else {
            displayWeapons();
        }
    };  displayWeapons();
};

////////////////////////////// CHARACTERS //////////////////////////////
// Instances of Character
const character1 = new Character("Combattant 1", 100);
const character2 = new Character("Combattant 2", 100);

// Add characters in an array
const character_arr = [];
character_arr.push.apply(character_arr, [character1, character2]);

// Characters positions on grid
let character1_pos = [];
let character2_pos = [];

// Add characters in grid array
for (let i = 0; i < character_arr.length; i++){
    function displayCharacter(){
        const random_row = randomNumber();
        const random_col = randomNumber();
        // Test if value around Character in Grid Array has Obstacle or character
        if (random_row - 1 !== -1 && grid_content[random_row - 1][random_col] !== undefined) {
            displayCharacter();
        } else if (random_row + 1 !== grid_content.length && grid_content[random_row + 1][random_col] !== undefined) {
            displayCharacter();
        } else if (random_col - 1 !== -1 && grid_content[random_row][random_col - 1] !== undefined) {
            displayCharacter();
        } else if (random_col + 1 !== grid_content.length && grid_content[random_row][random_col + 1] !== undefined) {
            displayCharacter();
        // Test if the chosen Character area is undefined
        } else if (grid_content[random_row][random_col] == undefined){
            grid_content[random_row][random_col] = character_arr[i];
            if (character_arr[i].name == 'Combattant 1'){
                character1_pos.push.apply(character1_pos, [[random_row][0], [random_col][0]]);
                $("#grid-cell-" + random_row + "-" + random_col).append("<img class='characterImg' id ='character1Img' src='assets/img/perso1.svg'/>"); 
                $("#grid-cell-" + random_row + "-" + random_col).addClass("character1");
            } else if (character_arr[i].name == 'Combattant 2'){
                character2_pos.push.apply(character2_pos, [[random_row][0], [random_col][0]]);
                $("#grid-cell-" + random_row + "-" + random_col).append("<img class='characterImg' id ='character2Img' src='assets/img/perso2.svg'/>"); 
                $("#grid-cell-" + random_row + "-" + random_col).addClass("character2");
            }
        } else {
            displayCharacter();
        }
    } displayCharacter();
};

/************************************* ETAPE 2 *************************************/

////////////////////////////// MOVES //////////////////////////////
// MOVE RIGHT
for (let i = 0; i < 3; i++){
    let row = character1_pos[0] 
    let col = character1_pos[1] + (i + 1)
    if (col < grid_content.length) {
        if (grid_content[row][col] instanceof Weapon) {
            if (grid_content[row][col].name === 'bow'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col);
            } else if (grid_content[row][col].name === 'axe'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col);
            } else if (grid_content[row][col].name === 'sword'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col);
            }
        } else if (grid_content[row][col] == undefined){
            undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col);
        } else {
            break;
        }
    }  
};

// MOVE LEFT
for (let i = 0; i < 3; i++){
    let row = character1_pos[0] 
    let col = character1_pos[1] - (i + 1)
    if (col > -1) {
        if (grid_content[row][col] instanceof Weapon) {
            if (grid_content[row][col].name === 'bow'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col);
            } else if (grid_content[row][col].name === 'axe'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col);
            } else if (grid_content[row][col].name === 'sword'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col);
            }   
        } else if (grid_content[row][col] == undefined){
            undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col);
        } else {
            break;
        }
    } 
};

// MOVE UP
for (let i = 0; i < 3; i++){
    let row = character1_pos[0] - (i + 1)
    let col = character1_pos[1] 
    if (row > -1) {
        if (grid_content[row][col] instanceof Weapon) {
            if (grid_content[row][col].name === 'bow'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col);
            } else if (grid_content[row][col].name === 'axe'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col);
            } else if (grid_content[row][col].name === 'sword'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col);
            }   
        } else if (grid_content[row][col] == undefined){
            undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col);
        } else {
            break;
        }
    } 
};

// MOVE DOWN
for (let i = 0; i < 3; i++){
    let row = character1_pos[0] + (i + 1)
    let col = character1_pos[1] 
    if (row < grid_content.length) {
        if (grid_content[row][col] instanceof Weapon) {
            if (grid_content[row][col].name === 'bow'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#bowImg', row, col);
            } else if (grid_content[row][col].name === 'axe'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#axeImg', row, col);
            } else if (grid_content[row][col].name === 'sword'){
                weaponOnClick ("#grid-cell-" + row + "-" + col, 'img#swordImg', row, col);
            }   
        } else if (grid_content[row][col] == undefined){
            undefinedOnClick ("#grid-cell-" + row + "-" + col, row, col);
        } else {
            break;
        }
    } 
};

////////////////////////////// FUNCTIONS & LOGS //////////////////////////////
// Create random Number
function randomNumber(){
    return Math.floor(Math.random() * grid_content.length)
}

// What to do when click on a weapon
function weaponOnClick(div, img_to_remove, row, col) {
    $(div).click(function(){
        grid_content[row][col] = character1;
        grid_content[character1_pos[0]][character1_pos[1]] = undefined;
        $(img_to_remove).remove();  
        clearAfterClick(div);
        checkForFight();
    })
};

// What to do when click on an undefined 
function undefinedOnClick (div, row, col) {
    $(div).addClass("highlight");
    $(div).click(function(){
        grid_content[row][col] = character1;
        grid_content[character1_pos[0]][character1_pos[1]] = undefined;
        clearAfterClick(div);
        checkForFight();
    })
};

// Function clearAfterClick
function clearAfterClick(divs) {
    $('img#character1Img').remove();
    $('div').removeClass('character1');
    $(divs).addClass('character1');
    $(divs).append("<div class='character1 square'><img class='characterImg' id ='character1Img' src='assets/img/perso1.svg'/></div>");
    $('div').removeClass('highlight');
}

// Function check for fight
function checkForFight(){
    for (let row = 0; row < grid_content.length; row++) {
        let column = grid_content[row];
        for (let col = 0; col < column.length; col++) {
            if (column[col] instanceof Character && column[col].name =='Combattant 1'){
                if (row + 1 !== grid_content.length && grid_content[row + 1][col] instanceof Character) {
                    console.log('FIGHT');
                } else if (row - 1 !== grid_content.length && grid_content[row - 1][col] instanceof Character){
                    console.log('FIGHT');
                } else if (col + 1 !== grid_content.length && grid_content[row][col + 1] instanceof Character){
                    console.log('FIGHT');   
                } else if (col - 1 !== grid_content.length && grid_content[row][col - 1] instanceof Character){
                    console.log('FIGHT');
                }
            }
        }
    }
};

