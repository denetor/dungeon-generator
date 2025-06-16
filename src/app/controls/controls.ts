import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CellularAutomataService } from '../common/services/cellular-automata.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Dungeon} from "../common/models/dungeon.model";

@Component({
  selector: 'app-controls',
  standalone: true, // Explicitly add standalone flag
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ], // Add FormsModule and CommonModule
  templateUrl: './controls.html',
  styleUrl: './controls.css'
})
export class ControlsComponent { // Rename class to ControlsComponent
  width: number = 50;
  height: number = 25;
  seed: string = "462384512"; // Keep seed as string to match input type, convert to number when used

  @Output() dungeonGenerated = new EventEmitter<Dungeon>();

  generateDungeon(): void {
    const numericSeed = parseInt(this.seed, 10);
    if (isNaN(numericSeed)) {
      console.error("Invalid seed: Not a number");
      // Optionally, provide user feedback here
      return;
    }

    const ca = new CellularAutomataService(this.width, this.height, numericSeed);
    ca.processStep();
    ca.processStep();
    ca.processStep();
    ca.processStep();
    ca.fillMinorCavities();
    ca.shrinkToCavity();
    ca.addEntrance(1);

    const dungeon: Dungeon = new Dungeon({
      width: ca.x,
      height: ca.y,
      cells: ca.cells,
    });
    this.dungeonGenerated.emit(dungeon);
  }
}
