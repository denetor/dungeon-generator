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
    // field of view width
    fov: number = 60;
    frameWidth: number = 320;
    frameHeight: number = 200;

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
            // TODO
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
