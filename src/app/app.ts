import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterOutlet } from '@angular/router';
import { ControlsComponent } from './controls/controls'; // Adjusted path if class name was 'Controls'
import { DungeonDisplayComponent } from './dungeon-display/dungeon-display'; // Adjusted path

@Component({
  selector: 'app-root',
  standalone: true, // Add standalone: true
  imports: [CommonModule, RouterOutlet, ControlsComponent, DungeonDisplayComponent], // Add components
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent { // Renamed class to AppComponent
  title = 'angular-dungeon-generator'; // Made public for potential template use, removed protected
  generatedDungeon: string = '';

  handleDungeonGenerated(dungeon: string): void {
    this.generatedDungeon = dungeon;
  }
}
