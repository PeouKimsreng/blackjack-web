import { _decorator, Component, Node, TERRAIN_DATA_VERSION4, Vec3 } from 'cc';
import { BlackJackCustomDigitLabel } from '../menu/BlackJackCustomDigitLabel';

const { ccclass, property } = _decorator;

@ccclass('UIWinLostAmount')
export class UIWinLostAmount extends Component {
    @property(BlackJackCustomDigitLabel)
    public winAmount : BlackJackCustomDigitLabel = null;
    @property(BlackJackCustomDigitLabel)
    public lostAmount : BlackJackCustomDigitLabel = null;


    set isWinner(isWinner : boolean){
        this.node.active = true;
        this.winAmount.node.active = isWinner;
        this.lostAmount.node.active = !isWinner;
    }

    set setPosition(targertPos : Vec3){
        this.node.position = targertPos;
    }

    reset(){
        this.winAmount.setDisplay(`${0}`)
        this.lostAmount.setDisplay(`${0}`)
        this.node.active = false;
        this.winAmount.node.active = false;
        this.lostAmount.node.active = false;
    }

    setWinAmount(amount){
        this.isWinner = true;
        this.winAmount.setDisplayCash(`${amount}`)
    }

    setLostAmount(amount){
        this.isWinner = false;
        this.lostAmount.setDisplayCash(`${amount}`)

    }
}


