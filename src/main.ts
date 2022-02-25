import * as readline from "readline";
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function removeItem(arr: any[], value: any): any[] { 
    const index = arr.findIndex((el) => el.toString() === value.toString());
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

//All ships have a width of 1 (eg. 1x1, 1x3, 1x5)
//WARNING: If you add an object that isn't a ship, you WILL have to change all code blocks that iterate through the Ships class (AKA the code that checks if a ship was sunk)
class Ships {
    submarines: {length: number, amount: number, coords: number[][][]};
    destroyers: {length: number, amount: number, coords: number[][][]};
    cruisers: {length: number, amount: number, coords: number[][][]};
    battleships: {length: number, amount: number, coords: number[][][]};
    aircraftCarriers: {length: number, amount: number, coords: number[][][]};
    placed: number;
    sunken: number;
    iterator: Function;
   
    constructor() {
        this.placed = 0;
        this.sunken = 0;
        this.iterator = function() {
            for (var name in this){
                if (this.hasOwnProperty(name) && typeof this[name] === "object") {
                    console.log(name + "=" + this[name]);
                }
            }
        }
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

    place(ship: {length: number, amount: number, coords: number[][][]}, parent: any) {
        for (let x = 0; x < ship.amount; x++) {
            let placed: boolean = false;
            
            while (!placed) {
                
                let direction: boolean = Math.random() >= 0.5;
                if (direction){ //horizontal (to the right)
                    
                    //Sets valid start coordinates, already condition, so the ship doesn't go out of bounds
                    let startCoords: number[] = [Math.floor(Math.random()*10), Math.floor(Math.random()*(parent.myBoard.length-ship.length))];
                    let coords: number[][] = [];
                    
                    //Adds the coords of all positions the ship is at
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0], startCoords[1]+y])
                    }
                    
                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => parent.myBoard[x[0]][x[1]] === ".")) {
                        coords.forEach(x => parent.myBoard[x[0]][x[1]] = "X")
                        
                        //does above and below
                        if (startCoords[0] !== 0) coords.forEach(x => parent.myBoard[x[0]-1][x[1]] = "N");
                        if (startCoords[0] !== 9) coords.forEach(x => parent.myBoard[x[0]+1][x[1]] = "N");
                        //does left and right
                        if (startCoords[1] !== 0) parent.myBoard[startCoords[0]][startCoords[1]-1] = "N";
                        if (startCoords[1]+ship.length < 10) parent.myBoard[startCoords[0]][startCoords[1]+ship.length] = "N";
                        
                        placed = true;
                        ship.coords.push(coords)
                    }
                }
                else { //vertical (downwards)
                    
                    //Sets valid start coordinates, so the ship doesn't go out of bounds
                    let startCoords: number[] = [Math.floor(Math.random()*(parent.myBoard.length-ship.length)), Math.floor(Math.random()*10)];
                    let coords: number[][] = [];

                    //Checks if the whole ship can fit there and it doesn't intrude near other ships
                    for (let y = 0; y < ship.length; y++) {
                        coords.push([startCoords[0]+y, startCoords[1]])
                    }

                    //Actually places the ships and invalidates the positions directly touching the ship
                    if (coords.every(x => parent.myBoard[x[0]][x[1]] === ".")) {
                        coords.forEach(x => parent.myBoard[x[0]][x[1]] = "X")
                        
                        //does left and right
                        if (startCoords[1] !== 0) coords.forEach(x => parent.myBoard[x[0]][x[1]-1] = "N");
                        if (startCoords[1] !== 9) coords.forEach(x => parent.myBoard[x[0]][x[1]+1] = "N");
                        //does above and below
                        if (startCoords[0] !== 0) parent.myBoard[startCoords[0]-1][startCoords[1]] = "N";
                        if (startCoords[0]+ship.length < 10) parent.myBoard[startCoords[0]+ship.length][startCoords[1]] = "N";
                        
                        placed = true;
                        ship.coords.push(coords)
                    }
                }
            }
        }
    }
}

