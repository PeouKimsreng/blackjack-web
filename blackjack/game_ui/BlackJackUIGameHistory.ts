import { _decorator, Button, Component, director, EventTouch, ImageAsset, isValid, Node, PageView, Quat, ScrollView, sp, Sprite, SpriteFrame, Texture2D, tween, Tween, v3, Vec3 } from 'cc';
import { BlackJackManager } from '../manager/BlackJackManager';
import { HandHistoryListItem } from '../hand history/HandHistoryListItem';

const { ccclass, property } = _decorator;
enum GameHistorState {
    HIDE = 0,
    SHOW = 1,
};

@ccclass('BlackJackUIGameHistory')
export class BlackJackUIGameHistory extends Component {
    private _isActive : boolean = false;

    @property(Sprite)
    private previewSprite: Sprite = null;

    @property(HandHistoryListItem)
    private items: Array<HandHistoryListItem> = [];

    @property(ScrollView)
    private scrollView: ScrollView = null;


    @property({type: Node})
    hidenButton : Node = null;

     static ins : BlackJackUIGameHistory = null;
    
    private tweenMove: Tween<Node> | null;
    
    static get instance() {
        if (!isValid(this.ins)) {
                this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIGameHistory);
        }    
        return this.ins;
    }


    protected onLoad(): void {

        this.hide();
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

    onEnable() {
        if (this.items[0].node.active) {
            this.scrollView.scrollToTop();
            this.onItemClicked(this.items[0]);
        }
    }

    activeHidenButton(active : boolean){
        this.hidenButton.active = active;
    }

    set active(active: boolean){
      
        this._isActive = active;
    }

    get isActive(){

        return this._isActive;
    }

    hide(){
       let tweenDuration: number = 0.5;
       this.activeHidenButton(false);
       this.resetTween();

       this.tweenMove = tween(this.node)
            .to(tweenDuration, { position: new Vec3(2500, 0, 0) }, {  // 
            easing: "backIn",})
        .call(() => {this.activeHidenButton(false);})
        .call(() => {this.active = false;})
        .start();
    }

    show(){
        let tweenDuration: number = 0.5; 

        this.resetTween();

        this.tweenMove= tween(this.node)
            .to(tweenDuration, { position: new Vec3(673.396, 0, 0) }, {  // 
            easing: "linear",
        })
        .call(() => {
            this.activeHidenButton(true);
    
        })   
        .delay(1)
        .call(() => {
            if(this.active){
                this.hide();
            }
        })
        .start();
    }

    onHidenButtonClicked(){
        this.hide();
    }    

    onItemClicked(obj:EventTouch | HandHistoryListItem) {
        const oldSelectedItem = this.items.find(item => item.isSelected);
        const newSelectedItem = (obj instanceof HandHistoryListItem) ? obj : obj.target.getComponent(HandHistoryListItem);

        if (isValid(oldSelectedItem) && oldSelectedItem !== newSelectedItem) {
            oldSelectedItem.isSelected = false;
        }

        newSelectedItem.isSelected = true;
        this.previewSprite.spriteFrame = newSelectedItem.spriteFrame;

        if(newSelectedItem.spriteFrame){
            this.previewSprite.node.parent.active = true;
        }
        else{
            this.previewSprite.node.parent.active = false;
        }
    }

    captureGameResults() {

       var spriteFrame = BlackJackManager.instance.screenCapture.screenShot();
        if(spriteFrame != null)
        {
            for (let i = 4, j = 3; i > 0; i--, j--) {
                if (this.items[j].node.active) {
                    this.items[i].node.active = true;
                    this.items[i].spriteFrame = this.items[j].spriteFrame;
                }
            }
            
            
            this.items[0].node.active = true;
            this.items[0].spriteFrame = spriteFrame;
            this.items[0].getComponent(Button).interactable = true

            const selectedIndex = this.items.findIndex(item => item.isSelected);
            
            if (selectedIndex != -1) {
                this.onItemClicked(this.items[selectedIndex == 4 ? 4 : (selectedIndex + 1)]);
            }
            else{
                this.onItemClicked(this.items[0]);
            }
            
        }
    }
}


