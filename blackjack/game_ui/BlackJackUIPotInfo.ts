import { _decorator, Component, director, Enum, game, isValid, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ToastMessage } from '../message/ToastMessage';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackUIResults } from './BlackJackUIResutls';
import { BlackJackUIGameHistory } from './BlackJackUIGameHistory';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIPotInfo')
export class BlackJackUIPotInfo extends Component {

    static ins : BlackJackUIPotInfo = null;

    @property(Label)
    pot0 : Label = null;
    @property(Label)
    pot1 : Label = null;
    @property(Label)
    pot2 : Label = null;

    @property(Label)
    pot3 : Label = null;
    @property(Label)
    pot4 : Label = null;
    @property(Label)
    pot5 : Label = null;

    @property(Sprite)
    pot0BG : Sprite = null;
    @property(Sprite)
    pot1BG : Sprite = null;
    @property(Sprite)
    pot2BG : Sprite = null;

    @property(Sprite)
    pot3BG : Sprite = null;
    @property(Sprite)
    pot4BG : Sprite = null;
    @property(Sprite)
    pot5BG : Sprite = null;


    @property(SpriteFrame)
    circleShapeBG : SpriteFrame = null;
    @property(SpriteFrame)
    ovalShapeBG : SpriteFrame = null;



    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIPotInfo);
        }    
        return this.ins;
    }


    hideAllPotsInfo(){
        this.pot0BG.node.active = false;
        this.pot1BG.node.active = false;
        this.pot2BG.node.active = false;
        this.pot3BG.node.active = false;
        this.pot4BG.node.active = false;
        this.pot5BG.node.active = false;
    }

    setPotInfo(potIndex : number, value : string){
        switch(potIndex){
            case 0 : 
                this.setPot0Info(value);
                break;
            case 1 : 
                this.setPot1Info(value);
            break;
            case 2: 
                this.setPot2Info(value);
                break;
            case 3: 
                this.setPot3Info(value);
                break;
            case 4: 
                this.setPot4Info(value);
                break;
            case 5: 
                this.setPot5Info(value);
                break;
        }
    }

    resetPotsInfo(){
        this.pot0.string = "0";
        this.pot1.string = "0";
        this.pot2.string = "0";
        this.pot3.string = "0";
        this.pot4.string = "0";
        this.pot5.string = "0";

        this.hideAllPotsInfo();
    }

    updateBGShape(potIndex: number, isOval: boolean){
        var bgSpriteFrame = this.circleShapeBG;
        if(isOval){
            bgSpriteFrame = this.ovalShapeBG;
        }
        switch(potIndex){
            case 0 : 
                this.pot0BG.spriteFrame = bgSpriteFrame;
                break;
            case 1 : 
                this.pot1BG.spriteFrame = bgSpriteFrame;
            break;
            case 2: 
                this.pot2BG.spriteFrame = bgSpriteFrame;    

                break;
            case 3: 
                this.pot3BG.spriteFrame = bgSpriteFrame;    
                break;
            case 4: 
                this.pot4BG.spriteFrame = bgSpriteFrame;    
                break;
            case 5:
                this.pot5BG.spriteFrame = bgSpriteFrame;
                break;
        }
    }

    setPot0Info(value : string){
        this.pot0.string = value;
        this.pot0.node.parent.active = true;

        this.updateBGShape(0, value.length > 2);
    }

    setPot1Info(value : string){
        this.pot1.string = value;
        this.pot1.node.parent.active = true;
        this.pot1.node.active = true;
        this.updateBGShape(1, value.length > 2);
    }

    setPot2Info(value : string){
        this.pot2.string = value;
        this.pot2.node.parent.active = true;
        this.updateBGShape(2, value.length > 2);
    }

    setPot3Info(value : string){
        this.pot3.string = value;
        this.pot3.node.parent.active = true;
        this.updateBGShape(3, value.length > 2);
    }
    
    setPot4Info(value : string){
        this.pot4.string = value;
        this.pot4.node.parent.active = true;
        this.updateBGShape(4, value.length > 2);
    }

    setPot5Info(value : string){
        this.pot5.string = value;
        this.pot5.node.parent.active = true;
        this.updateBGShape(5, value.length > 2);
    }

    showPotResult(potIndex: number, params: any){

        var lost_amount = 0.0;
        var win_amount = 0.0;
        var result_type = 0;
        var totalValue = 0;

        enum PotResultType{
            WON = 0,
            LOST =1,
            BUSTED = 2,
            PUSHED = 3,
            BLACKJACK = 4
        }

        if(params.containsKey("result_type")){
            result_type = params.getInt("result_type");
        }

        if(params.containsKey("value")){
            totalValue = params.getInt("value");
        }

        var result : PotResultType =   result_type ;

        BlackJackUIResults.instance.results[potIndex].setPotResult(result_type);

        switch(result){
            case PotResultType.PUSHED :
                //ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type],1);
                BlackJackManager.instance.bettingChipManager.returnChips(potIndex,BlackJackManager.instance.getPlayerSeat(1).BetOrginNode);
                break;
            case PotResultType.BLACKJACK: 
                //ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type],1);
                break;
            case PotResultType.BUSTED :
                if(params.containsKey("lost_amount")){
                    lost_amount = params.getDouble("lost_amount");
                    //ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type] + " Lost: " + lost_amount + " Total: " + totalValue,1);  
                    
                    BlackJackManager.instance.bettingChipManager.returnChips(potIndex,BlackJackManager.instance.getPlayerSeat(0).BetOrginNode)
                }
                break;
            case PotResultType.LOST :
                if(params.containsKey("lost_amount")){
                    lost_amount = params.getDouble("lost_amount");
                   // ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type] + " Lost: " + lost_amount + " Total: " + totalValue,1);  
                    
                    BlackJackManager.instance.bettingChipManager.returnChips(potIndex,BlackJackManager.instance.getPlayerSeat(0).BetOrginNode)
                }        
                break;
            case PotResultType.WON:
                if(params.containsKey("win_amount")){
                    win_amount = params.getDouble("win_amount");
                    //ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type] + " Win: " + win_amount +  " Total: " + totalValue,1);

                    BlackJackManager.instance.bettingChipManager.returnChips(potIndex,BlackJackManager.instance.getPlayerSeat(1).BetOrginNode)
                        
                    var targetNodeToReturn = BlackJackManager.instance.getPlayerSeat(1).BetOrginNode;

                    BlackJackManager.instance.bettingChipManager.payBackChips(win_amount,BlackJackManager.instance.getPlayerSeat(0).BetOrginNode,targetNodeToReturn);
                }
                break;                 
        }

        //to do show pot result
       // console.log("Pot Result : potIndex = " + potIndex + " lost_amount = " + lost_amount + " win_amount = " + win_amount + " result_type = " + result_type + " totalValue = " + totalValue);


        //gameManager.audioManager.playAudio("blackjack_sound/pot_result");
        
    }
}


