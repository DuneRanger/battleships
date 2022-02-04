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
}
function buildShip(ship) {
    for (let x = 0; x < ship.amount; x++) {
        let placed = false;
        console.log("placing " + ship.name + "(" + ship.length + ")");
        again: while (!placed) {
            let direction = Math.round(Math.random()) == 1;
            //Checks if the ship doesn't go out of bounds
            // if (coords.some(num => num + ship.length > board.length)) {
            //     console.log("invalid len, continue")
            //     continue again;
            // }
            if (direction) { //horizontal (to the left)
                let coords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * (board.length - ship.length))];
                console.log(coords, " ", direction);
                console.log("checking validity");
                //Checks if the whole ship can fit there
                for (let y = 0; y < ship.length; y++) {
                    if (!(board[coords[0]][coords[1] + y] === ".")) {
                        console.log("invalid, continue");
                        continue again;
                    }
                }
                //Removes the validity of squares next to the ship and places the ship itself
                if (coords[1] != 0)
                    board[coords[0]][coords[1] - 1] = "N";
                for (let y = 0; y < ship.length; y++) {
                    if (coords[0] != 0)
                        board[coords[0] - 1][coords[1] + y] = "N";
                    if (coords[0] != 9)
                        board[coords[0] + 1][coords[1] + y] = "N";
                    board[coords[0]][coords[1] + y] = "X";
                }
                if (coords[1] + ship.length < 10)
                    board[coords[0]][coords[1] + ship.length] = "N";
            }
            else { //vertical (downwards)
                let coords = [Math.floor(Math.random() * (board.length - ship.length)), Math.floor(Math.random() * 10)];
                console.log(coords, " ", direction);
                console.log("checking validity");
                //Checks if the whole ship can fit there
                for (let y = 0; y < ship.length; y++) {
                    if (!(board[coords[0] + y][coords[1]] === ".")) {
                        console.log("invalid, continue");
                        continue again;
                    }
                }
                //Removes the validity of squares next to the ship and places the ship itself
                if (coords[0] != 0)
                    board[coords[0] - 1][coords[1]] = "N";
                for (let y = 0; y < ship.length; y++) {
                    if (coords[1] != 0)
                        board[coords[0] + y][coords[1] - 1] = "N";
                    if (coords[1] != 9)
                        board[coords[0] + y][coords[1] + 1] = "N";
                    board[coords[0] + y][coords[1]] = "X";
                }
                if (coords[0] + ship.length < 10)
                    board[coords[0] + ship.length][coords[1]] = "N";
            }
            placed = true;
            console.log("placed " + ship.name);
            for (let x of board) {
                console.log(x.join(" "));
            }
            console.log("\n");
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
buildShip(aircraftCarriers);
buildShip(battleships);
buildShip(cruisers);
buildShip(destroyers);
buildShip(submarines);
let boardClean = board.map(x => x.map(y => y === "N" ? y = "." : y));
for (let x of boardClean) {
    console.log(x.join(" "));
}
// console.log("\n\n")
// for (let x of enemyBoard) {
//     console.log(x.join(" "))
// }
//# sourceMappingURL=index.js.map