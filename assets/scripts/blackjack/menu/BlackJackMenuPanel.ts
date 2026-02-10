import { _decorator, Button, Component, director, isValid, Node } from 'cc';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackOptionsMenu } from './BlackJackOptionsMenu';
//import { BlackJackOptionsMenu } from './BlackJackOptionsMenu';
const { ccclass, property } = _decorator;

@ccclass('BlackJackMenuPanel')
export class BlackJackMenuPanel extends Component {

    @property({type: Button})
    exitButton : Button = null; 

    static ins: BlackJackMenuPanel = null;

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackMenuPanel);
        }

        return this.ins;
    }

    onLoad() {
      //  this.node.active = false;

      console.log(this);
    }

    onPlayerEnterRoom(room : any){
        this.node.active = true;
        this.exitButton.node.on('click', this.onShowOptionMenuButtonClicked, this);        
    }

    onPlayerExitRoom(){
        this.exitButton.node.off('click', this.onShowOptionMenuButtonClicked, this);
        this.node.active = false;
     
    }

    start() {
        
    }

    protected onDisable(): void {
        this.exitButton.node.off('click', this.onShowOptionMenuButtonClicked, this);
    }

    onShowOptionMenuButtonClicked(){
        BlackJackManager.instance.playButtonClickSound();
        
        BlackJackOptionsMenu.instance.show();
    }

    onExitButtonClicked(){

        BlackJackManager.instance.onPlayerExitRoom();
    }
}


