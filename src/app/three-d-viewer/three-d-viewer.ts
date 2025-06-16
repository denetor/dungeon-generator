import {Component, Input} from "@angular/core";
import {Dungeon} from "../common/models/dungeon.model";

@Component({
    selector: 'app-three-d-viewer',
    standalone: true,
    imports: [],
    template: '<div>3D Viewer</div>',
})
export class ThreeDViewerComponent {
    @Input() dungeon: Dungeon;
    x: number = 0;
    y: number = 0;


    constructor() {
        this.dungeon = new Dungeon();
    }

    // TODO initialize finding the entrance position.
    // TODO place viewer coordinates inh the middle of the entrance
    // TODO place viewing direction toward the dungeon center
    // TODO call image generation method
}
