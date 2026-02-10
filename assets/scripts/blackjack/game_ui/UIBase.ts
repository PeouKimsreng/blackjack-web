import { _decorator, Component, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIBase')
export class UIBase extends Component {

    @property({type: UIOpacity})
    uiOpacity : UIOpacity;

    tweenUI : Tween;
    isShow : boolean = false;

    
    hide(){
        let tweenDuration: number = 0.2;
        if(this.uiOpacity == null){
            this.uiOpacity = this.getComponent(UIOpacity);
        }
        
        if (this.tweenUI !== undefined) {
            this.tweenUI.stop();
        }

        this.tweenUI = tween(this.uiOpacity)
            
            .to(tweenDuration, { opacity : 0 }, {  // 
            easing: "fade",})
            .call(() => {this.isShow = false;})
        .start();
    }

    show(){
        let tweenDuration: number = 0.1; 
        
        if(this.uiOpacity == null){
            this.uiOpacity = this.getComponent(UIOpacity);
        }

        if (this.tweenUI !== undefined) {
            this.tweenUI.stop();

        }

        let  tweenBounce =  tween(this.node).to(0.1,
             { scale: new Vec3(1.2, 1.2, 1.2) })
             .to(0.1, { scale: new Vec3(1, 1, 1)}, {easing: "bounceInOut"}
            )
            ;

        let tweenFade = tween(this.uiOpacity)
            .call(() => {
                this.isShow = true;
            })
            .to(tweenDuration, { opacity : 255 }, {  // 
            easing: "fade",});

        this.tweenUI = tween(this.node).parallel(tweenBounce,tweenFade).start();
    }
}


