import { _decorator, Component, Enum, isValid, Layout, nextPow2, Node, Size, Sprite, TiledUserNodeData, Tween, tween, UITransform, Vec3 } from 'cc';
import { BlackJackCard } from '../card/BlackJackCard';

const { ccclass, property } = _decorator;

export enum HandCardsComparingDirection {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2,
}

@ccclass('BlackJackHandCards')
export class BlackJackHandCards extends Component {    
    @property({ type: Enum(HandCardsComparingDirection) })
    direction: HandCardsComparingDirection = HandCardsComparingDirection.CENTER;

    @property(Sprite)
    frameSelected : Sprite;

    @property
    isHandForSplit : boolean = false;

    @property({type: BlackJackCard})
    cards : Array<BlackJackCard> = Array();
    @property({type: Node})
    slots : Array<Node> = Array();

    currentIndex : number = 0;
    
    currentCardsInHand : number = 0;

    _isResizeCard = false;

    private layout : Layout = undefined;
    private compareCardsTween: Tween<this> = undefined;

    private isComparing: boolean = false;
    private hasCompared: boolean = false;

    public get isCompareCardAnimPlaying(): boolean {
        return this.isComparing;
    }

    public get isCompareReady(): boolean {
        return this.hasCompared;
    }

    set setEnableSelected (active : boolean){

        if(this.frameSelected){
            this.frameSelected.enabled = active;
        }
    }

    getDirectionValue(dir: HandCardsComparingDirection): number {
        switch (dir) {
        case HandCardsComparingDirection.LEFT: return -1;
        case HandCardsComparingDirection.RIGHT: return 1;
        default: return 0;
        }
    }

    getCardNodeAt(cardIndex: number) {
        return this.cards[cardIndex];
    }

    getSlotAt(cardIndex: number) {
        return this.slots[cardIndex];//this.node.children[cardIndex];//this.slots[cardIndex]; 
    }

    updateHandPosition(isSelf : boolean){
      //  var handPos = this.getComponent(PlayerHandPosition);
      /*  if(handPos){
            handPos.updatePosition(isSelf);
        }
            */
    }
    
    isSelfPlayer: boolean = false;

    
 
    setResizeCard(isSelf: boolean): void {
        this._isResizeCard = isSelf;       // ✅ true = full-size
        this.isSelfPlayer = isSelf;       // ✅ used for visual logic
        this.updateSlotsContentSize(isSelf);
        this.cards.forEach(c =>{
             c.stopMove();
             c.updateContentSize(isSelf)
            }
            ); // ✅ Resize each card
        this.updateHandPosition(isSelf);
    }

    updateSlotsContentSize(resize: boolean): void {
        //const slotSize = resize ? new Size(154, 224) : new Size(90, 130);
        const slotSize = this.isHandForSplit ? new Size(59.76, 86.32) : new Size(72, 104);
        
        for (let slot of this.slots) {
            if (!slot) continue;
            slot.setScale(1, 1, 1);
            const uiTransform = slot.getComponent(UITransform);
            if (uiTransform) {
                uiTransform.setContentSize(slotSize);
            }
        }

        //this.Layout.spacingX = resize ? -13 :-42;//-54.4;;
        this.Layout.spacingX = -13 ;

        this.Layout.updateLayout();
    }


    get isResizeCard (): boolean
    {
        //return this._isResizeCard;
        return this.isHandForSplit;
    }

    get Layout(){

        if(this.layout === undefined){
            this.layout = this.node.getComponent(Layout);
        }
        return this.layout;
    }

    set setNumberCardsInHand(cardsNumber: number) {
        this.currentCardsInHand = cardsNumber;
        this.currentIndex = cardsNumber - 1;
    }

    get numberCardsInHand(): number{

        return this.currentCardsInHand;
    }

    hide(){
        this.node.active = false;
    }

    show(){
        this.node.active = true;
    }

    get currentCards() : BlackJackCard[]{
        var cards = [];
        for(var i = 0; i < this.cards.length; i++){
            if(i < this.currentCardsInHand){
                cards.push(this.cards[i]);
            }
        }
        return cards;
    }

    setCardToSlot(card: BlackJackCard, slotIndex: number) {
        if(slotIndex >= this.cards.length){
            return;
        }
        var slot=  this.node.children[slotIndex];
        card.node.parent = slot;
        card.node.scale= new Vec3(1,1,1);
        this.show();
    }

    updateLayouts(){
        this.layout.updateLayout();
    }

    updateContenSize(isMe : boolean){
        this.cards.forEach(c => c.updateContentSize(isMe));
    }

