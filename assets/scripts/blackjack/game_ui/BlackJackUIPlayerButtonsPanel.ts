import { _decorator, Button, Component, director, isValid, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { BlackJackManager } from '../manager/BlackJackManager';

const { ccclass, property } = _decorator;

export enum UIPlayerButtonType {
    HIT_AND_STAND = 0,
    SPLIT_CONFIRMATION = 1,
}

@ccclass('BlackJackUIPlayerButtonsPanel')
export class BlackJackUIPlayerButtonsPanel extends Component {
            
    static ins : BlackJackUIPlayerButtonsPanel = null;
   

    @property(Button)
    hitButton : Button = null;

    @property(Button)
    standButton : Button = null;

    @property(Button)
    doubleButton : Button = null;


    @property(Sprite)
    splitIcon : Sprite = null;

    @property(Button)
    splitButton : Button = null;

    @property(Button)
    splitCancelButton : Button = null;

    // @property(Button)
    // confirmButton : Button = null;

    private _isConfirmHand : boolean = false;
    private showTween: Tween<Node|undefined> = undefined;
    setConfirmHand(isConfirmHand : boolean){
        this._isConfirmHand = isConfirmHand;
        if(isConfirmHand){
            this.hide();
            return;
        }
    }


    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIPlayerButtonsPanel);
        }    
        return this.ins;
    }

    setUIButtonType (type : UIPlayerButtonType, canDouble: boolean = false) {

        switch(type){
            case  UIPlayerButtonType.HIT_AND_STAND: 
                this.hitButton.node.active = true;
                this.standButton.node.active = true;
                this.doubleButton.node.active = canDouble;

                this.splitIcon.node.active = false;
                this.splitButton.node.active = false;
                this.splitCancelButton.node.active = false;
                break;
            case  UIPlayerButtonType.SPLIT_CONFIRMATION: 
                this.hitButton.node.active = false;
                this.standButton.node.active = false;
                this.doubleButton.node.active = false;

                this.splitIcon.node.active = true;
                this.splitButton.node.active = true;
                this.splitCancelButton.node.active = true;
                break;
            
        }
    }

    clearTween() {
        if (this.showTween !== undefined) {
            this.showTween.stop();
            this.showTween = undefined;
        }   
    }

    onNewGame() {
        this._isConfirmHand = false;
        this.hide();
    }

    onWaiting(){
        this._isConfirmHand = false;
        this.hide();
    }

    onCompareHand(){
        this._isConfirmHand = true;
        this.hide();
    }

    onClearHand(){
        this._isConfirmHand = false;
        this.hide();
    }

    // showPlayerButton(){

    //     this._isConfirmHand = false;
    //     if(!this.node.active){
    //         this.node.active = true;
    //     }
    //     this.show(UIPlayerButtonType.HIT_AND_STAND);
    // }

    responseHitButton(dataHitButton : {is_show_button:boolean,state:string}){
        this.hitButton.node.active = dataHitButton.is_show_button;
    }


    responseStandButton(dataStandButton : {is_show_button:boolean,state:string}){
        this.standButton.node.active = dataStandButton.is_show_button;
    }

    hide(){
        let tweenDuration: number = 0.1;
        this.clearTween();        
        this.showTween = tween(this.node)
            .to(tweenDuration, { position: new Vec3(1217.375, -1500, 0) }, {  
            easing: "backIn",
        })
        .start();
    }

    get isShown(): boolean {
        return this.node.active;
    }

    show(type : UIPlayerButtonType, canDouble: boolean = false){

        if(this._isConfirmHand){return;}

        this.setUIButtonType(type, canDouble);

        let tweenDuration: number = 0.1;
        this.clearTween();
        this.showTween = tween(this.node)
        .to(tweenDuration, { position: new Vec3(1217.375, -466.584, 0) }, { 
                easing: "backInOut",
        })
        .start();
    }

    OnPotHitButtonClicked(event: Event, customEventData: string){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendPotHit();
    }
    
    OnPotStandButtonClicked(event: Event, customEventData: string){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendPotStand();
    }

    OnPotDoubleButtonClicked(event: Event, customEventData: string){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendPotDouble();
    }
    

    OnOKButtonClicked(event: Event, customEventData: string){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendOK();
        this.hide();
    }

    onSplitButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendPotSplit();
    }

    onSplitCancelButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.sendPotSplitCancel();
    }
}



