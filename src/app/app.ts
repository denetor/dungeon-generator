import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterOutlet } from '@angular/router';
import { ControlsComponent } from './controls/controls'; // Adjusted path if class name was 'Controls'
import { DungeonDisplayComponent } from './dungeon-display/dungeon-display';
import {ThreeDViewerComponent} from "./three-d-viewer/three-d-viewer";
import {Dungeon} from "./common/models/dungeon.model";
import {Observable, of} from "rxjs"; // Adjusted path

@Component({
  selector: 'app-root',
  standalone: true, // Add standalone: true
  imports: [CommonModule, RouterOutlet, ControlsComponent, DungeonDisplayComponent, ThreeDViewerComponent], // Add components
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent { // Renamed class to AppComponent
  dungeon: Dungeon;
  dungeon$: Observable<Dungeon>;


  constructor() {
    this.dungeon$ = new Observable();
    this.dungeon = new Dungeon();
  }

  handleDungeonGenerated(dungeon: Dungeon): void {
    this.dungeon = dungeon;
    this.dungeon$ = of(dungeon);
    console.log(dungeon);
  }
}
