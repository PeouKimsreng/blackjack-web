import { _decorator, Button, Component, director, isValid, Node, Sprite, SpriteFrame, Tween, tween, utils, Vec3  } from 'cc';


//import { fullScreen , isFullscreen , exitFullscreen } from '../../Utils';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackUIGameRules } from '../game_ui/BlackJackUIGameRules';

const { ccclass, property } = _decorator;

@ccclass('BlackJackOptionsMenu')
export class BlackJackOptionsMenu extends Component {
   
    static ins: BlackJackOptionsMenu = null;

    @property({type: Node})
    hidenButton : Node = null;

    @property(Sprite)
    leaveButton : Sprite;
    @property(SpriteFrame)
    leaveSprite : SpriteFrame;
    @property(SpriteFrame)
    cancelLeaveSprite : SpriteFrame;

    @property(Sprite)
    standupButton : Sprite;
    @property(SpriteFrame)
    standupSprite : SpriteFrame;
    @property(SpriteFrame)
    cancelStandupSprite : SpriteFrame;


    @property(SpriteFrame)
    fullScreenSprite : SpriteFrame;
    @property(SpriteFrame)
    exitFullScreenSprite : SpriteFrame;


    @property(SpriteFrame)
    soundOnSprite : SpriteFrame;
    @property(SpriteFrame)
    soundOffSprite : SpriteFrame;
    @property(Sprite)
    soundButton : Sprite;

    @property(Sprite)
    screenButton : Sprite;

    @property(Button)
    standButton : Button;    

    private _isShow = false;
    private _isBusyShowDialog = false;

    tweenMove : Tween<Node> | null;

    _isRequestStandup :boolean = false;
    _isRequestLeave :boolean = false;

    set isRequestStand(isStandUpRequested : boolean){

        this._isRequestStandup = isStandUpRequested;
    }

    set isRequestLeave (isExitToLobbyRequested : boolean){
        this._isRequestLeave = isExitToLobbyRequested;
    }

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackOptionsMenu);
        }
    
        return this.ins;
    }

    reset(){
        this.resetTween();
    }

    private resetTween()
    {
        if(this.tweenMove != null){
            this.tweenMove.stop();
            this.tweenMove = null;
        }
    }


    toggleSound() {
        BlackJackManager.instance.isMuteMusic = !BlackJackManager.instance.isMuteMusic;
        BlackJackManager.instance.isMuteSound = !BlackJackManager.instance.isMuteSound;

        this.onSoundUpdated();
    }

    onSoundUpdated(){
        this.soundButton.spriteFrame = BlackJackManager.instance.isMuteMusic ? this.soundOffSprite : this.soundOnSprite;
    }

    onScreenUpdated(isFullScreen : boolean){
        if(isFullScreen){
            this.screenButton.spriteFrame = this.exitFullScreenSprite;
        }
        else{
            this.screenButton.spriteFrame = this.fullScreenSprite;
        }
    }

    activeStandButton(active : boolean){
        this.standButton.node.active = active;
    }

    activeHidenButton(active : boolean){
        this.hidenButton.active = active;
    }

    onCanStand(){
        var hasMe  = BlackJackManager.instance.hasMe;
        this.activeStandButton(hasMe);
        if(hasMe){
            //this.setIsStandReserve =  BlackJackManager.instance.me.isPlaying && this._isRequestStandup;
            
        }        
    }
    
    get isShowing(){
        return this._isShow;
    }

    hide(){
         console.log("BlackJackOptionsMenu hide");
        if(this._isShow){
            this._isShow = false;
            let tweenDuration: number = 0.3;
            this.hidenButton.active = false;
            
            this.resetTween();
            
            this.tweenMove = tween(this.node)
        
                .to(tweenDuration, { position: new Vec3(1990, 39.247, 0) }, {  // 
                easing: "backIn",})
                .call(() => {this.activeHidenButton(false);})
            .start();
        }
    }

    show(){
        if(!this._isShow){
            let tweenDuration: number = 0.3; 

            this.resetTween();

            console.log("BlackJackOptionsMenu show");
            
            this.tweenMove = tween(this.node)
                .call(()=>{
                    
                    this._isBusyShowDialog = false;
                    this.onCanStand();
                   // this.onScreenUpdated(isFullscreen());
                    this.onSoundUpdated();
                })
                .to(tweenDuration, { position: new Vec3(951.059, 39.247, 0) }, {  // 
                easing: "linear",})
                .call(()=>{
                    this._isShow = true;
                    this.activeHidenButton(true);
                })
                .delay(3)
                .to(tweenDuration, { position: new Vec3(1990, 39.247, 0) }, {  // 
                    easing: "backIn",
                })
            .start();
        }

    }

    set setIsLeaveReserve(isPending: boolean){
        this.isRequestLeave = isPending;
        this.leaveButton.spriteFrame = isPending? this.cancelLeaveSprite : this.leaveSprite;
    }

    set setIsStandReserve(isPending: boolean){
        this.isRequestStand = isPending;
        this.standupButton.spriteFrame = isPending? this.cancelStandupSprite : this.standupSprite;
    }

    onExitToLobbyButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.onPlayerExitRoom();
        this.isRequestLeave = !this.isRequestLeave;
        this.hide();
    }

    onStandUpButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        BlackJackManager.instance.onRequestStand();        
        this.isRequestStand = !this.isRequestStand;
        this.onCanStand();
        this.hide();
    }

    onScreenButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        this.hide();
        /* 
        if(isFullscreen()){
            exitFullscreen();
            this.onScreenUpdated(isFullscreen());
        }
        else{
            fullScreen();
            this.onScreenUpdated(isFullscreen());
        }
        */
    }

    onSoundOnOffButtonClick(){        
        BlackJackManager.instance.playButtonClickSound();
       this.hide();
       this.toggleSound();
    }

    onRuleButtonClick(){
        if(this._isBusyShowDialog){return;}
        this._isBusyShowDialog = true;
        BlackJackManager.instance.playButtonClickSound();
        this.hide();
        BlackJackUIGameRules.instance.show();
    }

    onHistoryButtonClick(){
        if(this._isBusyShowDialog){return;}
        this._isBusyShowDialog = true;
        BlackJackManager.instance.playButtonClickSound();
        this.hide();
      //  UIGameHistory.instance.show();
    }


}



