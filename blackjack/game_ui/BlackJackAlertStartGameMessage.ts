import { _decorator, Component, director, isValid, Node, Sprite, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackAlertStartGameMessage')
export class BlackJackAlertStartGameMessage extends Component {


    @property(Sprite)
    messageSprite : Sprite = null;    
    isShow : boolean = false;

    static ins : BlackJackAlertStartGameMessage;
    
    tweenMove : Tween<Node> | null;

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackAlertStartGameMessage);
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


    hide(){
       this.resetTween();
       let tweenDuration: number = 0.5;
       this.tweenMove = tween(this.node)
            .to(tweenDuration, { position: new Vec3(0, 1000, 0) }, { 
            easing: "backIn",})
        .call(() => {
            this.node.position = new Vec3(0,1000,0)
            this.isShow = false;
        })
        .start();
    }

    show(){
       this.resetTween();
       let tweenDuration: number = 0.5; 
       this.tweenMove = tween(this.node)
            .call(()=>{ this.node.position = new Vec3(0,-1000,0)})
            .to(tweenDuration, { position: new Vec3(0, 66.488, 0) }, {
            easing: "backInOut",
        })
        .delay(1)
        .call(() => {
            if(this.isShow){
                this.hide();
            }
        })
        .start();
    }

}


