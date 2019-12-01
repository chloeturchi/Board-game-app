export default class Display {

    static moveDisplay (mainPlayer) {
        $(`#grid-cell-${mainPlayer.previousPosition[0]}-${mainPlayer.previousPosition[1]}`).empty(); 
        $(`#grid-cell-${mainPlayer.position[0]}-${mainPlayer.position[1]}`).append("<img class='playerImg' id ='" + mainPlayer.name + "Img' src='assets/img/" + mainPlayer.name + ".svg'/>"); 
        $("div").removeClass("highlight") 
    }

};