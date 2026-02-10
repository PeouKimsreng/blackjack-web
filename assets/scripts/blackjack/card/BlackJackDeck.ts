import { _decorator, Component, director, isValid, Node, sp, Vec3 } from 'cc';
import { BlackJackManager } from '../manager/BlackJackManager';
const { ccclass, property } = _decorator;

@ccclass('BlackJackDeck')
export class BlackJackDeck extends Component {
    @property(sp.Skeleton)
    shuffleSpine : sp.Skeleton;

    @property(Node)
    shoeBoxNode : Node;

    private _done: boolean;
    public get done() {
        return this._done;
    }

    private static _ins: BlackJackDeck = null;

    static get instance() {
        if (!isValid(this._ins)) {
           this._ins = director.getScene().getChildByPath('Canvas/table/Deck')?.getComponent(BlackJackDeck);

        }
        return this._ins;
    }

    set SetPosition (position: Vec3){
        this.node.position = position;
    }

    initDeckPositionOnDeal(){
        if(this.shoeBoxNode == undefined){
             return;
        }
        BlackJackDeck.instance.SetPosition = this.shoeBoxNode.activeInHierarchy ? new Vec3(232, 265,0) : new Vec3(0,296.046 ,0);
    }

    collectsAllCardToDeck(){
        var players = BlackJackManager.instance.players.seats;
        players.forEach(p=> {

            //p.hand.collectCardsToDeck()
            p.hand.collectCards()
            // hide all cards in hand cards before deal
            p.hand.node.active = false;
        });

        this._done = true;
    }

    collectAllCards(){
        var players = BlackJackManager.instance.players.seats;

        var allCards = [
            ...players[0].hand.cards,
            ...players[1].hand.cards,
            ...players[2].hand.cards,
            ...players[3].hand.cards,
            ...players[4].hand.cards,
            ...players[5].hand.cards,
        ];
        

        players[0].hand.collectCards(),
        players[1].hand.collectCards(),
        players[2].hand.collectCards(),
        players[3].hand.collectCards(),
        players[4].hand.collectCards(),
        players[5].hand.collectCards()
        return allCards;
    }

    hideDeck(){
        this.shuffleSpine.node.active = false;
    }

    shuffleCards(oncomplete: () => void ){

        this.shuffleSpine.node.active =true;

        this.shuffleSpine.setAnimation(0,'shuffle',false);

        this.playShuffleCardsSpine('shuffle',false,()=>{
            this.idleAnimation();
            oncomplete();
        });
    }

    private idleAnimation(){
      this.clearAnimation();
      this.shuffleSpine.setAnimation(0, 'idle', true);
    }

    clearAnimation(){
        this.shuffleSpine.clearAnimation();
    }
    
    private playShuffleCardsSpine(animName: string, loop: boolean, oncomplete: () => void) {
        let spine = this.shuffleSpine;
        spine.node.active = true;
        spine.clearTracks();     
        spine.setCompleteListener((trackEntry) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName === 'shuffle') {
                spine!.clearTrack(0);
            }
            var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
            //console.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            // complete listener            
            if(oncomplete){
                oncomplete();
            }

        });
        spine.setAnimation(0, animName, loop);
    }

    public reset() {
        this._done = false;

        // if (this.shuffleAudioId !== undefined) {
        //     cc.audioEngine.stopEffect(this.shuffleAudioId);
        // }
    }

}



