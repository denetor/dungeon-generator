import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Dungeon} from "../common/models/dungeon.model";
import {Observable, Subscription} from "rxjs";
import {Vector} from "../common/lib/vector.class";
import {RendererService} from "../common/services/renderer.service";

@Component({
    selector: 'app-three-d-viewer',
    standalone: true,
    imports: [],
    templateUrl: './three-d-viewer.html',
})
export class ThreeDViewerComponent implements OnInit, OnDestroy {
    private subscription: Subscription = new Subscription();
    @Input() dungeon$: Observable<Dungeon>;
    dungeon: Dungeon;
    // viewer position
    x: number = 0;
    y: number = 0;
    // view direction (in radians, zero is top)
    viewDirection = 0;


    constructor() {
        this.dungeon$ = new Observable();
        this.dungeon = new Dungeon();
    }

    ngOnInit(): void {
        // TODO remove temporary assignment
        this.dungeon = this.testDungeon();
        this.initView();
        this.generateView();

        // TODO fix subscription not working
        this.subscription.add(
            this.dungeon$.subscribe(dungeon => {
                console.log('arrivato un dungeon');
                this.dungeon = dungeon;
                this.generateView();
            })
        );
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    /**
     * Initializes the view by setting the viewer's position to the middle of the dungeon entrance
     * and aiming the viewing direction toward the dungeon's center.
     * @return {void} Does not return any value.
     */
    initView(): void {
        // initialize finding the entrance position.
        const entrance = this.dungeon.findEntranceCenter();
        // place viewer coordinates inh the middle of the entrance
        this.x = entrance.x;
        this.y = entrance.y;
        // place viewing direction toward the dungeon center
        const viewTarget = new Vector(this.dungeon.width / 2, this.dungeon.height / 2);
        this.viewDirection = Math.atan2(this.x - viewTarget.x, this.y - viewTarget.y);
        console.log({viewer: {x: this.x, y: this.y}});
        console.log(`angle: ${this.viewDirection / 180 * Math.PI}deg`);
    }


    /**
     * Generates the view for the application by initializing the renderer and
     * setting its properties such as canvas, dungeon, position, and direction.
     * Then invokes the render method to display the 3D view.
     *
     * @return {void} Does not return a value.
     */
    generateView(): void {
        const renderer = new RendererService();
        renderer.setCanvas(document.getElementById('canvas3d') as HTMLCanvasElement);
        renderer.dungeon = this.dungeon;
        renderer.position = new Vector(this.x, this.y);
        renderer.direction = this.viewDirection;
        renderer.render();
    }


    rotateLeft(): void {
        this.viewDirection -= 10 * Math.PI / 180;
        this.generateView();
    }


    rotateRight(): void {
        this.viewDirection += 10 * Math.PI / 180;
        this.generateView();
    }


    moveForward(): void {
        const movement = 0.2;
        this.x += Math.cos(this.viewDirection) * movement;
        this.y += Math.sin(this.viewDirection) * movement;
        this.generateView();
    }


    /**
     * Generate a tiny test dungeon
     */
    testDungeon(): Dungeon {
        const dungeon = new Dungeon();
        dungeon.width = 5;
        dungeon.height = 5;
        dungeon.cells = [
            1,1,1,1,1,
            1,0,0,1,1,
            1,0,0,0,1,
            1,0,0,0,1,
            1,0,1,1,1,
        ];
        return dungeon;
    }

}
