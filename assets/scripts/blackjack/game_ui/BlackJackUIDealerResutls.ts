import { _decorator, Component, director, isValid, Node, Sprite, SpriteFrame } from 'cc';
import { BlackJackUIPotResult } from './BlackJackUIPotResult';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIDealerResutls')
export class BlackJackUIDealerResutls extends Component {

    @property(BlackJackUIPotResult)
    result : BlackJackUIPotResult;

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
    


    private static ins : BlackJackUIDealerResutls = null;

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIDealerResutls);
        }    
        return this.ins;
    }

    hideAllPotResult(){
        this.result.setActive(false);
        this.allWinResult.setActive(false);
    }

    showWinAllPotResult(){
        this.allWinResult.setActive(true);
        this.allWinResult.potsResult.spriteFrame = this.allWinSprite;
    }
    
}

