import { _decorator, Component, Label, Node } from 'cc';
import { numberToCash } from '../../GlobalBlackJack';

const { ccclass, property } = _decorator;

@ccclass('BetAmount')
export class BetAmount extends Component {

    @property(Label)
    betAmount : Label;

    setBetAmount(amount : number)
    {
        this.betAmount.string = `${numberToCash(amount)}`;
    }    
}


