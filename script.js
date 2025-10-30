loadData();

let gameData = {};

function saveData() {
    localStorage.setItem("HauntedHouseGameData", JSON.stringify(gameData));
}

function loadData() {
    const savedGameData = localStorage.getItem("HauntedHouseGameData");
    if (savedGameData) {
        gameData = JSON.parse(savedGameData);
    } else {

    }
    start();
}

function start() {

}