class Attack {
    possibleTargets: number[][]; //Array of possible coordinates to shoot at
    shootingDirection: boolean[]; //first bool defines 2d axis, the second bool defines the direction
                                //false, false is vertical, up | true, true is horizontal right
    shipFound: boolean; //determines if we have found a ship to shoot at
    shipDirectionKnown: boolean; //determines if the ship we haven't sunk yet is vertical or horizontal
    firstHit: number[]; //saves the coordinates of where we first found the ship we are currently attacking
    successfulHits: number; //saves how many times we successfully hit the ship we are looking for, in a single direction

    constructor(parent: any) {
        this.possibleTargets = [];
        for (let x in parent.opponentBoard) {
            for (let y in parent.opponentBoard[x]) {
                if (parent.opponentBoard[x][y] === ".") this.possibleTargets.push([parseInt(x), parseInt(y)]);
            }
        }
        this.shootingDirection = [false, false]; //vertical up
        this.shipFound = false;
        this.shipDirectionKnown = false;
        this.firstHit = [];
        this.successfulHits = 0;
    }

    //firstShot also checks the validity and changes direction before calling secondShot, so checking shot validity in secondShot isn't needed
    firstShot(parent: any) {
        let shot: number[];
        shot = this.possibleTargets[Math.floor(Math.random()*this.possibleTargets.length)];
        removeItem(this.possibleTargets, shot);
        
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer: string[] = input.split(", ");
            
            if (answer[0] === "hit") {
                this.successfulHits = 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                if (answer[answer.length-1] === "end") {
                    this.successfulHits = 0;
                    return
                }
                else if (answer[answer.length-1] === "sunk") {
                    this.successfulHits = 0;
                    return this.firstShot(parent);
                }
                else {
                    this.shipFound = true;
                    this.firstHit = shot;
                    if (shot[0] > 0 && parent.opponentBoard[shot[0]-1][shot[1]] === ".") { this.shootingDirection = [false, false]; return this.secondShot(parent); }
                    else if (shot[0] < 9 && parent.opponentBoard[shot[0]+1][shot[1]] === ".") { this.shootingDirection = [false, true]; return this.secondShot(parent); }
                    else if (shot[1] > 0 && parent.opponentBoard[shot[0]][shot[1]-1] === ".") { this.shootingDirection = [true, false]; return this.secondShot(parent); }
                    else if (shot[1] < 9 && parent.opponentBoard[shot[0]][shot[1]+1] === ".") { this.shootingDirection = [true, true]; return this.secondShot(parent); }
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O"
                return parent.opponentTurn();
            }
        })
    }

    //secondShot also checks the validity and changes direction before calling latterShot, so checking shot validity in latterShot isn't needed
    secondShot(parent: any) {
        let shot: number[] = [];

                //Figures out where to shoot
        if (this.shootingDirection[0]) { // horizontal
            if (this.shootingDirection[1]) { // right
                shot = [this.firstHit[0], this.firstHit[1]+1];
            }
            else { // left
                shot = [this.firstHit[0], this.firstHit[1]-1];
            }
        }
        else { // vertical
            if (this.shootingDirection[1]) { // down
                shot = [this.firstHit[0]+1, this.firstHit[1]];
            }
            else { // up
                shot = [this.firstHit[0]-1, this.firstHit[1]];
            }
        }

        if (this.possibleTargets.findIndex((el) => el.toString() === shot.toString()) === -1) {
            console.log(this.possibleTargets);
            console.log(shot)
            console.log("What the fuck");
            shot = this.possibleTargets[Math.floor(Math.random()*this.possibleTargets.length)]
        }
        removeItem(this.possibleTargets, shot);
        
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer: string[] = input.split(", ");
            
            if (answer[0] === "hit") {
                this.successfulHits += 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                if (answer[answer.length-1] === "end") {
                    //reset variables just for the sake of it
                    this.successfulHits = 0;
                    this.shipFound = false;
                    return
                }
                else if (answer[answer.length-1] === "sunk") {
                    this.successfulHits = 0;
                    this.shipFound = false;
                    this.firstShot(parent);
                }
                else {
                    this.shipDirectionKnown = true;

                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (this.shootingDirection[0]) { // horizontal
                        if (this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || parent.opponentBoard[shot[0]][shot[1]+1] !== ".") {
                                this.shootingDirection[1] = false;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || parent.opponentBoard[shot[0]][shot[1]-1] !== ".") {
                                this.shootingDirection[1] = true;
                            }
                        }
                    }
                    else { // vertical
                        if (this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || parent.opponentBoard[shot[0]+1][shot[1]] !== ".") {
                                this.shootingDirection[1] = false;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || parent.opponentBoard[shot[0]-1][shot[1]] !== ".") {
                                this.shootingDirection[1] = true;
                            }
                        }
                    }
                    return this.latterShot(parent);
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                if (this.firstHit[0] > 0 && parent.opponentBoard[this.firstHit[0]-1][this.firstHit[1]] === ".") { this.shootingDirection = [false, false]; }
                else if (this.firstHit[0] < 9 && parent.opponentBoard[this.firstHit[0]+1][this.firstHit[1]] === ".") { this.shootingDirection = [false, true]; }
                else if (this.firstHit[1] > 0 && parent.opponentBoard[this.firstHit[0]][this.firstHit[1]-1] === ".") { this.shootingDirection = [true, false]; }
                else if (this.firstHit[1] < 9 && parent.opponentBoard[this.firstHit[0]][this.firstHit[1]+1] === ".") { this.shootingDirection = [true, true]; }
                else { this.shipFound = false; console.log("What the fuck"); }
                return parent.opponentTurn();
            }
        });
    }

    latterShot(parent: any) {
        let shot: number[] = [];

        //Figures out where to shoot
        if (this.shootingDirection[0]) { // horizontal
            if (this.shootingDirection[1]) { // right
                shot = [this.firstHit[0], this.firstHit[1]+this.successfulHits];
            }
            else { // left
                shot = [this.firstHit[0], this.firstHit[1]-this.successfulHits];
            }
        }
        else { // vertical
            if (this.shootingDirection[1]) { // down
                shot = [this.firstHit[0]+this.successfulHits, this.firstHit[1]];
            }
            else { // up
                shot = [this.firstHit[0]-this.successfulHits, this.firstHit[1]];
            }
        }

        if (this.possibleTargets.findIndex((el) => el.toString() === shot.toString()) === -1) {
            console.log("What the fuck");
            shot = this.possibleTargets[Math.floor(Math.random()*this.possibleTargets.length)]
        }
        removeItem(this.possibleTargets, shot);
        
        rl.write(rows[shot[0]] + columns[shot[1]] + "\n");
        rl.question("", (input) => {
            let answer: string[] = input.split(", ");
            
            if (answer[0] === "hit") {
                this.successfulHits += 1;
                parent.opponentBoard[shot[0]][shot[1]] = "X";
                if (answer[answer.length-1] === "end") {
                    //reset variables just for the sake of it
                    this.successfulHits = 0;
                    this.shipFound = false;
                    this.shipDirectionKnown = false;
                    return
                }
                else if (answer[answer.length-1] === "sunk") {
                    this.successfulHits = 0;
                    this.shipFound = false;
                    this.shipDirectionKnown = false;
                    this.firstShot(parent);
                }
                else {
                    //switches direction if at the board border or if the next shot in that direction is not valid
                    if (this.shootingDirection[0]) { // horizontal
                        if (this.shootingDirection[1]) { // right
                            if (shot[1] === 9 || parent.opponentBoard[shot[0]][shot[1]+1] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                            }
                        }
                        else { // left
                            if (shot[1] === 0 || parent.opponentBoard[shot[0]][shot[1]-1] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                            }
                        }
                    }
                    else { // vertical
                        if (this.shootingDirection[1]) { // down
                            if (shot[0] === 9 || parent.opponentBoard[shot[0]+1][shot[1]] !== ".") {
                                this.shootingDirection[1] = false;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                            }
                        }
                        else { // up
                            if (shot[0] === 0 || parent.opponentBoard[shot[0]-1][shot[1]] !== ".") {
                                this.shootingDirection[1] = true;
                                this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                            }
                        }
                    }
                    return this.latterShot(parent);
                }
            }
            else if (answer[0] === "miss") {
                parent.opponentBoard[shot[0]][shot[1]] = "O";
                //switches direction and also cheks if at the board border or if the next shot in that direction is not valid
                if (this.shootingDirection[0]) { // horizontal
                    if (this.shootingDirection[1]) { // right
                        this.shootingDirection[1] = false;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]-1;
                        if (this.firstHit[1] === 0 || parent.opponentBoard[this.firstHit[0]][this.firstHit[1]-1] !== ".") {
                            console.log("What the fuck");
                            this.successfulHits = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                    else { // left
                        this.shootingDirection[1] = true;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[1]+1;
                        if (this.firstHit[1] === 9 || parent.opponentBoard[this.firstHit[0]][this.firstHit[1]+1] !== ".") {
                            console.log("What the fuck");
                            this.successfulHits = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                }
                else { // vertical
                    if (this.shootingDirection[1]) { // down
                        this.shootingDirection[1] = false;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]-1;
                        if (this.firstHit[0] === 0 || parent.opponentBoard[this.firstHit[0]-1][this.firstHit[1]] !== ".") {
                            console.log("What the fuck");
                            this.successfulHits = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                    else { // up
                        this.shootingDirection[1] = true;
                        this.successfulHits = 1; // resets successful hits, so that the next shot will be from firstShot[0]+1;
                        if (this.firstHit[0] === 9 || parent.opponentBoard[this.firstHit[0]+1][this.firstHit[1]] !== ".") {
                            console.log("What the fuck");
                            this.successfulHits = 0;
                            this.shipFound = false;
                            this.shipDirectionKnown = false;
                        }
                    }
                }
                return parent.opponentTurn();
            }
        });
    }
}

class Game {
    attack: Attack;
    ships: Ships;
    myBoard: string[][];
    opponentBoard: string[][];

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
            [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]]
            
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
            [".", ".", ".", ".", ".", ".", ".", ".", ".", "."]]
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
        for (let x of this.ships) {
            if (typeof(x) !== "object") continue;
            console.log(x.coords);
            for(let y of x.coords) {
                for(let z of y) {
                    console.log(z);
                }
                console.log("\n");
                for(let z of y) {
                    console.log(this.myBoard[z[0]][z[1]]);
                }
            }
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
            console.log(x.join(" "))
        }
        rl.question("opponentTurn\n", (input) => {
            let answer: string = input;
            let coordinates: number[] = [rows.indexOf(answer[0]), parseInt(answer[1])-1];

            if (this.myBoard[coordinates[0]][coordinates[1]] !== "X") {
                rl.write("miss\n");
                if (this.myBoard[coordinates[0]][coordinates[1]] !== "H") {
                    this.myBoard[coordinates[0]][coordinates[1]] = "O";
                }
                return this.myTurn();
            }
            else if (this.myBoard[coordinates[0]][coordinates[1]] === "X") {
                this.myBoard[coordinates[0]][coordinates[1]] = "H";
                // if ship sunk - hit, sunk
                //Iterates through the ships class and proceeds only with objects (AKA the actual ships)
                for (let x of this.ships) {
                    if (typeof(x) !== "object") continue;
                    for (let y of x.coords) {
                        if (y.every(el => el === "H")) {
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

let rows: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let columns: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

m.start()