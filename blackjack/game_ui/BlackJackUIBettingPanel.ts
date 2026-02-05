import { _decorator, Button, Component, director, isValid, Node, Tween, tween, Vec3 } from 'cc';
import { SFSArray, SFSObject, SFSRoom } from '../../smartfox/sfs2x-api';
import { SmartFoxManager } from '../../smartfox/SmartFoxManager';

import { BlackJackManager } from '../manager/BlackJackManager';
import { Chip } from '../chips/Chip';
import { ToastMessage } from '../message/ToastMessage';

const { ccclass, property } = _decorator;

@ccclass('BlackJackUIBettingPanel')
export class BlackJackUIBettingPanel extends Component {
            
    static ins : BlackJackUIBettingPanel = null;
    
    @property(Button)
    betButton : Button = null;

    @property([Node])
    chipNodes : Node[] = [];

    private currentBetChipID: number = -1;

    private BackPosition = new Vec3(150, -1000, 0);//new Vec3(0.837, -1000, 0);
    private ShowPosition = new Vec3(150, -493.362, 0);
    private showTween: Tween<Node|undefined> = undefined;
    
    
    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIBettingPanel);
        }    
        return this.ins;
    }
    
    onLoad() {
        this.currentBetChipID = -1;
    }

    reset(){
        this.currentBetChipID = -1;
        this.node.active = false;
        this.node.position = this.BackPosition;      
    }

    hide(){
        let tweenDuration: number = 0.5;        
        this.clearTween();
        this.showTween = tween(this.node)
            .to(tweenDuration, { position: this.BackPosition}, {  // 
            easing: "backIn",})
            .call(() => {this.node.active = false; })
            .start();
    }

    get isShown(): boolean {
        return this.node.active;
    }

    clearTween() {
        if (this.showTween !== undefined) {
            this.showTween.stop();
            this.showTween = undefined;
        }   
    }


    show(){
        //this.currentBetChipID = -1; // allow betting again from fresh state
        this.node.active = true;
        let tweenDuration: number = 0.5; 
        this.clearTween();
        this.showTween =tween(this.node)
            .to(tweenDuration, { position : this.ShowPosition}, {  // 
            easing: "backInOut",
        })
        .start();

    }

    onInvalidMinBetAmount(){
        ToastMessage.instance.show("Invalid Minimum Bet Amount", 2);

        this.show();
    }

    setChips( chipsets: (string | number)[]){
        for (let i = 0, length = this.chipNodes.length; i < length; i++) {
            var chipNode = this.chipNodes[i];
            if(chipsets.some(b => b.toString() === chipNode.name)){

                chipNode.active = true;
                const chip = chipNode.getComponent(Chip);
                if(chip){
                    const chipID = Number.parseInt(chipNode.name);
                    chip.setID = chipID;
                    // Assuming the amount is the same as the ID for this example
                    chip.setAmount = chipsets.find(c => Number.parseInt(c.toString()) === chipID) as number;
                }

                if(!this.isReadySetDefaultChip()){
                    chip.isSelected = true;
                    this.currentBetChipID = chip.getAmount;
                }
            }
        }

    }

    isReadySetDefaultChip(): boolean{
        return this.currentBetChipID !== -1;
    }

    setSelectMinActiveChipAsDefault(){
        if(this.currentBetChipID !== -1){
            return;
        }
        if(this.chipNodes.length > 0){
            const chipNode = this.chipNodes[0];
            const chip = chipNode.getComponent(Chip);
            if (chip) {
                this.selectedChipAmount(chip.getAmount);
            }
        }

    }

    selectedChipAmount(amount: number){
        this.currentBetChipID = amount;
        const chip = this.chipNodes.find(c => c.name === amount.toString());
        if (chip) {
            chip.getComponent(Chip).isSelected = true;
        }

        // Deselect other chips
        this.chipNodes.forEach(c => {
            if (c.name !== amount.toString()) {
                c.getComponent(Chip).isSelected = false;
            }
        });
    }

    get getSelectedChipAmount(): number
    {
        if (this.currentBetChipID === -1) {
            return 0; // No chip selected
        }
        
        return this.currentBetChipID;
    }

    OnReBetClicked(){
        BlackJackManager.instance.sendReBet();
    }
   

    OnBetClicked(event: Event, customEventData: string) {
        const eventTarget = event.target  as unknown  as Node;

        const chip = eventTarget.getComponent(Chip);
        if (!chip) return;

        const amount = chip.getAmount;
        // Update current bet chip ID
        this.selectedChipAmount(amount);
    }

    onBetSuccess(){
        this.hide();
    }


    OnConfirmBetClicked(){
         BlackJackManager.instance.sendConfirmBet();
    }

    OnClearBetClicked(){
         BlackJackManager.instance.sendClearBet();
    }

}


