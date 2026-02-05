import { _decorator, AudioClip, Component, Label, Layout, Node, Sprite, SpriteFrame, Tween, tween, UI, UIOpacity, UITransform, Vec3 } from 'cc';
import { balanceToCash, getAvatar, numberToCash, numberToCurrency, setAvatarIcon } from '../../GlobalBlackJack';
import { BetAmount } from './BetAmount';
import { BlackJackUIScore } from '../game_ui/BlackJackUIScore';
import { BlackJackAvatarFrameOfMonth } from './BlackJackAvatarFrameOfMonth';
import { GameResultDisplay } from './GameResultDisplay';
import { BlackJackPlayerScorePosition } from './BlackJackPlayerScorePosition';
import { BlackJackAvatarLightFrame } from './BlackJackAvatarLigthFrame';
import { BlackJackManager } from '../manager/BlackJackManager';

const { ccclass, property } = _decorator;

@ccclass('BlackJackPlayerProfile')
export class BlackJackPlayerProfile extends Component {
    @property(Sprite) 
    avatar: Sprite = null;
    @property(Label) 
    profileName: Label = null;
    @property(Label) 
    balance: Label = null;
    @property(BetAmount) 
    betAmount: BetAmount = null;
    @property(BlackJackUIScore) 
    scoreAmount: BlackJackUIScore = null;
    @property(Node) 
    readyIcon: Node = null;
    @property(UIOpacity) 
    readyIconUiOpacity: UIOpacity = null;
    @property(UIOpacity) 
    uiOpacity: UIOpacity = null;
    @property(GameResultDisplay) 
    gameResult: GameResultDisplay = null;

    @property(BlackJackAvatarFrameOfMonth)
    frameOfMonth : BlackJackAvatarFrameOfMonth =null;
    
    private _amountGain: number = null;
    private _isResultSet: boolean = false;

    @property(Node)
    cardsNode : Node = null;

    @property(Node)
    betOrigin : Node = null;


    private _isSelf : boolean = false;
    private _isShowResultCompleted = false;

    @property(AudioClip) 
    betingchipsAudio: AudioClip = null;    

    private tweenReady: Tween<UIOpacity> | undefined = undefined;
    

    onLoad(): void {
        this.uiOpacity ??= this.getComponent(UIOpacity);
        this.readyIconUiOpacity ??= this.readyIcon?.getComponent(UIOpacity);
        this.reset();

        this.alignScorePanelToCardsCenter();
        this._isShowResultCompleted = false;
    }

    get readyOpacity(): UIOpacity {
        return this.readyIconUiOpacity ??= this.readyIcon?.getComponent(UIOpacity);
    }

    set isSelf(value : boolean ){        

        // const scorePosition = this.scoreAmount.getComponent(BlackJackPlayerScorePosition);
        // if(scorePosition){
        //     scorePosition.updatePosition(value);
        // }

        this._isSelf = value;
    }


    get getAvatarLightFrame():BlackJackAvatarLightFrame{


      var avaterFrame = this.getComponentInChildren(BlackJackAvatarLightFrame)

        if(avaterFrame){
            return avaterFrame;
        }
        else{
            return undefined;
        }
    }

    get betOriginNode(){
      return this.betOrigin;
    }

    reset(): void {
        this.readyIcon.active = false;
        this.readyOpacity.opacity = 0;
        this._amountGain = null;
        this._isResultSet = false;
        this.hideBetAmount();
        if(this.gameResult != null){ 
            this.gameResult?.reset();   
        }
    }

    onNewGame(): void {
        this.hideBetAmount();
        this._amountGain = null;
        this._isResultSet = false;
        if(this.gameResult != null){
            this.gameResult?.onNewGame();
        }
        this.scoreAmount?.onNewGame();
        this.setReady(false);
    }

    onWaiting(): void {
        this.hideBetAmount();
        if(this.gameResult != null){
            this.gameResult?.onWaiting();
        }
        this.scoreAmount?.onWaiting();
    }

    onEndGame(): void {
        this.hideBetAmount();
        if(this.gameResult != null){
            this.gameResult?.reset();
        }
        this.scoreAmount?.reset();
    }

