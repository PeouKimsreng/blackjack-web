import { _decorator, assetManager, AudioClip, Component, director, isValid, Node, Size, Sprite, SpriteAtlas, SpriteFrame, tween, Tween, UITransform,Vec3 } from 'cc';
import { getCard, getCardByName } from '../../GlobalBlackJack';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackDeck } from './BlackJackDeck';
const { ccclass, property } = _decorator;

@ccclass('BlackJackCard')
export class BlackJackCard extends Component {
    
    @property(Sprite)
    sprite : Sprite ;
    @property(AudioClip)
    private dealClip: AudioClip = null;

    isOpened : boolean = false;
    isBack : boolean = false;

    @property(Node)
    private originParent : Node = undefined;
    private originPosition : Vec3 = Vec3.ZERO;
    private dealTween: Tween<Node> = undefined;
    private moveTween: Tween<Node>| null = null;
    tweenMove1: Tween<Node> | null = null;
    tweenMove2: Tween<Node> | null = null;
    

    private dealValue: string = undefined;
    moveDuration: number = 0;
    data : BlackJackGame.Card ;

    private uiTransform : UITransform = undefined;

    public get active() {
        return this.node.active;
    }
    public set active(value: boolean) {
        this.node.active = value;
    }


    get getUITransform (): UITransform{        
        if(this.uiTransform === undefined){
            this.uiTransform = this.getComponent(UITransform);
        }
        return this.uiTransform;
    }


    start(): void {
        
        this.data = undefined;
        this.getUITransform;
    }

    setStringCard(value: string) {
        this.dealValue = value;
        getCardByName(this.sprite, value);
    }

    openCardFace(){
        if(this.dealValue === undefined){
            return;
        }
        getCardByName(this.sprite, this.dealValue);
    }

    private setCard( rank : string , suit : string){

        this.isBack = rank == "back";

        getCard( this.sprite,rank, suit);
    }

    setScaleToONE() {
      this.node.scale = Vec3.ONE;
    }

   updateContentSize(resize: boolean) {
        //const size = resize ? new Size(154, 224) : new Size(90, 130); // ✅ true = full-size
        //const size = new Size(72,104);//new Size(90, 130);

        const size = resize ? new Size(59.76, 86.32) : new Size(72,104) // ✅ true = full-size
        this.node.setScale(1, 1, 1);
        this.node.getComponent(UITransform).setContentSize(size);
    }

    responseCard( card : BlackJackGame.Card){

        if(card === undefined || card.rank === undefined || card.suit === undefined){
            this.setBackCard();
            return;
        }
        this.data = card;
        this.setCard(card.rank, card.suit);
    }

    setBackCard(){
        this.setCard("back ", "card");
    }

    hideCard(){
        this.node.active = false;

        this.originParent.active = false;
    }

    showCard(){
        this.originParent.active = true;
        this.active = true;
    }

    setActiveAndOpenCard(data: string){
        this.active = true;
        this.setStringCard(data);
    }

    openCard(resize:boolean = false){
        if(this.data === undefined){
            this.active = false;
            this.originParent.active = false;
            return;
        }

        this.setCard(this.data.rank, this.data.suit);

        this.updateContentSize(resize);
    }


    getCard(rank : string , suit : string) : SpriteFrame {
    
        if(rank == "Jack"){
            rank = "J";
        }
        else if(rank == "Queen"){
            rank = "Q";
        }
        else if(rank == "King"){
            rank = "K";
        }
        else if(rank == "Ace"){
            rank = "A";
        }
    
        if(suit == "Hearts"){
            suit = "H";
        }
        else if(suit == "Diamonds"){
            suit = "D";
        }
        else if(suit == "Clubs"){
            suit = "C";
        }
        else if(suit == "Spades"){
            suit = "S";
        }    
        const cardName = rank + suit;
        var cardSprite : SpriteFrame = (assetManager.bundles.get('resources').get(`card`, SpriteAtlas) as SpriteAtlas).getSpriteFrame(cardName);
        return cardSprite;
    
    
    }

    setToDealPosition(){
        const worldPos = this.node.getWorldPosition();
        this.node.setWorldPosition(worldPos);
    }

    setPositionToTarget(targetNode: Node)
    {

        var parentTargetTranform : UITransform = targetNode.parent.getComponent(UITransform);
        var targetPos = parentTargetTranform.convertToWorldSpaceAR(targetNode.position);        
        this.node.setWorldPosition(targetPos);
    }

    setToRankingPosition(){
        this.node.parent = this.originParent;
        this.node.position = Vec3.ZERO;
    }

    setCardToHand(){
        this.node.parent = this.originParent;
        this.node.position = Vec3.ZERO;
        this.showCard();
    }

    get getCardNode(): Node {
        return this.node;
    }

    moveToHand(delay: number,resize: boolean,onComplete : ()=>void = null) {
        this.node.parent = this.originParent;
        this.node.position = Vec3.ZERO;
       // this.node.scale = new Vec3(0.3,0.3,1);
        this.dealCard(0.1,delay,Vec3.ONE,()=>{
            this.showCard();
            this.updateContentSize(resize);
            onComplete();
        });
    }

    moveNextCardToHand(card: BlackJackGame.Card, delay: number, resize: boolean) {
        this.node.active = true;
        this.originParent.active = true;
        this.node.parent = this.originParent;
        this.node.position = Vec3.ZERO;
      //  this.node.scale = new Vec3(0.3, 0.3, 1);

        this.dealCard(0.1, delay, Vec3.ONE, () => {
            this.showCard();

            if (card.rank !== undefined) {
                this.responseCard(card);
                this.openCard(resize);
            }

            this.updateContentSize(resize);
        });
    }
   
