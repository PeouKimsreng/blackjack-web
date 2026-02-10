import { _decorator, director, isValid, Node, sp} from 'cc';
import { UIBase } from './UIBase';
const { ccclass, property } = _decorator;

@ccclass('UIWaitingProgress')
export class BlackJackUIWaitingProgress extends UIBase {    

    @property(sp.Skeleton)
    waitingSpine : sp.Skeleton;

    private static ins : BlackJackUIWaitingProgress = null;
    
    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIWaitingProgress);
        }    
        return this.ins;
    }

    override show(): void {
        super.show();

        if(this.waitingSpine){
            this.waitingSpine.setAnimation(0, "waiting", true);
        }
    }


    protected onLoad(): void {

        this.hide();
    }
}
