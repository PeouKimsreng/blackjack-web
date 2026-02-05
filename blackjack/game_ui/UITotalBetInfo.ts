import { _decorator, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { SFSArray, SFSObject, SFSRoom } from '../../smartfox/sfs2x-api';
import { numberToCash, numberToCurrency } from '../../GlobalBlackJack';
const { ccclass, property } = _decorator;

@ccclass('UITableBetInfo')
export class UITotalBetInfo extends Component {

    @property(Label)
    totalBetInfoLabel :Label =null;

    @property(UIOpacity)
    opacity:UIOpacity = null;

    private TOTAL_BET_TEXT = "Total Bet:";

    reset(){
        this.totalBetInfoLabel.string = this.TOTAL_BET_TEXT;
    }

    responseBetInfo(sfsObj : SFSObject){
        if(!sfsObj.containsKey("total_bet")){
            return;
        }
        const totalBet = sfsObj.getDouble("total_bet");
        this.setTotalBetAmount(totalBet);
    }

    setTotalBetAmount(totalBet: number){
        if(totalBet > 0){
            this.totalBetInfoLabel.string = `${this.TOTAL_BET_TEXT} ${numberToCash(totalBet)}`;
        }
        else{
            this.totalBetInfoLabel.string = this.TOTAL_BET_TEXT;
        }
    }

    show(){
        this.node.active = true;
        tween(this.node)
            .to(0.3, { 
                position: new Vec3(0,0,0),
             }, {})
            .start();
    }

    hide(){
        tween(this.node)
            .to(0.3, { 
                position: new Vec3(-500,0,0),
             }, {})
            .call(() => {
                this.node.active = false;  
            })  
            .start();
    }

}



