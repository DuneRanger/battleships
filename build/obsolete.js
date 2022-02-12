"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
class Ship {
    constructor(name, length, amount) {
        this.name = name;
        this.length = length;
        this.amount = amount;
        this.sunken = 0;
    }
    buildShip() {
        for (let x = 0; x < this.amount; x++) {
            let placed = false;
            console.log("placing " + this.name + "(" + this.length + ")");
            again: while (!placed) {
                let direction = Math.round(Math.random()) == 1;
                if (direction) { //horizontal (to the left)
                    //Sets valid start coordinates, so the ship doesn't go out of bounds
                    let coords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * (board.length - this.length))];
                    console.log(coords, " ", direction);
                    console.log("checking validity");
                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (let y = 0; y < this.length; y++) {
                        if (!(board[coords[0]][coords[1] + y] === ".")) {
                            console.log("invalid, continue");
                            continue again;
                        }
                    }
                    //Removes the validity of squares next to the ship and places the ship itself
                    if (coords[1] != 0)
                        board[coords[0]][coords[1] - 1] = "N";
                    for (let y = 0; y < this.length; y++) {
                        if (coords[0] != 0)
                            board[coords[0] - 1][coords[1] + y] = "N";
                        if (coords[0] != 9)
                            board[coords[0] + 1][coords[1] + y] = "N";
                        board[coords[0]][coords[1] + y] = "X";
                    }
                    if (coords[1] + this.length < 10)
                        board[coords[0]][coords[1] + this.length] = "N";
                }
                else { //vertical (downwards)
                    //Sets valid start coordinates, so the ship doesn't go out of bounds
                    let coords = [Math.floor(Math.random() * (board.length - this.length)), Math.floor(Math.random() * 10)];
                    console.log(coords, " ", direction);
                    console.log("checking validity");
                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (let y = 0; y < this.length; y++) {
                        if (!(board[coords[0] + y][coords[1]] === ".")) {
                            console.log("invalid, continue");
                            continue again;
                        }
                    }
                    //Removes the validity of squares next to the ship and places the ship itself
                    if (coords[0] != 0)
                        board[coords[0] - 1][coords[1]] = "N";
                    for (let y = 0; y < this.length; y++) {
                        if (coords[1] != 0)
                            board[coords[0] + y][coords[1] - 1] = "N";
                        if (coords[1] != 9)
                            board[coords[0] + y][coords[1] + 1] = "N";
                        board[coords[0] + y][coords[1]] = "X";
                    }
                    if (coords[0] + this.length < 10)
                        board[coords[0] + this.length][coords[1]] = "N";
                }
                placed = true;
                console.log("placed " + this.name);
                for (let x of board) {
                    console.log(x.join(" "));
                }
                console.log("\n");
            }
        }
    }
}
let submarines = new Ship("ponorky", 1, 1);
let destroyers = new Ship("torpédoborce", 2, 2);
let cruisers = new Ship("křížniky", 3, 2);
let battleships = new Ship("bitevní lodě", 4, 1);
let aircraftCarriers = new Ship("letadlová lodě", 5, 1);
let board = [
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]
];
let enemyBoard = [
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]
];
aircraftCarriers.buildShip();
battleships.buildShip();
cruisers.buildShip();
destroyers.buildShip();
submarines.buildShip();
let boardClean = board.map(x => x.map(y => y === "N" ? y = "." : y));
let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
let shootingShip = [false, [0, 0], false]; //Saves the original shot where the ship was first hit and also the ships direction once found
let shootingDir = [false, false]; //true is horizontal, false is vertical | true is left/down, false is right/up
function removeItem(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
let possibleTargets = [];
for (let x in enemyBoard) {
    for (let y in enemyBoard[x]) {
        if (enemyBoard[x][y] === ".")
            possibleTargets.push([parseInt(x), parseInt(y)]);
    }
}
class Shooting {
    constructor() {
        this.possibleTargets = [];
        for (let x in enemyBoard) {
            for (let y in enemyBoard[x]) {
                if (enemyBoard[x][y] === ".")
                    possibleTargets.push([parseInt(x), parseInt(y)]);
            }
        }
        this.shootingDirection = [false, false];
        this.shipDirection = false;
        this.shooting = false;
        this.firstShot = [-1];
    }
    firstShooting(answer) {
        let shot;
        shot = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        if (answer[answer.length - 1] === "end") {
            enemyBoard[shot[0]][shot[1]] = "X";
            return console.log("End of Game");
        }
        else if (answer[answer.length - 1] === "sunk") {
            enemyBoard[shot[0]][shot[1]] = "X";
            myTurn();
        }
        else if (answer[0] === "hit") {
            enemyBoard[shot[0]][shot[1]] = "X";
            shootingShip = [true, [shot[0], shot[1]]];
            if (shot[0] > 0 && enemyBoard[shot[0] - 1][shot[1]] === ".") {
                shootingDir = [false, false];
                myTurn([shot[0] - 1, shot[1]]);
            }
            else if (shot[0] < 9 && enemyBoard[shot[0] + 1][shot[1]] === ".") {
                shootingDir = [false, true];
                myTurn([shot[0] + 1, shot[1]]);
            }
            else if (shot[1] < 9 && enemyBoard[shot[0]][shot[1] + 1] === ".") {
                shootingDir = [true, false];
                myTurn([shot[0], shot[1] + 1]);
            }
            else if (shot[1] > 0 && enemyBoard[shot[0]][shot[1] - 1] === ".") {
                shootingDir = [true, true];
                myTurn([shot[0], shot[1] - 1]);
            }
        }
        else if (answer[0] === "miss") {
            enemyBoard[shot[0]][shot[1]] = "0";
            enemyTurn();
        }
    }
    secondShooting() {
    }
    latterShooting() {
    }
}
function myTurn(shot = []) {
    console.log(shootingDir);
    for (let x of enemyBoard) {
        console.log(x.join(" "));
    }
    removeItem(possibleTargets, shot);
    rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
    rl.question("", (input) => {
        let answer = input.split(", ");
        if (sh.shooting) {
            if (answer[answer.length - 1] === "end") {
                enemyBoard[shot[0]][shot[1]] = "X";
                return console.log("End of Game");
            }
            else if (answer[answer.length - 1] === "sunk") {
                enemyBoard[shot[0]][shot[1]] = "X";
                shootingShip[0] = false;
                myTurn();
            }
            else if (answer[0] === "hit") {
                enemyBoard[shot[0]][shot[1]] = "X";
                if (shootingDir[0]) {
                    if (shootingDir[1]) {
                        if (shot[1] < 9 && enemyBoard[shot[0]][shot[1] + 1] === ".") {
                            shootingDir = [true, false];
                            myTurn([shot[0], shot[1] + 1]);
                        }
                    }
                    else {
                        if (shot[1] > 0 && enemyBoard[shot[0]][shot[1] - 1] === ".") {
                            shootingDir = [true, true];
                            myTurn([shot[0], shot[1] - 1]);
                        }
                    }
                }
                else {
                    if (shootingDir[1]) {
                        if (shot[0] < 9 && enemyBoard[shot[0] + 1][shot[1]] === ".") {
                            shootingDir = [false, true];
                            myTurn([shot[0] + 1, shot[1]]);
                        }
                    }
                    else {
                        if (shot[0] > 0 && enemyBoard[shot[0] - 1][shot[1]] === ".") {
                            shootingDir = [false, false];
                            myTurn([shot[0] - 1, shot[1]]);
                        }
                    }
                }
            }
            else if (answer[0] === "miss") {
                enemyBoard[shot[0]][shot[1]] = "0";
                enemyTurn();
            }
        }
        else {
            sh.firstShooting(answer);
        }
    });
}
function enemyTurn() {
    for (let x of boardClean) {
        console.log(x.join(" "));
    }
    rl.question("enemyTurn\n", (input) => {
        let answer = input;
        let coordinates = [rows.indexOf(answer[0]), parseInt(answer[1]) - 1];
        console.log(coordinates);
        if (boardClean[coordinates[0]][coordinates[1]] !== "X") {
            rl.write("miss\n");
            if (boardClean[coordinates[0]][coordinates[1]] !== "H") {
                boardClean[coordinates[0]][coordinates[1]] = "O";
            }
            myTurn();
        }
        else if (boardClean[coordinates[0]][coordinates[1]] === "X") {
            // if ship sunk - hit, sunk
            // if last ship sunk - hit, sunk, end
            rl.write("hit\n");
            boardClean[coordinates[0]][coordinates[1]] = "H";
            enemyTurn();
        }
    });
}
let sh = new Shooting();
rl.question("", (input) => input == "1" ? myTurn() : enemyTurn());
//# sourceMappingURL=obsolete.js.map