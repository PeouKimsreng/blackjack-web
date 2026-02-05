import { _decorator, Component, Node } from 'cc';
import { BlackJackHandCards } from './BlackJackHandCards';
const { ccclass, property } = _decorator;

@ccclass('HandCardPots')
export class HandCardPots extends Component
{

    @property(BlackJackHandCards)
    handCards : BlackJackHandCards[] = [];

    onNewGame(){
       this.handCards.forEach( pot =>
            pot.onClear()
        );
    }
        
    getHandCards(index : number) : BlackJackHandCards{
        return this.handCards[index];
    }   

    reset(){
        this.handCards.forEach(pot => pot.setEnableSelected = false);
    }

    clearCards(){
        this.handCards.forEach( pot =>
        pot.onClear()
        );
    }

    selectHandCards(index : number){

        this.handCards.forEach(pot => pot.setEnableSelected = false);

        this.handCards[index].setEnableSelected = true;
    }

    deSelectHandCards(index : number){
        this.handCards[index].setEnableSelected = false;
    }
    

    deselectedHandCards(){
       this.handCards.forEach(pot => pot.setEnableSelected = false);
    }
}