    dealCard(moveDuration: number, delay: number, targetScale: Vec3, onComplete: Function = null) {
        Tween.stopAllByTarget(this.node);

        const moveCard = tween(this.node)
            .call(() => {
                this.node.parent.active = true;
                const worldPos = BlackJackDeck.instance.node.getWorldPosition();
                const localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
                this.node.setPosition(localPos); // 💡 use local pos
                this.active = true;
            })
            .to(
                moveDuration,
                { position: Vec3.ZERO }, // Move to slot center
                {
                    onComplete: (target?: object) => {
                        const cardNode = target as Node;
                        cardNode.position = Vec3.ZERO;
                    },
                }
            );

        const scaleCard = tween(this.node)
            .to(0, { scale: new Vec3(0.3, 0.3, 1) })
            .to(
                moveDuration * 0.8,
                { scale: targetScale },
                {
                    onComplete: (target?: object) => {
                        const cardNode = target as Node;
                        cardNode.scale = targetScale;
                    },
                }
            );

        this.dealTween = tween(this.node)
            .call(() => {
               // this.active = true;
                this.originParent.active = true;

                this.setToDealPosition(); // Optional now, handled above
               // this.setBackCard();
                this.node.scale = new Vec3(0.3, 0.3, 1);
            })
            .delay(delay)
            .parallel(scaleCard, moveCard)
            .call(() => {
                this.dealTween = undefined;
                //BlackJackManager.instance.playSound(this.dealClip);
                  BlackJackManager.instance.playSound(this.dealClip);
                const manager = director.getScene()
                    ?.getChildByName('Canvas')
                    ?.getComponent('BlackJackManager') as { playSound?: (clip: AudioClip) => void } | null;
                manager?.playSound?.(this.dealClip);
                this.showCard();
                // if (this.data !== undefined) {
                //     this.responseCard(this.data);
                //     this.openCard();
                // }

                this.node.scale = targetScale;
                this.node.position = Vec3.ZERO;

                if (onComplete) onComplete();
            })
            .start();
    }

    public stopMove(){
        
        if (this.dealTween !== undefined) {
            this.dealTween.stop();
        }

        this.node.scale = Vec3.ONE;
        this.updateContentSize(true);
        
        /*
        if (this.tweenMove1) {
            this.tweenMove1.stop();
            this.tweenMove1 = null;
        }

        if (this.tweenMove2) {
            this.tweenMove2.stop();
            this.tweenMove2 = null;
        }

        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }
        */


       // Tween.stopAllByTarget(this.node);
        this.node.scale = Vec3.ONE;
        this.updateContentSize(true);
    }

    public stopDeal() {
        if (this.dealTween !== undefined) {
            this.dealTween.stop();
            this.dealTween = undefined;
        }
        //Tween.stopAllByTarget(this.node);

        
        this.node.scale = Vec3.ONE;
    }

    reset() {
        this.resetParent();
    }

    setOriginParent(value: Node) {
       // this.originParent = value;
    }

    protected onLoad(): void {
      //  this.originParent = this.node.parent;
        this.originPosition = this.node.position;
        this.moveDuration = 0.5;
    }

    resetParent() {

        if (!isValid(this.originParent)) {
           // this.originParent = this.node.parent;
        }

        this.setParent(this.originParent, Vec3.ZERO);
    }


    setParent(value: Node, localPosition?: Vec3) {
        if (!isValid(value)) {
            console.error(value);
            return;
        }

        if (!isValid(this.originParent)) {
         //   this.originParent = this.node.parent;
        }

      //  this.oldParent = this.node.parent;

        if (!localPosition) {
            localPosition = value.getComponent(UITransform).convertToNodeSpaceAR(this.getUITransform.convertToWorldSpaceAR(Vec3.ZERO));
        }

        this.node.setParent(value);
        this.node.setPosition(localPosition);
    }

    
     animationBeginCompare(handPos :Vec3,direction : number,onBegin : ()=>void,onEnd : ()=>void){

        const backPos = Vec3.ZERO;//this.node.position;

        const cardWidth = this.getUITransform.width;
        
        const beginComparePos = new Vec3(handPos.x - (cardWidth / 2 * direction), handPos.y, handPos.z);

        const localHandPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(beginComparePos);
        

        this.tweenMove1 = tween(this.node).to(0.5, { position: localHandPos},
            {
                onComplete : (target?: object) => {                  // Start the tween
                    var cardNode : Node =target as Node;
                },
                }
            );

        this.tweenMove2 = tween(this.node).to(this.moveDuration, { position: backPos},
            {
                onComplete : (target?: object) => {                  // Start the tween
                    var cardNode : Node =target as Node;
                    cardNode.position = backPos;
                },
                }
            );
         
           this.moveTween =  tween(this.node)
            .delay(0.1)
            .then(this.tweenMove1)
            .delay(1)
            .call(onBegin)
            .then(this.tweenMove2)
            .call(onEnd)
            .start();
    }

    /*onEndCompare(){
         const backPos = Vec3.ZERO;

        if(this.moveTween){
            this.moveTween.stop();
            this.moveTween = undefined;
        }
        this.resetParent();        
        this.getCardNode.position = backPos;
    }
    */
    

}


