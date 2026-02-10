import { _decorator, Component, director, isValid, Node, PageView, Quat, sp, tween, Tween, v3, Vec3 } from 'cc';
import { BlackJackUIToogle } from './BlackJackUIToogle';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIGameRules')
export class BlackJackUIGameRules extends Component {
    private showTween: Tween<Node> = undefined;
    private _isActive : boolean = false;

    @property({type: BlackJackUIToogle})
    tabGameRule :BlackJackUIToogle = null;
    @property({type: BlackJackUIToogle})
    tabSpecialCard :BlackJackUIToogle = null;

    @property({type: PageView})
    pageView:  PageView = null;

    @property({type: Node})
    hidenButton : Node = null;

    static ins : BlackJackUIGameRules = null;
    
        static get instance() {
            if (!isValid(this.ins)) {
                this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIGameRules);
            }    
            return this.ins;
        }


    protected onLoad(): void {

        this.hide();
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
        tween(this.node)
            .to(tweenDuration, { position: new Vec3(2500, 0, 0) }, {
            easing: "backIn",})
        .call(() => {this.activeHidenButton(false);})
        .call(() => {this.active = false;})
        .start();
    }

    show(){
        let tweenDuration: number = 0.5; 
        tween(this.node)
            .to(tweenDuration, { position: new Vec3(823.762, 0, 0) }, {
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
}


