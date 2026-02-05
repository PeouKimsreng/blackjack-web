import { _decorator, Component, director, isValid, Node ,Label, Tween, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIAlertMessage')
export class BlackJackUIAlertMessage extends Component {

    @property(Label)
    private messageLabel: Label  = null;
 
    private delayHide?: number;
    private showTween: Tween<Node> = undefined;
    private _isActive : boolean = false;

    private static _ins: BlackJackUIAlertMessage = null;
    public static get instance() {
        if (!isValid(this._ins)) {
            this._ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIAlertMessage);
        }
 
        return this._ins;
    }

    set active(active: boolean){
        this._isActive = active;
        this.node.active = active;
    }
 
    get isActive(){
        return this._isActive;
    }

    onLoad() {
        this.node.active = false; // Initially hide the node
        this.delayHide = 0;
    }
 
    
    hide(){
        if (this.showTween !== undefined) {
            this.showTween.stop();
        }
 
        if(!this.isActive) return;
    
        this.showTween = tween(this.node)
            .to(0, { scale: Vec3.ZERO })
            .call(() => { this.active = false }) // Ensure the sprite is active
            .start(); // Start the tween
    }

    setMessage(message: string, delayHide: number = 0){
        this.messageLabel.string = message;
        this.delayHide = delayHide;
        this.show();
    }
 
    show(){
 
        if(this.isActive) return;
        this.scaleAnim();
        this.active = true;
    }

    scaleAnim() {
        // Stop any existing tween to avoid conflicts
        if (this.showTween !== undefined) {
            this.showTween.stop();
        }
 
        if(this.isActive) return;
    
        // Create a new tween for infinite rotation
        this.showTween = tween(this.node)
            .call(() => { this.active = true }) // Ensure the sprite is active
            .to(0, { scale: Vec3.ZERO })
            .by(0.2, { scale: Vec3.ONE })
            .delay(this.delayHide)
            .call(()=>{this.hide();})
            .start(); // Start the tween
    }
}


