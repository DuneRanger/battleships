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
function removeItem(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
class Ships {
    constructor() {
        this.placed = 0;
        this.sunken = 0;
        this.submarines = {
            length: 1,
            amount: 1,
            coords: []
        };
        this.destroyers = {
            length: 2,
            amount: 2,
            coords: []
        };
        this.cruisers = {
            length: 3,
            amount: 2,
            coords: []
        };
        this.battleships = {
            length: 4,
            amount: 1,
            coords: []
        };
        this.aircraftCarriers = {
            length: 5,
            amount: 1,
            coords: []
        };
    }
    place(ship, parent) {
        for (let x = 0; x < ship.amount; x++) {
            let placed = false;
            while (!placed) {
                let direction = Math.random() >= 0.5;
                if (direction) { //horizontal (to the right)
                    //Sets valid start coordinates, already condition, so the ship doesn't go out of bounds
                    let startCoords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * (parent.myBoard.length - ship.length))];
                    let coords = [];
                    //Adds the coords of all positions the ship is at
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0], startCoords[1] + y]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => parent.myBoard[x[0]][x[1]] === ".")) {
                        coords.forEach(x => parent.myBoard[x[0]][x[1]] = "X");
                        //does above and below
                        if (startCoords[0] !== 0)
                            coords.forEach(x => parent.myBoard[x[0] - 1][x[1]] = "N");
                        if (startCoords[0] !== 9)
                            coords.forEach(x => parent.myBoard[x[0] + 1][x[1]] = "N");
                        //does left and right
                        if (startCoords[1] !== 0)
                            parent.myBoard[startCoords[0]][startCoords[1] - 1] = "N";
                        if (startCoords[1] + ship.length < 10)
                            parent.myBoard[startCoords[0]][startCoords[1] + ship.length] = "N";
                        placed = true;
                        ship.coords.push(coords);
                    }
                }
                else { //vertical (downwards)
                    //Sets valid start coordinates, so the ship doesn't go out of bounds
                    let startCoords = [Math.floor(Math.random() * (parent.myBoard.length - ship.length)), Math.floor(Math.random() * 10)];
                    let coords = [];
                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0] + y, startCoords[1]]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => parent.myBoard[x[0]][x[1]] === ".")) {
                        coords.forEach(x => parent.myBoard[x[0]][x[1]] = "X");
                        //does left and right
                        if (startCoords[1] !== 0)
                            coords.forEach(x => parent.myBoard[x[0]][x[1] - 1] = "N");
                        if (startCoords[1] !== 9)
                            coords.forEach(x => parent.myBoard[x[0]][x[1] + 1] = "N");
                        //does above and below
                        if (startCoords[0] !== 0)
                            parent.myBoard[startCoords[0] - 1][startCoords[1]] = "N";
                        if (startCoords[0] + ship.length < 10)
                            parent.myBoard[startCoords[0] + ship.length][startCoords[1]] = "N";
                        placed = true;
                        ship.coords.push(coords);
                    }
                }
            }
        }
    }
}
class Attack {
    constructor(parent) {
        this.possibleTargets = [];
        for (let x in parent.opponentBoard) {
            for (let y in parent.opponentBoard[x]) {
                if (parent.opponentBoard[x][y] === ".")
                    this.possibleTargets.push([parseInt(x), parseInt(y)]);
            }
        }
        this.shootingDirection = [false, false]; //vertical up
        this.shipFound = false;
        this.shipDirectionKnown = false;
        this.firstHit = [];
        this.successfulHits = 0;
    }
    firstShot(parent) {
        let shot;
        shot = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer = input.split(", ");
            if (answer[0] === "hit") {
                this.successfulHits = 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                if (answer[answer.length - 1] === "end") {
                    this.successfulHits = 0;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    this.successfulHits = 0;
                    return this.firstShot(parent);
                }
                else {
                    this.shipFound = true;
                    this.firstHit = shot;
                    if (shot[0] > 0 && parent.opponentBoard[shot[0] - 1][shot[1]] === ".") {
                        this.shootingDirection = [false, false];
                        return this.secondShot(parent);
                    }
                    else if (shot[0] < 9 && parent.opponentBoard[shot[0] + 1][shot[1]] === ".") {
                        this.shootingDirection = [false, true];
                        return this.secondShot(parent);
                    }
                    else if (shot[1] > 0 && parent.opponentBoard[shot[0]][shot[1] - 1] === ".") {
                        this.shootingDirection = [true, false];
                        return this.secondShot(parent);
                    }
                    else if (shot[1] < 9 && parent.opponentBoard[shot[0]][shot[1] + 1] === ".") {
                        this.shootingDirection = [true, true];
                        return this.secondShot(parent);
                    }
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                return parent.opponentTurn();
            }
        });
    }
    secondShot(parent) {
        let shot = [];
        if (this.shootingDirection[0]) { // horizontal
            if (this.shootingDirection[1]) { // right
                shot = [this.firstHit[0], this.firstHit[1] + 1];
            }
            else { // left
                shot = [this.firstHit[0], this.firstHit[1] - 1];
            }
        }
        else { // vertical
            if (this.shootingDirection[1]) { // down
                shot = [this.firstHit[0] + 1, this.firstHit[1]];
            }
            else { // up
                shot = [this.firstHit[0] - 1, this.firstHit[1]];
            }
        }
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer = input.split(", ");
            if (answer[0] === "hit") {
                this.successfulHits += 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                if (answer[answer.length - 1] === "end") {
                    this.successfulHits = 0;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    this.successfulHits = 0;
                    this.shipFound = false;
                    this.firstShot(parent);
                }
                else {
                    this.shipDirectionKnown = true;
                    //switches direction if at the board border
                    if (this.shootingDirection[0]) { // horizontal
                        if (shot[1] === 0 || shot[1] === 9)
                            this.shootingDirection[1] = !this.shootingDirection[1];
                    }
                    else { // vertical
                        if (shot[0] === 0 || shot[1] === 9)
                            this.shootingDirection[1] = !this.shootingDirection[1];
                    }
                    return this.latterShot(parent);
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                if (this.firstHit[0] > 0 && parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] === ".") {
                    this.shootingDirection = [false, false];
                }
                else if (this.firstHit[0] < 9 && parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] === ".") {
                    this.shootingDirection = [false, true];
                }
                else if (this.firstHit[1] > 0 && parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] === ".") {
                    this.shootingDirection = [true, false];
                }
                else if (this.firstHit[1] < 9 && parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] === ".") {
                    this.shootingDirection = [true, true];
                }
                else {
                    this.shipFound = false;
                }
                return parent.opponentTurn();
            }
        });
    }
    latterShot(parent) {
        this.firstShot(parent);
    }
}
class Game {
    constructor() {
        this.myBoard = [
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
        this.opponentBoard = [
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
        this.attack = new Attack(this);
        this.ships = new Ships();
    }
    start() {
        this.ships.place(this.ships.submarines, this);
        this.ships.place(this.ships.destroyers, this);
        this.ships.place(this.ships.cruisers, this);
        this.ships.place(this.ships.battleships, this);
        this.ships.place(this.ships.aircraftCarriers, this);
        this.myBoard = this.myBoard.map(x => x.map(y => y === "N" ? y = "." : y));
        for (let x of this.myBoard) {
            console.log(x.join(" "));
        }
        rl.question("", (a) => a === "1" ? this.myTurn() : this.opponentTurn());
    }
    myTurn() {
        for (let x of this.opponentBoard) {
            console.log(x.join(" "));
        }
        if (this.attack.shipFound) {
            if (this.attack.shipDirectionKnown) {
                this.attack.latterShot(this);
            }
            else {
                this.attack.secondShot(this);
            }
        }
        else {
            this.attack.firstShot(this);
        }
    }
    opponentTurn() {
        for (let x of this.myBoard) {
            console.log(x.join(" "));
        }
        rl.question("opponentTurn\n", (input) => {
            let answer = input;
            let coordinates = [rows.indexOf(answer[0]), parseInt(answer[1]) - 1];
            if (this.myBoard[coordinates[0]][coordinates[1]] !== "X") {
                rl.write("miss\n");
                if (this.myBoard[coordinates[0]][coordinates[1]] !== "H") {
                    this.myBoard[coordinates[0]][coordinates[1]] = "O";
                }
                return this.myTurn();
            }
            else if (this.myBoard[coordinates[0]][coordinates[1]] === "X") {
                // if ship sunk - hit, sunk
                // if last ship sunk - hit, sunk, end
                rl.write("hit\n");
                this.myBoard[coordinates[0]][coordinates[1]] = "H";
                return this.opponentTurn();
            }
        });
    }
}
let m = new Game();
let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
m.start();
//# sourceMappingURL=main.js.map