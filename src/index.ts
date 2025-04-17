import { CellularAutomata } from "./services/cellular-automata";

function helloComponent() {
    const element = document.createElement('div');
    element.innerHTML = 'Hello world';

    return element;
}

document.body.appendChild(helloComponent());


const ca = new CellularAutomata(100, 50, 836254915);
console.log(ca.toString());
ca.processStep();
ca.processStep();
console.log(ca.toString());