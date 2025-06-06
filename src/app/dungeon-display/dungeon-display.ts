import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dungeon-display',
  standalone: true,
  imports: [CommonModule, MatCardModule], // Added MatCardModule
  templateUrl: './dungeon-display.html',
  styleUrl: './dungeon-display.css'
})
export class DungeonDisplayComponent { // Renamed class
  @Input() dungeonString: string = ""; // Initialize with a default value
}
