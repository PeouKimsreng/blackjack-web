import { _decorator, Component, director, isValid, Node, Quat, sp, tween, Tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIWaitingDealer')
export class BlackJackUIWaitingDealer extends Component {

    
    @property(Node)
    waitingSprite : Node

    @property(sp.Skeleton)
    waitingDealerSpine : sp.Skeleton

    private showTween: Tween<Node> = undefined;
    private _isActive : boolean = false;

     static ins : BlackJackUIWaitingDealer = null;
    
        static get instance() {
            if (!isValid(this.ins)) {
                this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIWaitingDealer);
            }    
            return this.ins;
        }


    protected onLoad(): void {

       // this.hide();
    }

    set active(active: boolean){
        this._isActive = active;
       this.waitingSprite.active = active;
       this.waitingDealerSpine.node.active = active;
    }

    get isActive(){
        return this._isActive;
    }

    hide(){
        if (this.showTween !== undefined) {
            this.showTween.stop();
        }

        if(!this.isActive) return;
    
        this.showTween = tween(this.waitingSprite)
            .to(0, { scale: Vec3.ZERO })
            .call(() => { this.active = false }) // Ensure the sprite is active
            .start(); // Start the tween
    }

    show(){

        if(this.isActive) return;
        this.scaleAnim();

        this.active = true;
        this.waitingDealerSpine.setAnimation(0, 'animation', true);
    }

    scaleAnim() {
        // Stop any existing tween to avoid conflicts
        if (this.showTween !== undefined) {
            this.showTween.stop();
        }

        if(this.isActive) return;
    
        // Create a new tween for infinite rotation
        this.showTween = tween(this.waitingSprite)
            .call(() => { this.active = true }) // Ensure the sprite is active
            .to(0, { scale: Vec3.ZERO })
            .by(0.2, { scale: Vec3.ONE })

            .start(); // Start the tween
    }
}


