import * as readline from "readline";
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
class Ship {
    name: string;
    length: number;
    amount: number;
    placed: number;
    sunken: number;
   
    constructor(name: string, length: number, amount: number) {
        this.name = name;
        this.length = length;
        this.amount = amount;
        this.placed = 0;
        this.sunken = 0;
    }
}

function buildShip(ship: Ship) {
    for (let x = 0; x < ship.amount; x++) {
        let placed: boolean = false;
        again:
        while (!placed) {
            let coords: number[] = [Math.floor(Math.random()*10), Math.floor(Math.random()*10)];
            let direction: boolean = Math.round(Math.random()) == 1;
            console.log(coords, " ", direction);
            console.log("checking validity");

            //Checks if the ship doesn't go out of bounds
            if (coords.some(num => num + ship.length > board.length)) {
                console.log("invalid len, continue")
                continue again;
            }
            if (direction) { //horizontal (to the left)
                //Checks if the whole ship can fit there
                for (let y = 0; y < ship.length; y++) {
                    if (!(board[coords[0]][coords[1]+y] === ".")) {
                        console.log("invalid, continue");
                        continue again;
                    }
                }
                //Removes the validity of squares next to the ship and places the ship itself
                if (coords[1] != 0) board[coords[0]][coords[1]-1] = "N";
                for (let y = 0; y < ship.length; y++) {
                    if (coords[0] != 0) board[coords[0]-1][coords[1]+y] = "N";
                    if (coords[0] != 9) board[coords[0]+1][coords[1]+y] = "N";
                    board[coords[0]][coords[1]+y] = "X";
                }
                if (coords[1]+ship.length < 10) board[coords[0]][coords[1]+ship.length] = "N";
            }
            else { //vertical (downwards)
                //Checks if the whole ship can fit there
                for (let y = 0; y < ship.length; y++) {
                    if (!(board[coords[0]+y][coords[1]] === ".")) {
                        console.log("invalid, continue");
                        continue again;
                    }
                }
                //Removes the validity of squares next to the ship and places the ship itself
                if (coords[0] != 0) board[coords[0]-1][coords[1]] = "N";
                for (let y = 0; y < ship.length; y++) {
                    if (coords[1] != 0) board[coords[0]+y][coords[1]-1] = "N";
                    if (coords[1] != 9) board[coords[0]+y][coords[1]+1] = "N";
                    board[coords[0]+y][coords[1]] = "X";
                }
                if (coords[0]+ship.length < 10) board[coords[0]+ship.length][coords[1]] = "N";
            }
            placed = true;
            console.log("placed " + ship.name);
            for (let x of board) {
                console.log(x.join(" "));
            }
            console.log("\n")
        }
    }
}

let submarines = new Ship("ponorky", 1, 1);
let destroyers = new Ship("torpédoborce", 2, 2);
let cruisers = new Ship("křížniky", 3, 2);
let battleships = new Ship("bitevní lodě", 4, 1);
let aircraftCarriers = new Ship("letadlová lodě", 5, 1);

let board: Array<Array<string>> = []
for (let i = 0; i < 10; i++) {
    let tempRow: string[] = [];
    for (let n = 0; n < 10; n++) {
        tempRow.push(".");
    }
    board.push(tempRow);
}

buildShip(aircraftCarriers);
buildShip(battleships);
buildShip(cruisers);
buildShip(destroyers);
buildShip(submarines);

let boardClean: Array<Array<string>> = board.map(x => x.map(y => y === "N" ? y = "." : y = y))
for (let x of boardClean) {
    console.log(x.join(" "))
}