function sortByRank(attr) {    
    return function(a, b) {    
        if (a[attr] < b[attr]) {    
            return 1;    
        } else if (a[attr] > b[attr]) {    
            return -1;    
        }    
        return 0;    
    }    
}  

const NUMBER_OF_PLAYERS = 5

function init(){

    let games = JSON.parse(localStorage.getItem('games'));
    if (games == null)  return;

    let lastGame = games.slice(-1)[0];

    games.sort(sortByRank("result"));

    let table = document.createElement("table");
    table.classList.add("table", "table-dark", "table-striped", "table-bordered");


    // pravimo header tabele
    let thead = document.createElement("thead")
    let row = thead.insertRow(0)
    columns = ["Ranking", "Player", "Points"]
    for (let i = 0; i < 3; i++){
        let cell = row.insertCell(i)
        cell.textContent = columns[i]
        cell.style.fontWeight="bold"
    }
    
    table.append(thead)
    // pravimo telo tabele
    let tbody = document.createElement("tbody")
    for(let i = 0; i < games.length && i < NUMBER_OF_PLAYERS; i++){

        let game = games[i]
        let row = tbody.insertRow(i);
        row.insertCell().textContent = i + 1
        row.insertCell().textContent = game.playerName
        row.insertCell().textContent = game.result
        if (game.gameId==lastGame.gameId) {
            row.classList.add("table-warning");
        }
    }
    
    let rank = games.findIndex(game=>game.gameId==lastGame.gameId) + 1;
    if (rank > NUMBER_OF_PLAYERS){
        row = tbody.insertRow();
        row.insertCell().textContent = rank
        row.insertCell().textContent = lastGame.playerName
        row.insertCell().textContent = lastGame.result
        row.classList.add("table-warning");
    }
    table.append(tbody)
    document.getElementById("results").appendChild(table);

    
    if(games.length > NUMBER_OF_PLAYERS){
        let noviIgraci = games.slice(0, NUMBER_OF_PLAYERS);
        localStorage.setItem('games', JSON.stringify(noviIgraci));
    }else{
        localStorage.setItem('games', JSON.stringify(games));
    }
}