    setResult(amount: number): void {
    // ✅ prevent accidental overwrites
        if (this._isResultSet) return;
        
        this._amountGain = amount;
        this._isResultSet = true;

        const isWinner = amount > 0;
        if(this.gameResult != null){
            this.gameResult?.responseResult(isWinner, amount,false);
        }
    }

    skipAnimationResult(resultAmount: number): void {
        const isWinner = resultAmount > 0;
        if(this.gameResult != null){
            this.gameResult?.responseResult(isWinner, resultAmount,true);
        }
    }

    startResultsAnimation(): void {

        var onShowResultCompleted=()=>{

        }
        if(this.gameResult != null){
            this.gameResult?.startAnimation(onShowResultCompleted);
        }
    }


    stopResultsAnimation(): void {
        if(this.gameResult != null){
            this.gameResult?.stopAnimation();
        }
    }

    setIsPlaying(isPlaying: boolean): void {
        this.uiOpacity.opacity = isPlaying ? 255 : 150;
    }

    setProfile(avatar: number): void {
        setAvatarIcon(avatar, this.avatar);
    }

    setReady(isReady: boolean): void {
        this.readyIcon.active = isReady;
        this.readyOpacity.opacity = isReady ? 255 : 0;
    }

    hideReady(skipAnim : boolean = false): void {
        if(skipAnim){
            this.readyOpacity.opacity = 0;
            this.readyIcon.active = false;
        }
        else{
            this.tweenReady = tween(this.readyOpacity)
                        .delay(0.5)
                        .to(0.5, { opacity: 0 }, { easing: 'fade' })
                        .call(() => { this.readyIcon.active = false; })
                        .start();
        }
       
    }

    onEndCompareCard(): void {
        this.tweenReady?.stop();
        this.tweenReady = undefined;
       // this.stopResultsAnimation();
    }

    setProfileName(name: string): void {
        this.profileName.string = name;
    }

    setBalance(balance: number): void {
        this.balance.string = balanceToCash(balance);
    }

    hideBetAmount(): void {
        if (!this.betAmount) return;
        this.betAmount.setBetAmount(0);
        this.betAmount.node.active = false;
    }

    setBetAmount(amount: number): void {
        if (!this.betAmount) return;
        this.betAmount.setBetAmount(amount);
        this.betAmount.node.active = amount > 0;
    }

    playAudioBettingChips(){
        if(BlackJackManager.instance){
            BlackJackManager.instance.playSound(this.betingchipsAudio);
        }
    }

    setStatusScore(score: number, result_status: string,isSelf : boolean = false): void {
        this.alignScorePanelToCardsCenter();
        this.scoreAmount?.setStatus(result_status, score);
    }

    setVisibleStatusScore( visible : boolean){
        this.alignScorePanelToCardsCenter();
        this.scoreAmount.active = visible;
    }


    alignScorePanelToCardsCenter() {
        if (!this.cardsNode || !this.scoreAmount) return;

        const layout = this.cardsNode.getComponent(Layout);
        const cardsUI = this.cardsNode.getComponent(UITransform);
        const scoreUI = this.scoreAmount.node.getComponent(UITransform);

        if (!layout || !cardsUI || !this.cardsNode.activeInHierarchy) {
            this.scoreAmount.node.setPosition(new Vec3(0, this.scoreAmount.node.position.y));
            return;
        }
        layout.enabled = true;
        layout.updateLayout();
        const totalWidth = cardsUI.width;
        const handCardsPosition = this.cardsNode.position;
        var centerOffset = 0;
        const anchorX_CardUI = cardsUI.anchorX ;
        if(anchorX_CardUI == 0){
            centerOffset = handCardsPosition.x + totalWidth/2;
        }
        else if(anchorX_CardUI == 1){
            centerOffset = handCardsPosition.x - totalWidth/2;
        }
        else {

            centerOffset = this.cardsNode.position.x + 0;
        }

        scoreUI.setAnchorPoint(cardsUI.anchorPoint);
        this.scoreAmount.node.setPosition(new Vec3(centerOffset, this.scoreAmount.node.position.y));

    }

}


