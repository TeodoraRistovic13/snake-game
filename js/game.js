const MAP_SIZE_DIM = 15;
const MOVEMENT_SPEED = 200;
const SNAKE_COLOR = '#2F8CD3';
const FOOD_COLOR = '#DF4134';
const CELL_COLOR_1 = "#1E2836";
const CELL_COLOR_2 = "#263445";
const REGULAR_FOOD = 1
const SUPER_FOOD = 2

let boardMap = new Map();
let direction = 'ArrowLeft';
let snake = [];
let foodCoords;
let superFoodCoords = -1;

function generateCoordinate(){
    return Math.round((Math.random() * MAP_SIZE_DIM * (MAP_SIZE_DIM - 1)) + 1);
}


function generateFood(foodType){

    let newFood = generateCoordinate();
    while(snake.includes(newFood) || newFood == foodCoords || newFood == superFoodCoords){
        newFood = generateCoordinate();
    }
    if (parseInt(foodType) == 1){
        
        foodCoords = newFood;

        $("#"+foodCoords).css('background-color', FOOD_COLOR);
        $("#"+foodCoords).css('border-radius', '50%');
    }else{
        
        superFoodCoords= newFood;
        $("#"+superFoodCoords).css('background-color', "orange");
        
    }
    
}



function setBestRank(){
    
    let games = JSON.parse(localStorage.getItem('games'));
    
    if(!games) {
        $("#bestScore").text(0);
        return;
    }

    if (games.length > 0){
        let bestGame = games.slice(0)[0];
        $("#bestScore").text(bestGame.result);
    }
    
}

function init(){

    let games = JSON.parse(localStorage.getItem('games')) || [];
    
    if (!games.length){
        localStorage.setItem('games', JSON.stringify([]));
    }
    
    setBestRank();
    setupTable();

    let snakeStart = generateCoordinate();
    snake.push(snakeStart);
    $("#" + snakeStart).css('background-color', SNAKE_COLOR);
    direction = snakeStart % MAP_SIZE_DIM >= 4 ? 'ArrowLeft':'ArrowRight';

    generateFood(REGULAR_FOOD);

    setTimeout(startGame, 3000);
    move();
    
}

function colorCell(id, color){
    $("#"+ id).css('background-color', color);
}

function setupTable(){

    let id = 1;
    for (let i = 0;i < MAP_SIZE_DIM; i++){
        let row = document.getElementById("gameBoard").insertRow(i);
        for (let j = 0; j < MAP_SIZE_DIM; j++){
            let cell = row.insertCell(j);
            cell.id = id.toString();
            id++;
        }
    }

    let cellColors = [CELL_COLOR_2, CELL_COLOR_1];
    let currIndex = 0, prevIndex = 0;

    for(let i = 1; i <= MAP_SIZE_DIM * MAP_SIZE_DIM; i++){
        colorCell(i, cellColors[currIndex]);
        boardMap.set(i, cellColors[currIndex]);
        if (i % MAP_SIZE_DIM == 0){
            currIndex = prevIndex == 0 ? 1 : 0;
            prevIndex = currIndex;
        }else{
            currIndex = (currIndex + 1) % 2;
        }
   }
}
 

function endGame(){

    let score = parseInt($("#score").text());
    let playerName = prompt("Enter player name:");
    if (playerName != null){
        let games = JSON.parse(localStorage.getItem('games'));
        let gameId = games.length == 0? 1 : games.reduce((max, curr)=> curr.gameId > max.gameId ? current : max, games[0] )
        let game = {
            gameId: gameId,
            playerName: playerName,
            result : score
        }
        games.push(game);
        localStorage.setItem('games', JSON.stringify(games));
        window.open("../html/snakes-results.html", "_self");    
        return
    }else{
        window.open("../html/snakes-game.html", "_self");    
        return
    }
}

function getNewSnakeHead(snakeHead, new_direction){

    snakeHead = parseInt(snakeHead);
    switch(new_direction){
        case 'ArrowLeft': 
        {
            if (snakeHead % MAP_SIZE_DIM != 1) return snakeHead - 1;
            else endGame();
        }
        case 'ArrowUp': 
        {
            if ((snakeHead - MAP_SIZE_DIM) > 0) return snakeHead - MAP_SIZE_DIM;
            else endGame();
        }
        case 'ArrowRight': 
        {
            if (snakeHead % MAP_SIZE_DIM != 0) return snakeHead + 1;
            else endGame();
        }
        case 'ArrowDown': 
        {
            if ((snakeHead + MAP_SIZE_DIM) <= MAP_SIZE_DIM * MAP_SIZE_DIM) return snakeHead + MAP_SIZE_DIM;
            else endGame();
        }
    }
}

function moveSnake(){

    let snakeHead = snake.slice(0);
    let newSnakeHead = getNewSnakeHead(snakeHead, direction);

    if (snake.includes(newSnakeHead)) {
        endGame();
        return
    }

    snake.unshift(newSnakeHead);
    colorCell(newSnakeHead, SNAKE_COLOR);

    if (snake.includes(foodCoords)){
        $("#" + foodCoords).css('border-radius', '0');
        generateFood(REGULAR_FOOD);
        $("#score").text(parseInt($("#score").text()) + 1);

    }else if(snake.includes(superFoodCoords)){
        superFoodCoords = -1;
        $("#score").text(parseInt($("#score").text()) + 10);
    }else{
        let snakeTail = snake.pop();
        colorCell(snakeTail, boardMap.get(snakeTail));
    }
}


function removeSuperFood(){

    if(superFoodCoords != -1) 
    {
        colorCell(superFoodCoords, boardMap.get(superFoodCoords));
        superFoodCoords = -1;
    }

}

function move(){
    
    moveSnake();
    setTimeout(move, MOVEMENT_SPEED);

}



function startGame(){
    generateFood(SUPER_FOOD);
    setTimeout(removeSuperFood, 3000);
    setTimeout(startGame, 10000);

}


$(document).ready(function(){
    $(document).keydown(function(e){
        direction = e.key;
    })
})