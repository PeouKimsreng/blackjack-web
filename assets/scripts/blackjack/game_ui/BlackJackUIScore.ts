import { _decorator, Component, director, isValid, Label, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';
import { BlackJackCustomDigitLabel } from '../menu/BlackJackCustomDigitLabel';
//import { CustomDigitLabel } from '../menu/CustomDigitLabel';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIScore')
export class BlackJackUIScore extends Component {


    @property(BlackJackCustomDigitLabel)
    uiScore : BlackJackCustomDigitLabel = null;

    timmer : number = 0;
    isShow : boolean = false;

    @property (UIOpacity)
    private uiOpacity : UIOpacity = null;

    tweenTimerUI : Tween;
    tweenShake : Tween;

    setDisplayScore(score: number) {
        this.uiScore.setDisplay(`${score}`);
    }


    onLoad(): void {
       
    }
    
    hide(){
        let tweenDuration: number = 0.2;
        if(this.uiOpacity == null){
            this.uiOpacity = this.getComponent(UIOpacity);
        }
        
        if (this.tweenTimerUI !== undefined) {
            this.tweenTimerUI.stop();
            this.tweenTimerUI = undefined;
        }

        if(this.tweenShake !== undefined){
            this.tweenShake.stop();
            this.tweenShake = undefined;
        }

        this.tweenTimerUI = tween(this.uiOpacity)
            
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

        if (this.tweenTimerUI !== undefined) {
            this.tweenTimerUI.stop();

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

        this.tweenTimerUI = tween(this.node).parallel(tweenBounce,tweenFade).start();
    }    

    set active(active: boolean) {
        this.uiOpacity.opacity = active ? 255 : 0;
    }

    reset(): void {
        // this.active = false; // hides UI initially
        // this.scoreNode.active = false;
        // this.statusNode.active = false;
    }

    onNewGame(){
        this.reset();
    }

    onWaiting(){
        this.reset();
    }

    private setScore(score: number) {
        // always show “0” as “00” (assuming your digit‐padded CustomDigitLabel)
        var goldent = score >= 27;
        this.uiScore.setDisplay(`${score}`,goldent);
    }
      
    
    setStatus(status: string, score: number) {
        if ((!status || status === '') && score === 0) {
          this.node.active = false;
          return;
        }

        /*
      
        this.node.active = true;           // enable the whole panel…
        this.statusNode.active = false;
        this.scoreNode.active = false;
        if (['Bust','Samgong','Set','Pure Small','Pure Big','Pure Samgong'].includes(status)) 
        { // to display status
          getSamgongStatus(this.statusSprite, status);          
          this.statusNode.active = true;
          this.scoreNode.active = false;
        } 
        else 
        {// to display score
        
          this.statusNode.active = false;
          this.scoreNode.active = true;
          this.setScore(score);
        }
          */
      }
}


