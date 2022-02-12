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
    place(ship) {
        for (let x = 0; x < ship.amount; x++) {
            let placed = false;
            while (!placed) {
                let direction = Math.random() >= 0.5;
                if (direction) { //horizontal (to the right)
                    //Sets valid start coordinates, already condition, so the ship doesn't go out of bounds
                    let startCoords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * (board.length - ship.length))];
                    let coords = [];
                    //Adds the coords of all positions the ship is at
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0], startCoords[1] + y]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => board[x[0]][x[1]] === ".")) {
                        coords.forEach(x => board[x[0]][x[1]] = "X");
                        //does above and below
                        if (startCoords[0] !== 0)
                            coords.forEach(x => board[x[0] - 1][x[1]] = "N");
                        if (startCoords[0] !== 9)
                            coords.forEach(x => board[x[0] + 1][x[1]] = "N");
                        //does left and right
                        if (startCoords[1] !== 0)
                            board[startCoords[0]][startCoords[1] - 1] = "N";
                        if (startCoords[1] + ship.length < 10)
                            board[startCoords[0]][startCoords[1] + ship.length] = "N";
                        placed = true;
                        ship.coords.push(coords);
                    }
                }
                else { //vertical (downwards)
                    //Sets valid start coordinates, so the ship doesn't go out of bounds
                    let startCoords = [Math.floor(Math.random() * (board.length - ship.length)), Math.floor(Math.random() * 10)];
                    let coords = [];
                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0] + y, startCoords[1]]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => board[x[0]][x[1]] === ".")) {
                        coords.forEach(x => board[x[0]][x[1]] = "X");
                        //does left and right
                        if (startCoords[1] !== 0)
                            coords.forEach(x => board[x[0]][x[1] - 1] = "N");
                        if (startCoords[1] !== 9)
                            coords.forEach(x => board[x[0]][x[1] + 1] = "N");
                        //does above and below
                        if (startCoords[0] !== 0)
                            board[startCoords[0] - 1][startCoords[1]] = "N";
                        if (startCoords[0] + ship.length < 10)
                            board[startCoords[0] + ship.length][startCoords[1]] = "N";
                        placed = true;
                        ship.coords.push(coords);
                    }
                }
            }
        }
    }
}
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
// let shootingShip: any[] = [false, [0, 0], false]; //Saves the original shot where the ship was first hit and also the ships direction once found
// let shootingDir: boolean[] = [false, false]; //true is horizontal, false is vertical | true is left/down, false is right/up
// function removeItem<T>(arr: T[], value: any): T[] { 
//     const index = arr.indexOf(value);
//     if (index > -1) {
//       arr.splice(index, 1);
//     }
//     return arr;
// }
// let possibleTargets: number[][] = [];
// for (let x in enemyBoard) {
//     for (let y in enemyBoard[x]) {
//         if (enemyBoard[x][y] === ".") possibleTargets.push([parseInt(x), parseInt(y)]);
//     }
// }
// class Shooting {
//     possibleTargets: number[][];
//     shootingDirection: boolean[];
//     shipDirection: boolean;
//     shooting: boolean;
//     firstShot: number[];
//     constructor() {
//         this.possibleTargets = [];
//         for (let x in enemyBoard) {
//             for (let y in enemyBoard[x]) {
//                 if (enemyBoard[x][y] === ".") possibleTargets.push([parseInt(x), parseInt(y)]);
//             }
//         }
//         this.shootingDirection = [false, false];
//         this.shipDirection = false;
//         this.shooting = false;
//         this.firstShot = [-1];
//     }
//     firstShooting(answer: string[]) {
//         let shot: number[];
//         shot = possibleTargets[Math.floor(Math.random()*possibleTargets.length)];
//         if (answer[answer.length-1] === "end") {
//             enemyBoard[shot[0]][shot[1]] = "X";
//             return console.log("End of Game");
//         }
//         else if (answer[answer.length-1] === "sunk") {
//             enemyBoard[shot[0]][shot[1]] = "X";
//             myTurn()
//         }
//         else if (answer[0] === "hit") {
//             enemyBoard[shot[0]][shot[1]] = "X";
//             shootingShip = [true, [shot[0], shot[1]]];
//             if (shot[0] > 0 && enemyBoard[shot[0]-1][shot[1]] === ".") { shootingDir = [false, false]; myTurn([shot[0]-1, shot[1]]); }
//             else if (shot[0] < 9 && enemyBoard[shot[0]+1][shot[1]] === ".") { shootingDir = [false, true]; myTurn([shot[0]+1, shot[1]]); }
//             else if (shot[1] < 9 && enemyBoard[shot[0]][shot[1]+1] === ".") { shootingDir = [true, false]; myTurn([shot[0], shot[1]+1]); }
//             else if (shot[1] > 0 && enemyBoard[shot[0]][shot[1]-1] === ".") { shootingDir = [true, true]; myTurn([shot[0], shot[1]-1]); }
//         }
//         else if (answer[0] === "miss") {
//             enemyBoard[shot[0]][shot[1]] = "0";
//             enemyTurn();
//         }
//     }
//     secondShooting() {
//     }
//     latterShooting() {
//     }
// }
// function myTurn(shot: number[] = []) {
//     console.log(shootingDir)
//     for (let x of enemyBoard) {
//         console.log(x.join(" "));
//     }
//     removeItem(possibleTargets, shot);
//     rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
//     rl.question("", (input) => { 
//         let answer: string[] = input.split(", ");
//         if (sh.shooting) {
//             if (answer[answer.length-1] === "end") {
//                 enemyBoard[shot[0]][shot[1]] = "X";
//                 return console.log("End of Game");
//             }
//             else if (answer[answer.length-1] === "sunk") {
//                 enemyBoard[shot[0]][shot[1]] = "X";
//                 shootingShip[0] = false;
//                 myTurn();
//             }
//             else if (answer[0] === "hit") {
//                 enemyBoard[shot[0]][shot[1]] = "X";
//                 if (shootingDir[0]) {
//                     if (shootingDir[1]) {
//                         if (shot[1] < 9 && enemyBoard[shot[0]][shot[1]+1] === ".") { shootingDir = [true, false]; myTurn([shot[0], shot[1]+1]); }
//                     }
//                     else {
//                         if (shot[1] > 0 && enemyBoard[shot[0]][shot[1]-1] === ".") { shootingDir = [true, true]; myTurn([shot[0], shot[1]-1]); }
//                     }
//                 }
//                 else {
//                     if (shootingDir[1]) {
//                         if (shot[0] < 9 && enemyBoard[shot[0]+1][shot[1]] === ".") { shootingDir = [false, true]; myTurn([shot[0]+1, shot[1]]); }
//                     }
//                     else {
//                         if (shot[0] > 0 && enemyBoard[shot[0]-1][shot[1]] === ".") { shootingDir = [false, false]; myTurn([shot[0]-1, shot[1]]); }
//                     }
//                 }
//             }
//             else if (answer[0] === "miss") {
//                 enemyBoard[shot[0]][shot[1]] = "0";
//                 enemyTurn();
//             }
//         }
//         else {
//             sh.firstShooting(answer);
//         }
//     });
// }
// function enemyTurn() {
//     for (let x of boardClean) {
//         console.log(x.join(" "));
//     }
//     rl.question("enemyTurn\n", (input) => {
//         let answer: string = input;
//         let coordinates: number[] = [rows.indexOf(answer[0]), parseInt(answer[1])-1];
//         console.log(coordinates);
//         if (boardClean[coordinates[0]][coordinates[1]] !== "X") {
//             rl.write("miss\n");
//             if (boardClean[coordinates[0]][coordinates[1]] !== "H") {
//                 boardClean[coordinates[0]][coordinates[1]] = "O";
//             }
//             myTurn();
//         }
//         else if (boardClean[coordinates[0]][coordinates[1]] === "X") {
//             // if ship sunk - hit, sunk
//                 // if last ship sunk - hit, sunk, end
//             rl.write("hit\n");
//             boardClean[coordinates[0]][coordinates[1]] = "H";
//             enemyTurn();
//         }
//     });
// }
// let sh = new Shooting();
// rl.question("", (input: string) => input == "1" ? myTurn() : enemyTurn());
class Game {
    constructor() {
        // this.shooting = new Shooting();
        this.ships = new Ships();
    }
}
// rl.question("", (input: string) => input == "1" ? null : null);
let main = new Game();
main.ships.place(main.ships.submarines);
main.ships.place(main.ships.destroyers);
main.ships.place(main.ships.cruisers);
main.ships.place(main.ships.battleships);
main.ships.place(main.ships.aircraftCarriers);
let boardClean = board.map(x => x.map(y => y === "N" ? y = "." : y));
let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
for (let x of boardClean) {
    console.log(x.join(" "));
}
//# sourceMappingURL=main.js.map