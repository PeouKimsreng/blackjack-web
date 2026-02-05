import { _decorator, Component, Node, sp, Vec3 } from 'cc';
import { BlackJackAvatarLightFrame } from './BlackJackAvatarLigthFrame';
import { BlackJackDeck } from '../card/BlackJackDeck';
import { BlackJackUIDealerPotInfo } from '../game_ui/BlackJackUIDealerPotInfo';
import { numberToCash } from '../../GlobalBlackJack';

const { ccclass, property } = _decorator;

@ccclass('BlackJackDealer')
export class BlackJackDealer extends Component {
    @property(sp.Skeleton)
    dealerSpine : sp.Skeleton;
    @property(Node)
    shoeBox : Node;

    @property(BlackJackAvatarLightFrame)
    frame : BlackJackAvatarLightFrame;

    @property(BlackJackUIDealerPotInfo)
    potInfo : BlackJackUIDealerPotInfo = null;

    onLoad() {
      /*  
        this.node.on('no-dealer', this.onNoDealer, this);
        this.node.on('has-dealer', this.onHasDealer, this);
        this.node.on('me-dealer', this.onMeIsDealer, this);
      */ 
        this.node.on('deal-card', this.startDeal, this);
    }

    setPotInfo( value: string){
        this.potInfo.setPotInfo(value);
    }

    set activeDealerSpine(active :boolean){
        this.dealerSpine.node.active = active;
    }

    activeShoeBox(active :boolean){
        this.shoeBox.active = active;
        BlackJackDeck.instance.SetPosition = active ? new Vec3(232, 265,0) : new Vec3(0,296.046 ,0);
        
        if(!active){
            this.frame.reset();
            this.frame.node.active = false;
        }

        if(active){
            this.dealerSpine.node.active = false;
        }
    }

    startDeal(){
        let ani = this.dealerSpine.setAnimation(0, 'Hand', false);
    }

    stopDeal(){
        this.dealerSpine.clearAnimation();
    }

    onMeIsDealer(){
        this.activeDealerSpine = false;
        this.activeShoeBox(!this.dealerSpine.node.activeInHierarchy);        
    }

    onNoDealer(){
        this.activeDealerSpine = false;        
    }

    onHasDealer(meIsDealer = false){
        this.activeDealerSpine = meIsDealer ? false : true;
        this.activeShoeBox(false);
        
        if(!meIsDealer){
            this.frame.reset();
            this.frame.node.active = false;
        }
    }
}


