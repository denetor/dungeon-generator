import {random,XORShift} from 'random-seedable';

export class CellularAutomata {
    x: number;
    y: number;
    seed: number;
    cells: number[];

    constructor(x: number, y: number, seed: number) {
        this.x = x;
        this.y = y;
        this.seed = seed;
        this.generateRandomChars();
    }


    /**
     * 
     * @param x Return the value of a specific cell
     * @param y 
     * @returns 
     */
    cell(x: number, y: number): number {
        return this.cells[y*this.x + x];
    }


    /**
     * Generate an array of cells filled with random 0s and 1s
     */
    generateRandomChars() {
        const random = new XORShift(this.seed);
        this.cells = [];
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                this.cells.push(random.bool() ? 1 : 0);
            }
        }
    }


    /**
     * Process a transformation step.
     */
    processStep() {
        let newCells = [];
        let neighbours;
        // process each original cell, putting the result in the new cells array
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                // borders are always solid
                if (x==0 || y==0 || x==this.x-1 || y==this.y-1) {
                    newCells.push(1);
                } else {
                    neighbours = this.countNeighbours(x, y);
                    if (neighbours >= 4) {
                        newCells.push(1);
                    } else if (neighbours < 2) {
                        newCells.push(0);
                    } else {
                        newCells.push(this.cell(x,y));
                    }
                }
            }
        }
        // replace original cells with newCells
        this.cells = newCells;
    }


    /**
     * Returns the number of the 1s around a cell
     * 
     * @param originalCells
     * @param x 
     * @param y 
     */
    countNeighbours(x: number, y: number): number {
        return this.cell(x-1, y-1) + this.cell(x, y-1) + this.cell(x+1, y-1) +
        this.cell(x-1, y) + this.cell(x+1, y)
        this.cell(x-1, y+1) + this.cell(x, y+1) + this.cell(x+1, y+1);
    }


    toString(): string {
        let s = '';
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                s += this.cells[y*this.x + x] ? '░' : ' ';
            }
            s += "\n";
        }
        return s;
    }
}