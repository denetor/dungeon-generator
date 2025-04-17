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
    getCell(cells: number[], x: number, y: number): number {
        return cells[y*this.x + x];
    }


    /**
     * Set the value of a specific cell
     *
     * @param cells
     * @param x
     * @param y
     * @param value
     */
    setCell(cells: number[], x: number, y: number, value: number) {
        cells[y*this.x + x] = value;
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
                    neighbours = this.countNeighbours(this.cells, x, y);
                    if (neighbours >= 5) {
                        newCells.push(1);
                    } else if (neighbours < 4) {
                        newCells.push(0);
                    } else {
                        newCells.push(this.getCell(this.cells, x, y));
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
    countNeighbours(cells: number[], x: number, y: number): number {
        return this.getCell(cells, x-1, y-1) + this.getCell(cells, x, y-1) + this.getCell(cells, x+1, y-1) +
            this.getCell(cells, x-1, y) + this.getCell(cells, x+1, y) +
            this.getCell(cells, x-1, y+1) + this.getCell(cells, x, y+1) + this.getCell(cells, x+1, y+1);
    }


    /**
     * situazione iniziale: un insieme di celle in cui 1 è il muro e 0 è la cavità
     * copio le celle originali in una nuova matrice
     * crea una Map() vuota
     * per ogni cella della nuova matrice
     *      se vale 0:
     *          avvio il conto le celle contigue, segnandole con un numero X (>1)
     *          salvo un nella Map che la cavità di indice X è formata da N celle
     * al termine del ciclo determino l'indice X della cavità più estesa
     * ciclo tutte le celle della matrice originaria
     *      se l'indice della corrispondente cella temporanea non è X, la riempio impostandola ad 1
     */
    fillMinorCavities() {
        // copy original cells in a new array
        const newCells = [...this.cells];
        const cavitySizes = new Map();
        let cavityId = 100;
        // for each cell in the new array
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                // if value is 0 (empty cell)
                if (newCells[y*this.x + x] === 0) {
                    // count contigous empty cells, and mark them with a cavityId
                    // then save cells count with the cavityId as key
                    cavitySizes.set(cavityId, this.countContigousCells(newCells, x, y, cavityId, 0));
                }
                cavityId++;
            }
        }
        // find id and value of the largest cavity
        let maxKey: number | undefined = undefined;
        let maxVal: number = 0;
        cavitySizes.forEach((value, key) => {
            if (value > maxVal) {
                maxVal = value;
                maxKey = key;
            }
        });

        // for each original cells
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                // fill (with 1) each cavity that is not the largest one
                if (this.getCell(newCells, x, y) !== maxKey) {
                    this.setCell(this.cells, x, y, 1);
                }
            }
        }
    }


    /**
     * Counts the number of cells directly connected to the cell at (x,y), having the same value as the cell at (x,y)
     *
     * @param newCells
     * @param x
     * @param y
     * @param cavityId
     * @param emptyValue
     */
    countContigousCells(newCells: number[], x: number, y: number, cavityId: number, cellValue: number): number {
        let count = 0;
        if (this.getCell(newCells, x, y) === cellValue) {
            count++;
            // mark cell as counted within a certain cavity
            this.setCell(newCells, x, y, cavityId);
            if (x > 0) {
                count += this.countContigousCells(newCells, x-1, y, cavityId, cellValue);
            }
            if (x < this.x-1) {
                count += this.countContigousCells(newCells, x+1, y, cavityId, cellValue);
            }
            if (y > 0) {
                count += this.countContigousCells(newCells, x, y-1, cavityId, cellValue);
            }
            if (y < this.y-1) {
                count += this.countContigousCells(newCells, x, y+1, cavityId, cellValue);
            }
        }
        return count;
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
