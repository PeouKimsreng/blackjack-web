import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chip')
export class Chip extends Component {

    id : number = 0;
    amount : number = 0;

    @property(Sprite)
    selectedFrame :Sprite = null;

    set isSelected(value: boolean) {
        this.selectedFrame.enabled = value;
    }

    set setAmount(amount: number) {
        this.amount = amount;
    }
    get getAmount(): number {
        return this.amount;
    }

    set setID(id: number) {
        
        this.id = id;
    }
    get getID(): number {
        return this.id;
    }    
}


