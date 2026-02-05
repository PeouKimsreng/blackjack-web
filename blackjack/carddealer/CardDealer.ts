import { _decorator, Component, Node, Vec3, UITransform, tween, isValid, director, Tween, Layout, Size, AudioClip } from 'cc';
import { BlackJackDeck } from '../card/BlackJackDeck';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackCard } from '../card/BlackJackCard';


const { ccclass, property } = _decorator;

@ccclass('CardDealer')
export class CardDealer extends Component {
    @property(Node)
    dealingLayer: Node = null;
    @property(Node)
    dealerHandNode: Node = null;

    @property(Node)
    shoeBoxNode: Node = null;

    @property(AudioClip)
    dealCardAudio : AudioClip = null;

    private deckNode: Node = null;

    private static _ins: CardDealer = null;


    

    static get instance() {
        if (!isValid(this._ins)) {
            this._ins = director.getScene().getChildByPath('Canvas/table/CardDealer')?.getComponent(CardDealer);
        }
        return this._ins;
    }

    onLoad() {
        // Auto-locate the Deck node from Deck singleton
        const deckComp = BlackJackDeck.instance;
        if (isValid(deckComp)) {
            this.deckNode = deckComp.node;
        } else {
            console.error("Deck.instance not found!");
        }
    }

    /**
     * Decide where to place the deck node based on dealer presence.
     */
    public updateDeckPosition(hasDealer: boolean): void {
        if (!this.deckNode || !this.shoeBoxNode || !this.dealerHandNode) return;

        const targetWorldPos = hasDealer ?
            this.dealerHandNode.getWorldPosition() :
            this.shoeBoxNode.getWorldPosition();

        const parent = this.deckNode.parent;
        if (!parent) return;

        const localPos = parent.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);
        this.deckNode.setPosition(localPos);
    }

    playDealSound() {
        BlackJackManager.instance.playSound?.(this.dealCardAudio);
    }
    
   private activeCardTweens: Map<Node, Tween<Node>> = new Map();

   public stopCardTween(cardNode: Node): void {
        if (this.activeCardTweens.has(cardNode)) {
            tween(cardNode).stop();
         
            this.activeCardTweens.delete(cardNode);
        }
    }


    public dealCardToSlot(
        cardData: BlackJackGame.Card,
        cardNode: Node,
        slotNode: Node,
        delay: number,
        totalPlayers: number = 6,
        totalCards: number = 3,
        isResizeCard: boolean = false
    ): void {
        if (!this.deckNode || !this.dealingLayer) return;

        const deckWorldPos = this.deckNode.getWorldPosition();

        //const slotLayout = slotNode.parent?.getComponent(UITransform);
      //  slotLayout?.node.getComponent(Layout)?.updateLayout?.();

        const targetWorldPos = slotNode.getWorldPosition();
        const targetLocalPos = this.dealingLayer
            .getComponent(UITransform)
            .convertToNodeSpaceAR(targetWorldPos);

        const baseDuration = 0.2;
        const totalDeals = Math.max(1, totalPlayers * totalCards);
        const speedFactor = Math.min(1.0, 6 / totalDeals);
        const actualDuration = baseDuration * speedFactor;

        // Stop existing tween for this cardNode if any
        if (this.activeCardTweens.has(cardNode)) {
            tween(cardNode).stop();
            this.activeCardTweens.delete(cardNode);
        }

        const sequence = tween(cardNode)
            .delay(delay)
            .call(() => {
                cardNode.parent = this.dealingLayer;
                cardNode.setWorldPosition(deckWorldPos);
                cardNode.setScale(new Vec3(0.3, 0.3, 1));
                cardNode.active = true;
                slotNode.active = false;
                this.playDealSound();
            })
            .to(actualDuration, {
                position: targetLocalPos,
                scale: Vec3.ONE
            }, { easing: 'quadOut' })
            .call(() => {
                cardNode.parent = slotNode;
                const cardComponent = cardNode.getComponent(BlackJackCard);
                if (cardComponent) {
                    cardComponent.responseCard(cardData);
                    cardComponent.updateContentSize(isResizeCard);
                }
                cardNode.setPosition(Vec3.ZERO);
                cardNode.setScale(Vec3.ONE);
                cardNode.active = true;
                const size: Size = isResizeCard ? new Size(154, 224) : new Size(90, 130);
                slotNode.getComponent(UITransform)?.setContentSize(size);
                slotNode.active = true;

                // Remove tween record once completed
                this.activeCardTweens.delete(cardNode);
            });

        // Store and start the tween
        this.activeCardTweens.set(cardNode, sequence);
        sequence.start();
    }

}
