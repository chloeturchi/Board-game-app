export default class Player {
    constructor(name, life, weapon) {
        this.name = name;
        this.life = life;
        this.weapon = weapon;
        this.position = [];
        this.previousPosition = [];
        this.previousWeapon = null;
        this.previousWeaponPosition = [];
        this.weaponCounter = null;
    }

    move(nextRow, nextCol){
        this.previousPosition[0] = this.position[0];
        this.previousPosition[1] = this.position[1];
        this.position[0] = nextRow;
        this.position[1] = nextCol;
    }


};