    onNewGame(){
        this.isComparing = false;
        this.hasCompared = false;

        this.currentIndex = 0;
       // this.setNumberCardsInHand = 0;
        this.hideAllSlots();

        this.cards.forEach(c => 
            {
                c.stopDeal();
                //c.data = undefined;
                c.setStringCard("");
                //c.setBackCard()
                c.hideCard(); 
                c.updateContentSize(false);   
            }
        );
        this.Layout.enabled = true;
        this.Layout.updateLayout();
    }

    onClear(){

        this.currentIndex = 0;
       // this.setNumberCardsInHand = 0;
        this.cards.forEach(c => {
            c.setBackCard()
            c.hideCard();
        }
        );
    }

    
    hideAllSlots(){
        this.node.children.forEach(element => {
            if(isValid(element) && element.name.startsWith("slot"))
                element.active=false;
        });
    }
    

    hideAllCards(){
        this.cards[0].hideCard();
        this.cards[1].hideCard();
        this.cards[2].hideCard();
        this.cards[3].hideCard();
        this.cards[4].hideCard();
        this.cards[5].hideCard();
        this.cards[6].hideCard();
    }

    hideCard4To7(){
        this.cards[3].hideCard();
        this.cards[4].hideCard();
        this.cards[5].hideCard();
        this.cards[6].hideCard();
    }

    hideCardBackAt(index : number){
        this.cards[index].setBackCard();
        this.cards[index].hideCard();
    }

    openDealerSecondsCard(data : string){
        this.cards[1].setStringCard(data);
        this.cards[1].updateContentSize(this.isResizeCard);
        this.cards[1].openCardFace();
    }

    setCard(index : number, data : string){
        this.getSlotAt(index).active = true;
        this.cards[index].setStringCard(data);
        this.cards[index].updateContentSize(this.isResizeCard);
        this.cards[index].active = true;
    }
    
    deal2(delay : number,i : number = 0,data ?:string){
        if(i < 7 ){
            this.currentIndex = i;
            //this.node.active = true;
            this.cards[i].setStringCard(data);
            
            this._isResizeCard = false;
            this.cards[this.currentIndex].moveToHand(delay,this.isResizeCard,()=>{
                this.cards[this.currentIndex].openCardFace();
            });
        }
        this.Layout.enabled = true;
        this.Layout.updateLayout();
    }

    prepareLayoutForCompare(isSelf: boolean, resetAll: boolean = true): void {
        this.node.active = true;

        // Update resize flag and spacing based on self
        this.setResizeCard(isSelf);

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const slot = this.slots[i];
            const shouldBeActive = i < this.currentCardsInHand;

            if (resetAll && card) {
                card.setBackCard?.();
                card.setScaleToONE?.();
            }

            if (shouldBeActive) {
                slot.active = true;
                //card.node.active = true;
                slot.scale = new Vec3(1, 1, 1); // Reset slot scale for compare
                card.updateContentSize(isSelf);
                
            } else {
                if (resetAll) {
                    slot.active = false;
                    card.active = false;
                    card.hideCard?.();
                }
            }
        }

