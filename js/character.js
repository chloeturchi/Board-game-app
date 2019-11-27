export default class Player {
    
    constructor(name, life, weapon) {
        this.name = name;
        this.life = life;
        this.weapon = weapon;
        this.previousWeapon = null;
    }
};