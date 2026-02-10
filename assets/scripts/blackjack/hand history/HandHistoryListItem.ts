import { _decorator, Button, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HandHistoryListItem')
export class HandHistoryListItem extends Component {
    @property(Sprite)
    private sprite: Sprite = null;

    @property(Node)
    private frameSelected: Node  = null;

    public get spriteFrame() {
        return this.sprite.spriteFrame;
    }
    public set spriteFrame(value : SpriteFrame) {
        this.sprite.spriteFrame = value;

        var button = this.getComponent(Button)
        if(button){
            button.interactable = value != undefined;
        }
    }

    public get isSelected() {
        return this.frameSelected.activeInHierarchy;
    }
    public set isSelected(value) {
        this.frameSelected.active = value ;
    }
}


