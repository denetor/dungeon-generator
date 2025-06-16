import {random,XORShift} from 'random-seedable';

export class CellularAutomataService {
    x: number;
    y: number;
    seed: number;
    cells: number[] = []; // Initialize cells


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


    /**
     * Shrink the map to fit the cavities (don't leave any completely filled
     * row/column that is not directly touching a cavity)
     */
    shrinkToCavity() {
        let xLow = 0;
        let xHi = this.x-1;
        let yLow = 0;
        let yHi = this.y-1;
        while (this.isColumnWithoutHoles(this.cells, xLow)) {
            xLow++
        }
        while (this.isColumnWithoutHoles(this.cells, xHi)) {
            xHi--;
        }
        while (this.isRowWithoutHoles(this.cells, yLow)) {
            yLow++
        }
        while (this.isRowWithoutHoles(this.cells, yHi)) {
            yHi--;
        }
        this.cells = this.getCropped(this.cells, xLow, xHi, yLow, yHi);
        this.x = xHi - xLow + 1;
        this.y = yHi - yLow + 1;
        this.addBorder();
    }


    /**
     * Determines whether a specific row in the grid has no holes
     * (i.e., no cell with a value of 0).
     *
     * @param {number[]} cells - An array representing the contents of the row to be checked.
     * @param {number} rowNr - The row number being checked.
     * @return {boolean} Returns true if the row does not contain any holes (no cells with a value of 0), otherwise false.
     */
    isRowWithoutHoles(cells: number[], rowNr: number): boolean {
        for (let x = 0; x < this.x; x++) {
            if (this.getCell(cells, x, rowNr) === 0) {
                return false;
            }
        }
        return true;
    }


    /**
     * Checks if a given column in a grid is without holes.
     * A "hole" is defined as a cell with a value of 0.
     *
     * @param {number[]} cells - The grid represented as a flat array of numbers.
     * @param {number} colNr - The index of the column to inspect.
     * @return {boolean} Returns true if the column has no holes (no cells with a value of 0), false otherwise.
     */
    isColumnWithoutHoles(cells: number[], colNr: number): boolean {
        for (let y = 0; y < this.y; y++) {
            if (this.getCell(cells, colNr, y) === 0) {
                return false;
            }
        }
        return true;
    }


    /**
     * Crops a 2D array represented as a 1D array based on specified boundaries.
     * Extracts the portion of the array defined by the x and y coordinate ranges.
     *
     * @param {number[]} cells - A 1D array representing the original 2D grid.
     * @param {number} xLow - The lower bound for the x-coordinate.
     * @param {number} xHi - The upper bound for the x-coordinate.
     * @param {number} yLow - The lower bound for the y-coordinate.
     * @param {number} yHi - The upper bound for the y-coordinate.
     * @return {number[]} A new 1D array containing the cropped portion of the original grid.
     */
    getCropped(cells: number[], xLow: number, xHi: number, yLow: number, yHi: number): number[] {
        const newCells = [];
        for (let y = yLow; y <= yHi; y++) {
            for (let x = xLow; x <= xHi; x++) {
                newCells.push(this.getCell(cells, x, y));
            }
        }
        return newCells;
    }


    /**
     * Adds a border of value `1` around a 2D array represented as a flat array of cells.
     *
     * The method assumes the original 2D grid is represented in a 1D array and uses
     * the instance variables `x` and `y` to determine the grid dimensions.
     *
     * @param {number[]} cells - A 1D array representing the original grid of cells.
     * @return {number[]} A new 1D array representing the grid with a border added.
     */
    addBorder() {
        const newCells = [];
        newCells.push(... new Array(this.x+2).fill(1));
        for (let y = 0; y < this.y; y++) {
            newCells.push(1);
            for (let x = 0; x < this.x; x++) {
                newCells.push(this.cells[y*this.x + x]);
            }
            newCells.push(1);
        }
        newCells.push(... new Array(this.x+2).fill(1));
        this.cells = newCells;
        this.x += 2;
        this.y += 2;
    }


    addEntrance(preferredSide: number = 0): boolean {
        let added: boolean = false; // Initialize added
        let cycles = 0;
        while (!added && cycles <= 4) {
            switch (preferredSide) {
                case 0:
                    added = this.addEntranceTop();
                    break;
                case 1:
                    added = this.addEntranceRight();
                    break;
                case 2:
                    added = this.addEntranceBottom();
                    break;
                case 3:
                    added = this.addEntranceLeft();
                    break;
            }
            cycles++;
        }
        return added;
    }


    /**
     * Add an entrance at the top side. The entrance is positioned at the first
     * available border spot connected to the cavity.
     *
     * @return {boolean} Returns true if an entrance is successfully added,
     * otherwise false.
     */
    addEntranceTop(): boolean {
        for (let x = 0; x < this.x; x++) {
            if (this.cells[this.x + x] === 0) {
                this.cells[x] = 0;
                return true;
            }
        }
        return false;
    }


    /**
     * Add an entrance at the top side. The entrance is positioned at the first
     * available border spot connected to the cavity.
     *
     * @return {boolean} Returns true if an entrance is successfully added,
     * otherwise false.
     */
    addEntranceBottom(): boolean {
        for (let x = 0; x < this.x; x++) {
            if (this.cells[((this.y-2) * this.x) + x] === 0) {
                this.cells[((this.y-1) * this.x) + x] = 0;
                return true;
            }
        }
        return false;
    }


    /**
     * Add an entrance at the top side. The entrance is positioned at the first
     * available border spot connected to the cavity.
     *
     * @return {boolean} Returns true if an entrance is successfully added,
     * otherwise false.
     */
    addEntranceLeft(): boolean {
        for (let y = 0; y < this.y; y++) {
            if (this.cells[y*this.x +1] === 0) {
                this.cells[y*this.x] = 0;
                return true;
            }
        }
        return false;
    }


    /**
     * Add an entrance at the top side. The entrance is positioned at the first
     * available border spot connected to the cavity.
     *
     * @return {boolean} Returns true if an entrance is successfully added,
     * otherwise false.
     */
    addEntranceRight(): boolean {
        for (let y = 0; y < this.y; y++) {
            if (this.cells[y*this.x + this.x - 2] === 0) {
                this.cells[y*this.x + this.x - 1] = 0;
                return true;
            }
        }
        return false;
    }


}
