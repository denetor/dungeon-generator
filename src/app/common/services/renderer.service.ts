import {Dungeon} from "../models/dungeon.model";
import {Vector} from "../lib/vector.class";

export class RendererService {
    // canvas target of rendering
    canvas: HTMLCanvasElement = null as any;
    ctx: CanvasRenderingContext2D = null as any;
    // dungeon to be rendered
    dungeon: Dungeon;
    // observer position
    position: Vector;
    // observer view direction
    direction: number;
    // field of view width (in radians)
    fov: number = 90 * Math.PI / 180;
    // rendered image width and height
    frameWidth: number = 320;
    frameHeight: number = 200;
    // single FOV increment to span for each frame width pixel
    fovStep = this.fov / this.frameWidth;

    constructor(properties?: any) {
        this.dungeon = properties?.dungeon ?? new Dungeon();
        this.position = properties?.position ?? new Vector(0, 0);
        this.direction = properties?.direction ?? 0;
    }

    /**
     * Sets the canvas element for rendering and initializes the 2D rendering context.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element to be set.
     * @return {void} This method does not return a value.
     */
    setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        }
    }

    /**
     * Renders the component's visual representation by utilizing the rendering context.
     * This method will draw the background and perform additional rendering tasks as needed.
     *
     * @return {void} Does not return any value.
     */
    render() {
        if (this.ctx) {
            this.drawBackground(this.ctx);
            this.drawWalls(this.ctx);
        }
    }

    drawWalls(ctx: CanvasRenderingContext2D) {
        console.log(`drawWalls: ${this.position.x}, ${this.position.y}, ${this.direction}`);
        console.log(`fovStep: ${this.fovStep * 180 / Math.PI}deg`);
        // calculate starting angle (direction - half the FOV)
        let rayDirection = this.direction - this.fov / 2;
        // for each canvas with pixel
        for (let x = 0; x < this.frameWidth; x++) {
            // cast ray to find distance to wall
            let d = this.dungeon.castRay(this.position, rayDirection);
            console.log(`d: ${d}`);
            // calculate wall height basing on distance
            let wallHeight = this.getWallHeight(d);
            console.log(`wallHeight: ${wallHeight}`);
            // TODO transform distance to correct distortion
            // TODO fade color basing on distance
            // TODO apply color shade basing on wall angle (wishlist)
            // TODO draw wall
            ctx.strokeStyle = "#777777";
            ctx.beginPath();
            ctx.moveTo(x, this.frameHeight / 2 - wallHeight / 2);
            ctx.lineTo(x, this.frameHeight / 2 + wallHeight / 2);
            ctx.stroke();
            // set ray direction for new pixel
            rayDirection += this.fovStep;
        }
    }


    getWallHeight(d: number): number {
        if (d < 0) {
            return 0;
        } else if (d <= 1) {
            return this.frameHeight;
        } else {
            return this.frameHeight / d;
        }
    }



    /**
     * Draws the background on the provided canvas rendering context. The background consists of
     * two sections: the upper half representing the sky, and the lower half representing a pavement.
     *
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas on which the background is drawn.
     * @return {void} No return value. The background is drawn directly on the canvas context.
     */
    drawBackground(ctx: CanvasRenderingContext2D): void {
        // upper half: sky
        ctx.fillStyle = "#87CEFA";
        ctx.fillRect(0, 0, this.frameWidth - 1, this.frameHeight / 2 - 1);
        // lower half: pavement
        ctx.fillStyle = "#555555";
        ctx.fillRect(0, this.frameHeight / 2, this.frameWidth - 1, this.frameHeight);
    }
}
