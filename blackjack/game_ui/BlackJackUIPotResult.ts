import { _decorator, Component, director, isValid, Node, sp, Sprite, spriteAssembler, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { BlackJackUIPotInfo } from './BlackJackUIPotInfo';
import { BlackJackCustomDigitLabel } from '../menu/BlackJackCustomDigitLabel';
import { BlackJackUIResults } from './BlackJackUIResutls';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIPotResult')
export class BlackJackUIPotResult extends Component {
    
   
    tween = null;

    @property(Sprite)
    potsResult : Sprite;

    amountTextLabel : BlackJackCustomDigitLabel ;
    protected onLoad(): void {
    
    }

    reset(){
        
        if(this.tween){
            this.tween.stop();
            this.tween= null;
        }
        this.setActive(false);
    }

    setActive(active: boolean){
        this.node.active = active;
    }

    playShowResultAnimation(){
        if(this.tween){
            this.tween.stop();
            this.tween= null;
        }

        this.tween = tween(this.node);
        this.tween.to(0.5, {scale: new Vec3(1.2,1.2,1.2)}, {easing: 'backOut'})
            .to(0.2, {scale: new Vec3(1,1,1)}, {easing: 'backOut'})
            .start();   
    }

    playHideAnimation(){

        if(this.tween){
            this.tween.stop();
            this.tween= null;
        }

        this.tween = tween(this.node);
        this.tween.to(0.3, {scale: new Vec3(0,0,0)}, {easing: 'backIn'})
            .call( () => {
                this.setActive(false);
            })
            .start();
    }
 
    setPotResult(resultType: number){
        this.setActive(true);        
        switch (resultType) {
            case 0: //win
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.winSprite;
                }   
                break;
            case 1: //lose
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.loseSprite;
                }
                break;
            case 2: //busted
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.bustSprite;
                }
                break;
            case 3: //pushed
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.pushSprite;
                }
                break;
            case 4: //blackjack
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.blackJackSprite;
                }
                break;
            case 5: //all win
                if(this.potsResult){
                    this.potsResult.spriteFrame = BlackJackUIResults.instance.allWinSprite;
                }
                break;
        }

        this.playShowResultAnimation();
    }

}


