import readline from "readline";
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

let ponorka = new Ship("ponorka", 1, 1)
let torpédoborce = new Ship("torpédoborce", 2, 2)
let křížniky = new Ship("křížniky", 3, 2)
let bitevníLodě = new Ship("bitevní lodě", 1, 1)
let letadlováLoď = new Ship("letadlová loď", 1, 1)

let board: Array<Array<string>> = []
for (let i = 0; i < 10; i++) {
    let tempRow: string[] = []
    for (let n = 0; n < 10; n++) {
        tempRow.push(".");
    }
    board.push(tempRow)
}
