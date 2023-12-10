"use strict";
exports.__esModule = true;
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function removeItem(arr, value) {
    var index = arr.findIndex(function (el) { return el.toString() === value.toString(); });
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
//WARNING: If you add an object that isn't a ship, you WILL have to change all code blocks that iterate through the Ships class (AKA the code that checks if a ship was sunk)
var Ships = /** @class */ (function () {
    function Ships() {
        this.placed = 0;
        this.sunken = 0;
        this.iterator = function () {
            var temp = [];
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
    Ships.prototype.place = function (ship, parent) {
        for (var x = 0; x < ship.amount; x++) {
            var placed = false;
            while (!placed) {
                var direction = Math.random() >= 0.5;
                if (direction) { //horizontal (to the right)
                    //Sets valid start coordinates, already condition, so the ship doesn't go out of bounds
                    var startCoords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * (parent.myBoard.length - ship.length))];
                    var coords = [];
                    //Adds the coords of all positions the ship is at
                    for (var y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0], startCoords[1] + y]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(function (x) { return parent.myBoard[x[0]][x[1]] === "."; })) {
                        coords.forEach(function (x) { return parent.myBoard[x[0]][x[1]] = "X"; });
                        //does above and below
                        if (startCoords[0] !== 0)
                            coords.forEach(function (x) { return parent.myBoard[x[0] - 1][x[1]] = "N"; });
                        if (startCoords[0] !== 9)
                            coords.forEach(function (x) { return parent.myBoard[x[0] + 1][x[1]] = "N"; });
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
                    var startCoords = [Math.floor(Math.random() * (parent.myBoard.length - ship.length)), Math.floor(Math.random() * 10)];
                    var coords = [];
                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (var y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0] + y, startCoords[1]]);
                    }
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(function (x) { return parent.myBoard[x[0]][x[1]] === "."; })) {
                        coords.forEach(function (x) { return parent.myBoard[x[0]][x[1]] = "X"; });
                        //does left and right
                        if (startCoords[1] !== 0)
                            coords.forEach(function (x) { return parent.myBoard[x[0]][x[1] - 1] = "N"; });
                        if (startCoords[1] !== 9)
                            coords.forEach(function (x) { return parent.myBoard[x[0]][x[1] + 1] = "N"; });
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
    };
    return Ships;
}());
var Attack = /** @class */ (function () {
    function Attack(parent) {
        this.possibleTargets = [];
        for (var x in parent.opponentBoard) {
            for (var y in parent.opponentBoard[x]) {
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
    //firstShot also checks the validity and changes direction before calling secondShot, so checking shot validity in secondShot isn't needed
    Attack.prototype.firstShot = function (parent) {
        var _this = this;
        var shot;
        shot = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", function (input) {
            var answer = input.split(", ");
            if (answer[0] === "hit") {
                _this.successfulHits = 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    _this.successfulHits = 0;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    _this.successfulHits = 0;
                    if (shot[0] !== 9)
                        parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    removeItem(_this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] - 1]);
                    return _this.firstShot(parent);
                }
                else {
                    _this.shipFound = true;
                    _this.firstHit = shot;
                    if (shot[0] > 0 && parent.opponentBoard[shot[0] - 1][shot[1]] === ".") {
                        _this.shootingDirection = [false, false];
                        return _this.secondShot(parent);
                    }
                    else if (shot[0] < 9 && parent.opponentBoard[shot[0] + 1][shot[1]] === ".") {
                        _this.shootingDirection = [false, true];
                        return _this.secondShot(parent);
                    }
                    else if (shot[1] > 0 && parent.opponentBoard[shot[0]][shot[1] - 1] === ".") {
                        _this.shootingDirection = [true, false];
                        return _this.secondShot(parent);
                    }
                    else if (shot[1] < 9 && parent.opponentBoard[shot[0]][shot[1] + 1] === ".") {
                        _this.shootingDirection = [true, true];
                        return _this.secondShot(parent);
                    }
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                return parent.opponentTurn();
            }
        });
    };
    //secondShot also checks the validity and changes direction before calling latterShot, so checking shot validity in latterShot isn't needed
    Attack.prototype.secondShot = function (parent) {
        var _this = this;
        var shot = [];
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
        if (this.possibleTargets.findIndex(function (el) { return el.toString() === shot.toString(); }) === -1) {
            // console.log(this.possibleTargets);
            // console.log(shot)
            // console.log("What the fuck");
            shot = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
        }
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", function (input) {
            var answer = input.split(", ");
            if (answer[0] === "hit") {
                _this.successfulHits += 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    //reset variables just for the sake of it
                    _this.successfulHits = 0;
                    _this.shipFound = false;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    _this.successfulHits = 0;
                    _this.shipFound = false;
                    if (shot[0] !== 9)
                        parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    if (_this.firstHit[0] !== 0)
                        parent.opponentBoard[_this.firstHit[0] - 1][_this.firstHit[1]] = "N";
                    if (_this.firstHit[0] !== 9)
                        parent.opponentBoard[_this.firstHit[0] + 1][_this.firstHit[1]] = "N";
                    if (_this.firstHit[1] !== 0)
                        parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] - 1] = "N";
                    if (_this.firstHit[1] !== 9)
                        parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] + 1] = "N";
                    removeItem(_this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] - 1]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0] + 1, _this.firstHit[1]]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0] - 1, _this.firstHit[1]]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] + 1]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] - 1]);
                    return _this.firstShot(parent);
                }
                else {
                    _this.shipDirectionKnown = true;
                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (_this.shootingDirection[0]) { // horizontal
                        if (shot[0] !== 0)
                            parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                        if (shot[0] !== 9)
                            parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                        if (_this.firstHit[0] !== 0)
                            parent.opponentBoard[_this.firstHit[0] - 1][_this.firstHit[1]] = "N";
                        if (_this.firstHit[0] !== 9)
                            parent.opponentBoard[_this.firstHit[0] + 1][_this.firstHit[1]] = "N";
                        // console.log([shot[0]+1, shot[1]])
                        removeItem(_this.possibleTargets, [shot[0] + 1, shot[1]]);
                        removeItem(_this.possibleTargets, [shot[0] - 1, shot[1]]);
                        removeItem(_this.possibleTargets, [_this.firstHit[0] + 1, _this.firstHit[1]]);
                        removeItem(_this.possibleTargets, [_this.firstHit[0] - 1, _this.firstHit[1]]);
                        if (_this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || parent.opponentBoard[shot[0]][shot[1] + 1] !== ".") {
                                _this.shootingDirection[1] = false;
                                _this.successfulHits = 1;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || parent.opponentBoard[shot[0]][shot[1] - 1] !== ".") {
                                _this.shootingDirection[1] = true;
                                _this.successfulHits = 1;
                            }
                        }
                    }
                    else { // vertical
                        if (shot[1] !== 9)
                            parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                        if (shot[1] !== 0)
                            parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                        if (_this.firstHit[1] !== 9)
                            parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] + 1] = "N";
                        if (_this.firstHit[1] !== 0)
                            parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] - 1] = "N";
                        removeItem(_this.possibleTargets, [shot[0], shot[1] + 1]);
                        removeItem(_this.possibleTargets, [shot[0], shot[1] - 1]);
                        removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] + 1]);
                        removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] - 1]);
                        if (_this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || parent.opponentBoard[shot[0] + 1][shot[1]] !== ".") {
                                _this.shootingDirection[1] = false;
                                _this.successfulHits = 1;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || parent.opponentBoard[shot[0] - 1][shot[1]] !== ".") {
                                _this.shootingDirection[1] = true;
                                _this.successfulHits = 1;
                            }
                        }
                    }
                    return _this.latterShot(parent);
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                if (_this.firstHit[0] > 0 && parent.opponentBoard[_this.firstHit[0] - 1][_this.firstHit[1]] === ".") {
                    _this.shootingDirection = [false, false];
                }
                else if (_this.firstHit[0] < 9 && parent.opponentBoard[_this.firstHit[0] + 1][_this.firstHit[1]] === ".") {
                    _this.shootingDirection = [false, true];
                }
                else if (_this.firstHit[1] > 0 && parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] - 1] === ".") {
                    _this.shootingDirection = [true, false];
                }
                else if (_this.firstHit[1] < 9 && parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] + 1] === ".") {
                    _this.shootingDirection = [true, true];
                }
                //Shouldn't be possible, but commenting out the console.log(), so I don't auto lose
                else {
                    _this.shipFound = false;
                } //console.log("What the fuck"); }
                return parent.opponentTurn();
            }
        });
    };
    Attack.prototype.latterShot = function (parent) {
        var _this = this;
        var shot = [];
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
        //shouldn't be possible, but here we are again, commenting it out
        if (this.possibleTargets.findIndex(function (el) { return el.toString() === shot.toString(); }) === -1) {
            // console.log("What the fuck");
            shot = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];
        }
        removeItem(this.possibleTargets, shot);
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", function (input) {
            var answer = input.split(", ");
            if (answer[0] === "hit") {
                _this.successfulHits += 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                // for (let x of parent.opponentBoard) {
                //     console.log(x.join(" "))
                // }
                if (answer[answer.length - 1] === "end") {
                    //reset variables just for the sake of it
                    _this.successfulHits = 0;
                    _this.shipFound = false;
                    _this.shipDirectionKnown = false;
                    return;
                }
                else if (answer[answer.length - 1] === "sunk") {
                    _this.successfulHits = 0;
                    _this.shipFound = false;
                    _this.shipDirectionKnown = false;
                    if (shot[0] !== 9)
                        parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                    if (shot[0] !== 0)
                        parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                    if (shot[1] !== 9)
                        parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                    if (shot[1] !== 0)
                        parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                    if (_this.firstHit[0] !== 0)
                        parent.opponentBoard[_this.firstHit[0] - 1][_this.firstHit[1]] = "N";
                    if (_this.firstHit[0] !== 9)
                        parent.opponentBoard[_this.firstHit[0] + 1][_this.firstHit[1]] = "N";
                    if (_this.firstHit[1] !== 0)
                        parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] - 1] = "N";
                    if (_this.firstHit[1] !== 9)
                        parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] + 1] = "N";
                    removeItem(_this.possibleTargets, [shot[0] + 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0] - 1, shot[1]]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] + 1]);
                    removeItem(_this.possibleTargets, [shot[0], shot[1] - 1]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0] + 1, _this.firstHit[1]]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0] - 1, _this.firstHit[1]]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] + 1]);
                    removeItem(_this.possibleTargets, [_this.firstHit[0], _this.firstHit[1] - 1]);
                    return _this.firstShot(parent);
                }
                else {
                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (_this.shootingDirection[0]) { // horizontal
                        if (shot[0] !== 9)
                            parent.opponentBoard[shot[0] + 1][shot[1]] = "N";
                        if (shot[0] !== 0)
                            parent.opponentBoard[shot[0] - 1][shot[1]] = "N";
                        removeItem(_this.possibleTargets, [shot[0] + 1, shot[1]]);
                        removeItem(_this.possibleTargets, [shot[0] - 1, shot[1]]);
                        if (_this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || parent.opponentBoard[shot[0]][shot[1] + 1] !== ".") {
                                _this.shootingDirection[1] = false;
                                _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || parent.opponentBoard[shot[0]][shot[1] - 1] !== ".") {
                                _this.shootingDirection[1] = true;
                                _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                            }
                        }
                    }
                    else { // vertical
                        if (shot[1] !== 9)
                            parent.opponentBoard[shot[0]][shot[1] + 1] = "N";
                        if (shot[1] !== 0)
                            parent.opponentBoard[shot[0]][shot[1] - 1] = "N";
                        removeItem(_this.possibleTargets, [shot[0], shot[1] + 1]);
                        removeItem(_this.possibleTargets, [shot[0], shot[1] - 1]);
                        if (_this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || parent.opponentBoard[shot[0] + 1][shot[1]] !== ".") {
                                _this.shootingDirection[1] = false;
                                _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || parent.opponentBoard[shot[0] - 1][shot[1]] !== ".") {
                                _this.shootingDirection[1] = true;
                                _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                            }
                        }
                    }
                    return _this.latterShot(parent);
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                //switches direction and also cheks if at the board border or if the next shot in that direction is not valid
                if (_this.shootingDirection[0]) { // horizontal
                    if (_this.shootingDirection[1]) { // right
                        _this.shootingDirection[1] = false;
                        _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                        //How many of these are there
                        if (_this.firstHit[1] === 0 || parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] - 1] !== ".") {
                            // console.log("What the fuck");
                            _this.successfulHits = 0;
                            _this.shipFound = false;
                            _this.shipDirectionKnown = false;
                        }
                    }
                    else { // left
                        _this.shootingDirection[1] = true;
                        _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                        //Don't tell me that they are at every direction...
                        if (_this.firstHit[1] === 9 || parent.opponentBoard[_this.firstHit[0]][_this.firstHit[1] + 1] !== ".") {
                            // console.log("What the fuck");
                            _this.successfulHits = 0;
                            _this.shipFound = false;
                            _this.shipDirectionKnown = false;
                        }
                    }
                }
                else { // vertical
                    if (_this.shootingDirection[1]) { // down
                        _this.shootingDirection[1] = false;
                        _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                        //Oh well then
                        if (_this.firstHit[0] === 0 || parent.opponentBoard[_this.firstHit[0] - 1][_this.firstHit[1]] !== ".") {
                            // console.log("What the fuck");
                            _this.successfulHits = 0;
                            _this.shipFound = false;
                            _this.shipDirectionKnown = false;
                        }
                    }
                    else { // up
                        _this.shootingDirection[1] = true;
                        _this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                        //...
                        if (_this.firstHit[0] === 9 || parent.opponentBoard[_this.firstHit[0] + 1][_this.firstHit[1]] !== ".") {
                            // console.log("What the fuck");
                            _this.successfulHits = 0;
                            _this.shipFound = false;
                            _this.shipDirectionKnown = false;
                        }
                    }
                }
                return parent.opponentTurn();
            }
        });
    };
    return Attack;
}());
var Game = /** @class */ (function () {
    function Game() {
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
    Game.prototype.start = function () {
        var _this = this;
        this.ships.place(this.ships.submarines, this);
        this.ships.place(this.ships.destroyers, this);
        this.ships.place(this.ships.cruisers, this);
        this.ships.place(this.ships.battleships, this);
        this.ships.place(this.ships.aircraftCarriers, this);
        this.myBoard = this.myBoard.map(function (x) { return x.map(function (y) { return y === "N" ? y = "." : y; }); });
        // for (let x of this.myBoard) {
        //     console.log(x.join(" "));
        // }
        rl.question("", function (a) { return a === "1" ? _this.myTurn() : _this.opponentTurn(); });
    };
    Game.prototype.myTurn = function () {
        // for (let x of this.opponentBoard) {
        //     console.log(x.join(" "));
        // }
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
    };
    Game.prototype.opponentTurn = function () {
        var _this = this;
        // for (let x of this.myBoard) {
        //     console.log(x.join(" "))
        // }
        rl.question("", function (input) {
            var answer = input;
            var coordinates = [rows.indexOf(answer[0]), parseInt(answer.slice(1)) - 1];
            if (_this.myBoard[coordinates[0]][coordinates[1]] !== "X") {
                rl.write("miss\n");
                if (_this.myBoard[coordinates[0]][coordinates[1]] !== "H") {
                    _this.myBoard[coordinates[0]][coordinates[1]] = "O";
                }
                return _this.myTurn();
            }
            else if (_this.myBoard[coordinates[0]][coordinates[1]] === "X") {
                _this.myBoard[coordinates[0]][coordinates[1]] = "H";
                //Needs to get rid of the ship coord array that was sunk
                for (var _i = 0, _a = _this.ships.iterator(); _i < _a.length; _i++) {
                    var i = _a[_i];
                    for (var j in i.coords) {
                        if (i.coords[j].every(function (el) { return _this.myBoard[el[0]][el[1]] === "H"; })) {
                            i.coords.splice(j, 1);
                            _this.ships.sunken++;
                            if (_this.ships.sunken === _this.ships.placed) {
                                return rl.write("hit, sunk, end\n");
                            }
                            rl.write("hit, sunk\n");
                            return _this.opponentTurn();
                        }
                    }
                }
                // if last ship sunk - hit, sunk, end
                rl.write("hit\n");
                return _this.opponentTurn();
            }
        });
    };
    return Game;
}());
var m = new Game();
var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
m.start();
