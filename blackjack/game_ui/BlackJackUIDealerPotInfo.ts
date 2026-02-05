import { _decorator, Component, director, Enum, game, isValid, Label, Node, Sprite, SpriteFrame } from 'cc';
import { ToastMessage } from '../message/ToastMessage';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIDealerPotInfo')
export class BlackJackUIDealerPotInfo extends Component {

    static ins : BlackJackUIDealerPotInfo = null;

    @property(Label)
    potInfo : Label = null;

    @property(Sprite)
    potBG : Sprite = null;
    
    
    @property(SpriteFrame)
    circleShapeBG : SpriteFrame = null;
    @property(SpriteFrame)
    ovalShapeBG : SpriteFrame = null;


    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIDealerPotInfo);
        }    
        return this.ins;
    }

   
    resetPotsInfo(){
        this.potInfo.string = "0";

        this.node.active = false;
       
    }

     updateBGShape( isOval: boolean){
        var bgSpriteFrame = this.circleShapeBG;
        if(isOval){
            bgSpriteFrame = this.ovalShapeBG;
        }
        if(this.potBG.spriteFrame != bgSpriteFrame){
            this.potBG.spriteFrame = bgSpriteFrame;
        }
    }

    setPotInfo(value : string){
        this.potInfo.string = value;
        this.node.active = true;

        this.updateBGShape( value.length > 2);
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

        if(params.containsKey("lost_amount")){
            lost_amount = params.getDouble("lost_amount");
            ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type] + " Lost: " + lost_amount + " Total: " + totalValue,10);  
        }

        if(params.containsKey("win_amount")){
            win_amount = params.getDouble("win_amount");
            ToastMessage.instance.show("Pot " + potIndex + " Result : " + PotResultType[result_type] + " Win: " + win_amount +  " Total: " + totalValue,10);
        }
        
        //to do show pot result
        console.log("Pot Result : potIndex = " + potIndex + " lost_amount = " + lost_amount + " win_amount = " + win_amount + " result_type = " + result_type + " totalValue = " + totalValue);


        //gameManager.audioManager.playAudio("blackjack_sound/pot_result");
        
    }
}


