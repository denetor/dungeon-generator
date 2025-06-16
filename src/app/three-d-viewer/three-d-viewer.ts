import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Dungeon} from "../common/models/dungeon.model";
import {Observable, Subscription} from "rxjs";

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
    x: number = 0;
    y: number = 0;


    constructor() {
        this.dungeon$ = new Observable();
        this.dungeon = new Dungeon();
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


    generateView(): void {
        // TODO initialize finding the entrance position.
        const entrance = this.dungeon.findEntranceCenter();
        console.log({entrance});
        // TODO place viewer coordinates inh the middle of the entrance
        // TODO place viewing direction toward the dungeon center
        // TODO call image generation method
    }

}
