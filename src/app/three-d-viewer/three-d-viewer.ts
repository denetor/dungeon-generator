import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-three-d-viewer',
    standalone: true,
    imports: [],
    template: '<div>3D Viewer</div>',
})
export class ThreeDViewerComponent {
    @Input() dungeonString: string = '';
}
