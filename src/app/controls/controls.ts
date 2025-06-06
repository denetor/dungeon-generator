import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CellularAutomata } from '../services/cellular-automata';

@Component({
  selector: 'app-controls',
  standalone: true, // Explicitly add standalone flag
  imports: [CommonModule, FormsModule], // Add FormsModule and CommonModule
  templateUrl: './controls.html',
  styleUrl: './controls.css'
})
export class ControlsComponent { // Rename class to ControlsComponent
  width: number = 100;
  height: number = 60;
  seed: string = "462384512"; // Keep seed as string to match input type, convert to number when used

  @Output() dungeonGenerated = new EventEmitter<string>();

  generateDungeon(): void {
    const numericSeed = parseInt(this.seed, 10);
    if (isNaN(numericSeed)) {
      console.error("Invalid seed: Not a number");
      // Optionally, provide user feedback here
      return;
    }

    const ca = new CellularAutomata(this.width, this.height, numericSeed);

    // Process steps as in original index.ts
    ca.processStep();
    ca.processStep();
    ca.processStep();
    ca.processStep();

    ca.fillMinorCavities();
    ca.shrinkToCavity();
    ca.addEntrance();

    this.dungeonGenerated.emit(ca.toString());
  }
}
