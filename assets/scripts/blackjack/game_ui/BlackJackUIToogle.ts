import { _decorator, Component, Node, Sprite, SpriteFrame, ToggleComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIToogle')
export class BlackJackUIToogle extends Component {

    @property(SpriteFrame)
    uncheckedSpriteFrame:  SpriteFrame = null;
    @property(SpriteFrame)
    checkedSpriteFrame:  SpriteFrame = null;

    @property(Sprite)
    checkmarkSprite:  Sprite = null;
    @property(Sprite)
    uncheckmarkSprite:  Sprite = null;


    @property(ToggleComponent)
    toggle: ToggleComponent  =null

    onLoad(){
       this.toggle.isChecked = false;
    }

    onEnable(): void {
        this.toggle.node.on('toggle', this.callback, this);
    }

    setCheckToggle(check: boolean){
        this.toggle.isChecked = check;
    }

    callback(toggle: ToggleComponent){
        
        if(toggle.isChecked){
            this.checkmarkSprite.node.active = true;
            this.uncheckmarkSprite.node.active = false;
        }
        else{
            this.checkmarkSprite.node.active = false;
            this.uncheckmarkSprite.node.active = true;
        }
    }

    onDisable() {
        this.toggle.node.off('toggle', this.callback, this);
    }
}