        // Force layout to fully resolve BEFORE animations begin
        this.Layout.enabled = true;
        this.Layout.updateLayout();
        this.Layout.enabled = false; // 🔒 optional: freeze layout to prevent shake during tween
    }
    /*

    prepareLayoutForDeal(isSelf: boolean, resetAll: boolean = true): void {
        this.node.active = true;

        // Update resize flag and spacing based on self
        this.setResizeCard(isSelf);

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            const slot = this.slots[i];
            const shouldBeActive = i < this.currentCardsInHand;

            if (resetAll && card) {
                card.setBackCard?.();
                card.setScaleToONE?.();
            }

            if (shouldBeActive) {
                slot.active = true;
                //card.node.active = true;
                card.updateContentSize(isSelf);
            } else {
                if (resetAll) {
                    slot.active = false;
                    card.active = false;
                    card.hideCard?.();
                }
            }
        }

        // Force layout to fully resolve BEFORE animations begin
        this.Layout.enabled = true;
        this.Layout.updateLayout();
        this.Layout.enabled = false; // 🔒 optional: freeze layout to prevent shake during tween
    }


    prepareLayoutForDealAndReset(isSelf: boolean, resetAll: boolean = true): void {
        this.node.active = true;
        this.setResizeCard(isSelf); // updates spacingX and internal flag

        for (let i = 0; i < this.cards.length; i++) {
            const slot = this.getSlotAt(i);
            const card = this.getCardNodeAt(i);

            const shouldBeActive = i < this.currentCardsInHand;

            if (slot) slot.active = shouldBeActive;
            if (card) {
                if (resetAll) {
                    card.setScaleToONE?.();
                    card.setBackCard?.();
                }

                if (shouldBeActive) {
                   // card.node.active = true;
                    card.updateContentSize(isSelf);
                } else {
                    if (resetAll) {
                        card.node.active = false;
                        card.hideCard?.();
                    }
                }
            }
        }

        // Refresh layout
        this.Layout.enabled = true;
        this.Layout.updateLayout();
    }

*/
    deal(delay: number) {
        this.Layout.enabled = false;

        if (this.currentIndex < 3) {
            this.node.active = true;

            const cardToDeal = this.cards[this.currentIndex];
            const slot = this.slots[this.currentIndex];

            //const playingCount = SamgongManager.instance.getPlayersPlaying().length;
            cardToDeal.moveToHand(delay,this.isResizeCard);   
           // CardDealer.instance.dealCardToSlot(cardToDeal.node, slot, delay);

            this.currentIndex += 1;
        }

        // Re-enable layout AFTER animation ends (optional based on timing)
        setTimeout(() => {
            this.Layout.enabled = true;
            this.Layout.updateLayout();
        }, (delay + 0.2) * 1000); // adjust timing as needed
    }

    DealNextCard(card: BlackJackGame.Card, isSelf: boolean = false) {
        if (this.currentIndex < 7) {
            this.node.active = true;

            const nextCard = this.cards[this.currentIndex];
            const slot = this.slots[this.currentIndex];      
            nextCard.showCard()
            // Animate the card into hand
            /*CardDealer.instance.dealCardToSlot(card,
                nextCard.node,
                slot,
                0,      // no delay
                1, 1,   // 1 player, 1 card
                isSelf
            );
            */  

            this.currentIndex += 1;
        }

        this.Layout.enabled = true;
        this.Layout.updateLayout();
    }



    onEndRanking(){
        this.cards.forEach( card => {
            card.stopDeal();
        });
    }

    stopAnimateCompareCard(){
         if(this.compareCardsTween){
            //this.compareCardsTween.stop();
            this.compareCardsTween = undefined;
         }
       // this.Layout.enabled = true;
       // this.layout.updateLayout();
        this.isComparing = false;
        this.hasCompared = true;
    }

    animateComapreCards(onCollaped: () => void, onExtracted: () => void) {
        this.isComparing = true;
        this.hasCompared = false;

        const handPos = this.Layout.node.getWorldPosition();
        const totalToAnimate = this.currentCardsInHand;
        let completedCount = 0;

        this.compareCardsTween = tween(this)
            .call(() => {
                this.Layout.enabled = false;
            })
            .call(() => {
                for (let i = 0; i < this.cards.length; i++) {
                    const card = this.cards[i];
                    card.updateContentSize(this.isResizeCard);

                    if (i < totalToAnimate) {
                        card.animationBeginCompare(
                            handPos,
                            this.getDirectionValue(this.direction),
                            onCollaped,
                            () => {
                                completedCount++;
                                if (completedCount === totalToAnimate) {
                                    // ✅ Only when all cards have finished animating
                                    this.isComparing = false;
                                    this.hasCompared = true;
                                    onExtracted?.();
                                }
                            }
                        );
                    } else {
                        card.hideCard();
                    }
                }

                // Edge case: no cards to animate
                if (totalToAnimate === 0) {
                    this.isComparing = false;
                    this.hasCompared = true;
                    onExtracted?.();
                }
            })
            .start();
    }



    onEndCompareCard(){
         
       this.stopAnimateCompareCard();

        this.show();
    }

    responseDealCards(card_size : number, cards: BlackJackGame.Card[]) {
        
        this.node.active = true;
        this.node.getComponent(Layout).enabled = true;
    
        for(var i = 0; i < this.cards.length; i++){

            if( i >= card_size){
                this.cards[i].node.active = false;
                this.cards[i].hideCard();
            }
            else{
               // this.cards[i].node.active = true;
               // this.cards[i].showCard();

                if(cards[i] == null || cards[i] === undefined){
                    this.cards[i].setBackCard();
                }
                else{
                    this.cards[i].responseCard(cards[i]);
                }
            }            
        }
    }

    responseCards( cardDatas : BlackJackGame.Card[]){
        if(cardDatas == null){
            return;
        }
           
        var cardSize = cardDatas.length;
        for(var i = 0; i < this.cards.length; i++){
            if(i < cardSize)
            {                
                this.cards[i].showCard();
                this.cards[i].responseCard(cardDatas[i]);
                this.cards[i].openCard(this.isResizeCard);
            }   
            else{
                this.cards[i].hideCard();
            }
        }
    }

    onConfirmedCard(cardSize: number,  cardDatas : BlackJackGame.Card[]){

        if(cardDatas.length > 0){
            for(var i = 0; i < this.cards.length; i++){
                if(i < cardDatas.length){
                    this.cards[i].setScaleToONE();
                    this.cards[i].setCardToHand();
                    this.cards[i].responseCard(cardDatas[i]);
                    this.cards[i].showCard();
                    this.cards[i].openCard(this.isResizeCard);
                }
            }
        }
        else{
            this.activeBackCardsBySize(cardSize);
        }
    }

    activeCardsBySize( cardSize : number , isSkipAnimation: boolean = false){
        
        this.currentCardsInHand = cardSize;
        // active all cards depending on the number of cards in the array
        for(var i = 0; i < this.cards.length; i++){
            
            if( i <  this.currentCardsInHand) {
                if(isSkipAnimation){
                    this.cards[i].stopMove();
                }
                this.cards[i].showCard();
                this.cards[i].setScaleToONE();
                this.cards[i].updateContentSize(this.isResizeCard);
            }
            else{
                this.cards[i].hideCard();
                this.cards[i].setScaleToONE();
                this.cards[i].updateContentSize(this.isResizeCard);
            }
        }
    }

    activeBackCardsBySize( cardSize : number ){
        this.currentCardsInHand = cardSize;
        // active all cards depending on the number of cards in the array
        for(var i = 0; i < this.cards.length; i++){
            
            if( i <  this.currentCardsInHand) {
                this.cards[i].setScaleToONE();
                this.cards[i].setBackCard();
                this.cards[i].showCard();
                this.cards[i].updateContentSize(this.isResizeCard);
            }
            else{
                this.cards[i].setScaleToONE();
                this.cards[i].hideCard();
                this.cards[i].setBackCard();
                this.cards[i].updateContentSize(this.isResizeCard);
            }
        }
    }

    activeBackCards( cardDatas : BlackJackGame.Card[]){
        if(cardDatas == null){
            
            this.currentCardsInHand = cardDatas.length;

            // active all cards depending on the number of cards in the array
            for(var i = 0; i < this.cards.length; i++){
                if( i >= cardDatas.length){
                    this.cards[i].setBackCard();
                    this.cards[i].hideCard();
                    
                }
                else{
                    this.cards[i].showCard();
                    this.cards[i].updateContentSize(this.isResizeCard);
                }
            }

        }

    }
 
   onSkipAnimationCompare(datas: BlackJackGame.Card[], onOpenCardsAnimationCompleted: () => void) {
        if (datas != null) {
            this.setNumberCardsInHand = datas.length;

            for (let i = 0; i < this.cards.length; i++) {
                const card = this.cards[i];
               // CardDealer.instance.stopCardTween(card.node);
                card.stopDeal();
                card.stopMove();
                card.node.setScale(Vec3.ONE);
                card.node.scale = new Vec3(1,1,1);
                card.updateContentSize(true);

                if (i < this.currentCardsInHand) {
                    this.getSlotAt(i).scale = Vec3.ONE;
                    card.responseCard(datas[i]);
                    card.showCard();
                    card.updateContentSize(this.isSelfPlayer);
                } else {
                    card.hideCard();
                    card.setBackCard();
                    card.updateContentSize(this.isSelfPlayer);
                }
            }

           this.Layout?.updateLayout();
            onOpenCardsAnimationCompleted();
        }
    }
    
    onCompareCards(datas : BlackJackGame.Card[],onOpenCardsAnimationCompleted :()=>void){
        
        if(datas != null){
            //this.activeBackCards(datas);

            this.animateComapreCards(()=>{
                for(var i = 0; i < this.cards.length; i++){
                    const card = this.cards[i];
                    if( i >= datas.length){
                        card.setBackCard();
                        card.hideCard();
                    }
                    else{
                        card.showCard();
                        card.responseCard(datas[i]);
                        card.updateContentSize(this.isResizeCard);
                        card.openCard(this.isResizeCard);
                    }
                }                
            },
            ()=>{
                onOpenCardsAnimationCompleted();    
            });
        }
        else{
            onOpenCardsAnimationCompleted();
        }
    }

    onWaiting(){
        this.currentIndex = 0;
        this.cards.forEach(c =>{ 
            c.hideCard();

        });
    }


    delay(time: number) {
        return new Promise(resolve => setTimeout(resolve,time));
    }

    update(deltaTime: number) {
        
    }

    collectCards(){
        this.currentIndex =0;

        for (let i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            card.active = false;
          if(isValid(card)){
                var target =  this.node; //BlackJackDeck.instance.node;
                card.setParent(target)
                card.node.scale = new Vec3(0.3,0.3,1);
                // reset card to back
                card.getComponent(BlackJackCard).setBackCard();

          }
        }
    }
}


