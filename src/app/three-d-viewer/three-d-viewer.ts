import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Dungeon} from "../common/models/dungeon.model";
import {Observable, Subscription} from "rxjs";
import {Vector} from "../common/lib/vector.class";
import {RendererService} from "../common/services/renderer.service";

@Component({
    selector: 'app-three-d-viewer',
    standalone: true,
    imports: [],
    template: '<div>3D Viewer</div>',
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
        // this.dungeon = new Dungeon();
        this.dungeon = this.testDungeon();
        this.generateView();
    }

    ngOnInit(): void {
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


    // https://austinhenley.com/blog/raycasting.html
    generateView(): void {
        // initialize finding the entrance position.
        const entrance = this.dungeon.findEntranceCenter();
        // place viewer coordinates inh the middle of the entrance
        this.x = entrance.x;
        this.y = entrance.y;
        // place viewing direction toward the dungeon center
        const viewTarget = new Vector(this.dungeon.width / 2, this.dungeon.height / 2);
        const targetAngle = Math.atan2(viewTarget.x - this.x, viewTarget.y - this.y);
        console.log({viewer: {x: this.x, y: this.y}});
        console.log(`angle: ${targetAngle}`);
        // TODO call image generation method
        const renderer = new RendererService();
        renderer.dungeon = this.dungeon;
        renderer.position = new Vector(this.x, this.y);
        renderer.direction = targetAngle;
        renderer.render();
        // const distance = this.dungeon.castRay(new Vector(this.x, this.y), -Math.PI/2);
        // const distance = this.dungeon.castRay(new Vector(this.x, this.y), targetAngle);
        // console.log(`distance: ${distance}`);
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
