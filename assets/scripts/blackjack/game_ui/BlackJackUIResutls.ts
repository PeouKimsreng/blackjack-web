import { _decorator, Component, director, isValid, Node, Sprite, SpriteFrame } from 'cc';
import { BlackJackUIPotResult } from './BlackJackUIPotResult';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIResults')
export class BlackJackUIResults extends Component {

    @property([BlackJackUIPotResult])
    results : BlackJackUIPotResult[] = [];

    @property(BlackJackUIPotResult)
    allWinResult : BlackJackUIPotResult = null;
    
    @property(SpriteFrame)
    allWinSprite :SpriteFrame = null;
    
    @property(SpriteFrame)
    winSprite :SpriteFrame = null;
    
    @property(SpriteFrame)
    loseSprite :SpriteFrame = null;
    
    @property(SpriteFrame)
    pushSprite :SpriteFrame = null;
    
    @property(SpriteFrame)
    bustSprite :SpriteFrame = null;

    
    @property(SpriteFrame)
    blackJackSprite :SpriteFrame = null;
    


    private static ins : BlackJackUIResults = null;

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIResults);
        }    
        return this.ins;
    }

    hideAllPotsResult(){
        this.results.forEach( potResult => {
            potResult.setActive(false);
        });

        this.allWinResult.setActive(false);
    }

    showWinAllPotsResults(){
        this.allWinResult.setActive(true);
        this.allWinResult.potsResult.spriteFrame = this.allWinSprite;
        this.allWinResult.playShowResultAnimation();
    }
    
}

