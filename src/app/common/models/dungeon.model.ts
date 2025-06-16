export class DungeonProperties {
    width?: number;
    height?: number;
    cells?: number[];
}


export class Dungeon {
    width: number = 1;
    height: number = 1;
    cells: number[] = [];

    constructor(properties?: DungeonProperties) {
        this.width = properties?.width ?? 1;
        this.height = properties?.height ?? 1;
        this.cells = properties?.cells ?? [];
    }


    /**
     * Converts the cell structure of the object into a string representation.
     * Each row of cells is represented as a line of text, with specific characters
     * denoting the state of each cell.
     *
     * @return {string} A string representation of the object's cell layout,
     * with each row separated by a newline character.
     */
    toString(): string {
        let s = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                s += this.cells[y*this.width + x] ? '░' : ' ';
            }
            s += "\n";
        }
        return s;
    }
}
