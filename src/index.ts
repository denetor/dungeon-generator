import { CellularAutomata } from "./services/cellular-automata";

// Function to generate and display the dungeon
function generateAndDisplayDungeon() {
    // Get HTML elements
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const seedInput = document.getElementById('seed') as HTMLInputElement;
    const generateButton = document.getElementById('generateButton');
    const dungeonContainer = document.getElementById('dungeon-container');

    if (!widthInput || !heightInput || !seedInput || !generateButton || !dungeonContainer) {
        console.error("Error: One or more HTML elements not found!");
        return;
    }

    // Get values from input fields
    let width = parseInt(widthInput.value, 10);
    let height = parseInt(heightInput.value, 10);
    let seedString = seedInput.value;

    // Validate and provide default values
    if (isNaN(width) || width <= 0) {
        width = 80; // Default width
        widthInput.value = width.toString();
    }
    if (isNaN(height) || height <= 0) {
        height = 40; // Default height
        heightInput.value = height.toString();
    }

    let seed: number;
    if (seedString.trim() === "" || isNaN(parseInt(seedString, 10))) {
        seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        seedInput.value = seed.toString(); // Update input field with generated seed
    } else {
        seed = parseInt(seedString, 10);
    }

    // Create CellularAutomata instance
    const ca = new CellularAutomata(width, height, seed);

    // Run dungeon generation steps
    ca.processStep();
    ca.processStep();
    ca.processStep();
    ca.processStep();
    ca.fillMinorCavities();
    ca.shrinkToCavity();
    ca.addEntrance(2); // Assuming 2 is a reasonable default for entrance width

    // Get the string representation of the dungeon
    const dungeonString = ca.toString();

    // Clear previous output and display the new dungeon
    dungeonContainer.innerHTML = ''; // Clear previous content
    const preElement = document.createElement('pre');
    preElement.textContent = dungeonString;
    dungeonContainer.appendChild(preElement);
}

// Add event listener to the generate button
const generateButton = document.getElementById('generateButton');
if (generateButton) {
    generateButton.addEventListener('click', generateAndDisplayDungeon);
} else {
    console.error("Generate button not found!");
}

// Optionally, generate a dungeon on initial load
// generateAndDisplayDungeon(); // Uncomment to generate a dungeon when the page loads
