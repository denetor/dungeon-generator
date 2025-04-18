import { CellularAutomata } from "./services/cellular-automata";

function helloComponent() {
    const element = document.createElement('div');
    element.innerHTML = 'Hello world';

    return element;
}

document.body.appendChild(helloComponent());


const ca = new CellularAutomata(120, 50, 8362549153);
console.log(ca.toString());
ca.processStep();
ca.processStep();
ca.processStep();
ca.processStep();
ca.fillMinorCavities();
ca.shrinkToCavity();
console.log(ca.toString());
