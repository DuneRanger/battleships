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
    const index = arr.findIndex((el) => el.toString() === value.toString());
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
//WARNING: If you add an object that isn't a ship, you WILL have to change all code blocks that iterate through the Ships class (AKA the code that checks if a ship was sunk)
class Ships {
    constructor() {
        this.placed = 7;
        this.sunken = 0;
        this.iterator = function () {
            let temp = [];
            for (var name in this) {
                if (this.hasOwnProperty(name) && typeof this[name] === "object") {
                    temp.push(this[name]);
                }
            }
            return temp;
        };
        this.submarines = {
            length: 1,
            amount: 1,
            coords: [[[2, 9]]]
        };
        this.destroyers = {
            length: 2,
            amount: 2,
            coords: [[[8, 9], [7, 9]], [[5, 9], [4, 9]]]
        };
        this.cruisers = {
            length: 3,
            amount: 2,
            coords: [[[9, 2], [9, 3], [9, 4]], [[9, 6], [9, 7], [9, 8]]]
        };
        this.battleships = {
            length: 4,
            amount: 1,
            coords: [[[6, 0], [7, 0], [8, 0], [9, 0]]]
        };
        this.aircraftCarriers = {
            length: 5,
            amount: 1,
            coords: [[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]]
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
                        this.placed++;
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
                        this.placed++;
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
        this.hitsOnShip = 0;
        this.opponentsShips = [1, 2, 2, 3, 3, 4, 5];
        this.parent = parent;
    }
    //firstShot also checks the validity and changes direction before calling secondShot, so checking shot validity in secondShot isn't needed
    firstShot() {
        let shot;
        shot = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer = input.split(", ");
            if (answer[0] === "hit") {
                this.successfulHits = 1;
                this.hitsOnShip = 1;
                this.parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of this.parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    if (shot[0] !== 9)
                        this.parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        this.parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        this.parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        this.parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    removeItem(this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] - 1]);
                    this.combThroughShots();
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    return this.firstShot();
                }
                else {
                    this.shipFound = true;
                    this.firstHit = shot;
                    if (shot[0] > 0 && this.parent.opponentBoard[shot[0] - 1][shot[1]] === ".") {
                        this.shootingDirection = [false, false];
                        return this.secondShot();
                    }
                    else if (shot[0] < 9 && this.parent.opponentBoard[shot[0] + 1][shot[1]] === ".") {
                        this.shootingDirection = [false, true];
                        return this.secondShot();
                    }
                    else if (shot[1] > 0 && this.parent.opponentBoard[shot[0]][shot[1] - 1] === ".") {
                        this.shootingDirection = [true, false];
                        return this.secondShot();
                    }
                    else if (shot[1] < 9 && this.parent.opponentBoard[shot[0]][shot[1] + 1] === ".") {
                        this.shootingDirection = [true, true];
                        return this.secondShot();
                    }
                }
            }
            else if (answer[0] === "miss") {
                this.parent.opponentBoard[shot[0]][shot[1]] = "O";
                return this.parent.opponentTurn();
            }
        });
    }
    //secondShot also checks the validity and changes direction before calling latterShot, so checking shot validity in latterShot isn't needed
    secondShot() {
        let shot = [];
        //Figures out where to shoot
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
        //This shouldn't be possible, but I let the program continue just so it doesn't crash and lose
        // if (this.possibleTargets.findIndex((el) => el.toString() === shot.toString()) === -1) {
        //     // console.log(this.possibleTargets);
        //     // console.log(shot)
        //     // console.log("What the fuck");
        //     shot = this.possibleTargets[Math.floor(Math.random()*this.possibleTargets.length)]
        // }
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer = input.split(", ");
            if (answer[0] === "hit") {
                this.successfulHits += 1;
                this.hitsOnShip += 1;
                this.parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of this.parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    //reset variables just for the sake of it
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    this.shipFound = false;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    if (shot[0] !== 9)
                        this.parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        this.parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        this.parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        this.parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    if (this.firstHit[0] !== 0)
                        this.parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] = "N";
                    if (this.firstHit[0] !== 9)
                        this.parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] = "N";
                    if (this.firstHit[1] !== 0)
                        this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] = "N";
                    if (this.firstHit[1] !== 9)
                        this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] = "N";
                    removeItem(this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] - 1]);
                    removeItem(this.possibleTargets, [this.firstHit[0] + 1, this.firstHit[1]]);
                    removeItem(this.possibleTargets, [this.firstHit[0] - 1, this.firstHit[1]]);
                    removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] + 1]);
                    removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] - 1]);
                    this.combThroughShots();
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    this.shipFound = false;
                    return this.firstShot();
                }
                else {
                    this.shipDirectionKnown = true;
                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (this.shootingDirection[0]) { // horizontal
                        if (shot[0] !== 0)
                            this.parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                        if (shot[0] !== 9)
                            this.parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                        if (this.firstHit[0] !== 0)
                            this.parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] = "N";
                        if (this.firstHit[0] !== 9)
                            this.parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] = "N";
                        // console.log([shot[0]+1, shot[1]])
                        removeItem(this.possibleTargets, [shot[0] + 1, shot[1]]);
                        removeItem(this.possibleTargets, [shot[0] - 1, shot[1]]);
                        removeItem(this.possibleTargets, [this.firstHit[0] + 1, this.firstHit[1]]);
                        removeItem(this.possibleTargets, [this.firstHit[0] - 1, this.firstHit[1]]);
                        if (this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || this.parent.opponentBoard[shot[0]][shot[1] + 1] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || this.parent.opponentBoard[shot[0]][shot[1] - 1] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1;
                            }
                        }
                    }
                    else { // vertical
                        if (shot[1] !== 9)
                            this.parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                        if (shot[1] !== 0)
                            this.parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                        if (this.firstHit[1] !== 9)
                            this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] = "N";
                        if (this.firstHit[1] !== 0)
                            this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] = "N";
                        removeItem(this.possibleTargets, [shot[0], shot[1] + 1]);
                        removeItem(this.possibleTargets, [shot[0], shot[1] - 1]);
                        removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] + 1]);
                        removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] - 1]);
                        if (this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || this.parent.opponentBoard[shot[0] + 1][shot[1]] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || this.parent.opponentBoard[shot[0] - 1][shot[1]] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1;
                            }
                        }
                    }
                    return this.latterShot();
                }
            }
            else if (answer[0] === "miss") {
                this.parent.opponentBoard[shot[0]][shot[1]] = "O";
                if (this.firstHit[0] > 0 && this.parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] === ".") {
                    this.shootingDirection = [false, false];
                }
                else if (this.firstHit[0] < 9 && this.parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] === ".") {
                    this.shootingDirection = [false, true];
                }
                else if (this.firstHit[1] > 0 && this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] === ".") {
                    this.shootingDirection = [true, false];
                }
                else if (this.firstHit[1] < 9 && this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] === ".") {
                    this.shootingDirection = [true, true];
                }
                //Shouldn't be possible, but commenting out the console.log(), so I don't auto lose
                else {
                    this.shipFound = false;
                } //console.log("What the fuck"); }
                return this.parent.opponentTurn();
            }
        });
    }
    latterShot() {
        let shot = [];
        //Figures out where to shoot
        if (this.shootingDirection[0]) { // horizontal
            if (this.shootingDirection[1]) { // right
                shot = [this.firstHit[0], this.firstHit[1] + this.successfulHits];
            }
            else { // left
                shot = [this.firstHit[0], this.firstHit[1] - this.successfulHits];
            }
        }
        else { // vertical
            if (this.shootingDirection[1]) { // down
                shot = [this.firstHit[0] + this.successfulHits, this.firstHit[1]];
            }
            else { // up
                shot = [this.firstHit[0] - this.successfulHits, this.firstHit[1]];
            }
        }
        // //shouldn't be possible, but here we are again, commenting it out
        // if (this.possibleTargets.findIndex((el) => el.toString() === shot.toString()) === -1) {
        //     // console.log("What the fuck");
        //     shot = this.possibleTargets[Math.floor(Math.random()*this.possibleTargets.length)]
        // }
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer = input.split(", ");
            if (answer[0] === "hit") {
                this.successfulHits += 1;
                this.hitsOnShip += 1;
                this.parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of this.parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    //reset variables just for the sake of it
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    this.shipFound = false;
                    this.shipDirectionKnown = false;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    if (shot[0] !== 9)
                        this.parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        this.parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        this.parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        this.parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    if (this.firstHit[0] !== 0)
                        this.parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] = "N";
                    if (this.firstHit[0] !== 9)
                        this.parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] = "N";
                    if (this.firstHit[1] !== 0)
                        this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] = "N";
                    if (this.firstHit[1] !== 9)
                        this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] = "N";
                    removeItem(this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(this.possibleTargets, [shot[0], shot[1] - 1]);
                    removeItem(this.possibleTargets, [this.firstHit[0] + 1, this.firstHit[1]]);
                    removeItem(this.possibleTargets, [this.firstHit[0] - 1, this.firstHit[1]]);
                    removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] + 1]);
                    removeItem(this.possibleTargets, [this.firstHit[0], this.firstHit[1] - 1]);
                    this.combThroughShots();
                    this.successfulHits = 0;
                    this.hitsOnShip = 0;
                    this.shipFound = false;
                    this.shipDirectionKnown = false;
                    return this.firstShot();
                }
                else {
                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (this.shootingDirection[0]) { // horizontal
                        if (shot[0] !== 9)
                            this.parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                        if (shot[0] !== 0)
                            this.parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                        removeItem(this.possibleTargets, [shot[0] + 1, shot[1]]);
                        removeItem(this.possibleTargets, [shot[0] - 1, shot[1]]);
                        if (this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || this.parent.opponentBoard[shot[0]][shot[1] + 1] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || this.parent.opponentBoard[shot[0]][shot[1] - 1] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                            }
                        }
                    }
                    else { // vertical
                        if (shot[1] !== 9)
                            this.parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                        if (shot[1] !== 0)
                            this.parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                        removeItem(this.possibleTargets, [shot[0], shot[1] + 1]);
                        removeItem(this.possibleTargets, [shot[0], shot[1] - 1]);
                        if (this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || this.parent.opponentBoard[shot[0] + 1][shot[1]] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || this.parent.opponentBoard[shot[0] - 1][shot[1]] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                            }
                        }
                    }
                    return this.latterShot();
                }
            }
            else if (answer[0] === "miss") {
                this.parent.opponentBoard[shot[0]][shot[1]] = "O";
                //switches direction and also cheks if at the board border or if the next shot in that direction is not valid
                if (this.shootingDirection[0]) { // horizontal
                    if (this.shootingDirection[1]) { // right
                        this.shootingDirection[1] = false;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                        //How many of these are there
                        if (this.firstHit[1] === 0 || this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] - 1] !== ".") {
                            // console.log("What the fuck");
                            this.successfulHits = 0;
                            this.hitsOnShip = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                    else { // left
                        this.shootingDirection[1] = true;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                        //Don't tell me that they are at every direction...
                        if (this.firstHit[1] === 9 || this.parent.opponentBoard[this.firstHit[0]][this.firstHit[1] + 1] !== ".") {
                            // console.log("What the fuck");
                            this.successfulHits = 0;
                            this.hitsOnShip = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                }
                else { // vertical
                    if (this.shootingDirection[1]) { // down
                        this.shootingDirection[1] = false;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                        //Oh well then
                        if (this.firstHit[0] === 0 || this.parent.opponentBoard[this.firstHit[0] - 1][this.firstHit[1]] !== ".") {
                            // console.log("What the fuck");
                            this.successfulHits = 0;
                            this.hitsOnShip = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                    else { // up
                        this.shootingDirection[1] = true;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                        //...
                        if (this.firstHit[0] === 9 || this.parent.opponentBoard[this.firstHit[0] + 1][this.firstHit[1]] !== ".") {
                            // console.log("What the fuck");
                            this.successfulHits = 0;
                            this.hitsOnShip = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                }
                return this.parent.opponentTurn();
            }
        });
    }
    //Tries placing the opponents shortest ship to see if there are any coordinates that don't need to be checked by shooting
    combThroughShots() {
        //Gets rid of the sunken ship by length
        this.opponentsShips.splice(this.opponentsShips.indexOf(this.hitsOnShip), 1);
        if (this.opponentsShips[0] === 1)
            return;
        else {
            let shortest = this.opponentsShips[0];
            let coordsToCheck = [...this.possibleTargets];
            let copyArr = [...coordsToCheck];
            for (let startCoords of copyArr) {
                //Starts of with horizontal placement
                if (startCoords[1] + shortest > this.parent.opponentBoard.length) {
                    // let difference: number = startCoords[1] + shortest - this.parent.opponentBoard.length
                    // if (this.parent.opponentBoard[startCoords[0]][startCoords[1]-difference] === ".") {
                    //     removeItem(coordsToCheck, startCoords)
                    // continue
                    // }
                }
                else {
                    let coords = [];
                    //Adds the coords of all positions the ship is at
                    for (let y = 0; y < shortest; y++) {
                        coords.push([startCoords[0], startCoords[1] + y]);
                    }
                    if (coords.every(x => this.parent.opponentBoard[x[0]][x[1]] === ".")) {
                        // console.log(coords)
                        coords.forEach(x => removeItem(coordsToCheck, x));
                    }
                }
                //Now also check for vertical placement
                if (startCoords[0] + shortest > this.parent.opponentBoard.length) {
                    // let difference: number = startCoords[0] + shortest - this.parent.opponentBoard.length
                    // if (this.parent.opponentBoard[startCoords[0]-difference][startCoords[1]] === ".") {
                    //     removeItem(coordsToCheck, startCoords)
                    // continue
                    // }
                }
                else {
                    let coords = [];
                    //Adds the coords of all positions the ship is at
                    for (let y = 0; y < shortest; y++) {
                        coords.push([startCoords[0] + y, startCoords[1]]);
                    }
                    if (coords.every(x => this.parent.opponentBoard[x[0]][x[1]] === ".")) {
                        // console.log(coords)
                        coords.forEach(x => removeItem(coordsToCheck, x));
                    }
                }
            }
            // console.log(coordsToCheck)
            for (let x of coordsToCheck) {
                this.parent.opponentBoard[x[0]][x[1]] = "N";
                removeItem(this.possibleTargets, x);
            }
            // for (let x of this.parent.opponentBoard) {
            //     console.log(x.join(" "))
            // }
        }
    }
}
class Game {
    constructor() {
        this.myBoard = [
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "X"],
            [".", ".", ".", ".", ".", ".", ".", ".", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "X"],
            ["X", ".", "X", "X", "X", ".", "X", "X", "X", "."]
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
        // this.ships.place(this.ships.submarines, this);
        // this.ships.place(this.ships.destroyers, this);
        // this.ships.place(this.ships.cruisers, this);
        // this.ships.place(this.ships.battleships, this);
        // this.ships.place(this.ships.aircraftCarriers, this);
        this.myBoard = this.myBoard.map(x => x.map(y => y === "N" ? y = "." : y));
        // for (let x of this.myBoard) {
        //     console.log(x.join(" "));
        // }
        rl.question("", (a) => a === "1" ? this.myTurn() : this.opponentTurn());
    }
    myTurn() {
        // for (let x of this.opponentBoard) {
        //     console.log(x.join(" "));
        // }
        if (this.attack.shipFound) {
            if (this.attack.shipDirectionKnown) {
                this.attack.latterShot();
            }
            else {
                this.attack.secondShot();
            }
        }
        else {
            this.attack.firstShot();
        }
    }
    opponentTurn() {
        // for (let x of this.myBoard) {
        //     console.log(x.join(" "))
        // }
        rl.question("", (input) => {
            let answer = input;
            let coordinates = [rows.indexOf(answer[0]), parseInt(answer.slice(1)) - 1];
            if (this.myBoard[coordinates[0]][coordinates[1]] !== "X") {
                rl.write("miss\n");
                if (this.myBoard[coordinates[0]][coordinates[1]] !== "H") {
                    this.myBoard[coordinates[0]][coordinates[1]] = "O";
                }
                return this.myTurn();
            }
            else if (this.myBoard[coordinates[0]][coordinates[1]] === "X") {
                this.myBoard[coordinates[0]][coordinates[1]] = "H";
                //Needs to get rid of the ship coord array that was sunk
                for (let i of this.ships.iterator()) {
                    for (let j in i.coords) {
                        if (i.coords[j].every((el) => this.myBoard[el[0]][el[1]] === "H")) {
                            i.coords.splice(j, 1);
                            this.ships.sunken++;
                            if (this.ships.sunken === this.ships.placed) {
                                return rl.write("hit, sunk, end\n");
                            }
                            rl.write("hit, sunk\n");
                            return this.opponentTurn();
                        }
                    }
                }
                // if last ship sunk - hit, sunk, end
                rl.write("hit\n");
                return this.opponentTurn();
            }
        });
    }
}
let m = new Game();
let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
m.start();
//# sourceMappingURL=mainV3.js.map