import { _decorator, Button, Component, director, EventHandler, isValid, Label, Node, Vec3 } from 'cc';
import { BlackJackUIBettingPanel } from './BlackJackUIBettingPanel';
import { BlackJackManager } from '../manager/BlackJackManager';
const { ccclass, property } = _decorator;

@ccclass('BlackJackPlayerBettingPots')
export class BlackJackPlayerBettingPots extends Component {
    
    static ins : BlackJackPlayerBettingPots = null;

    selectedPotIndex: number = -1;
    potValues: number[] = [0, 1, 2]; // Example pot values

    @property
    highlightedPot: Node = null;

    @property(Label)
    placeYouBetText: Label = null;


    @property(Button)
    tableBetButtonR : Button = null;
    @property(Button)
    tableBetButtonF : Button = null;
    @property(Button)
    tableBetButtonL : Button = null;

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackPlayerBettingPots);
        }
        return this.ins;
    }

    get getCurrentPotWorldPosition():Vec3{

        const pots = [this.tableBetButtonL,this.tableBetButtonF,this.tableBetButtonR];
        if(this.selectedPotIndex == null || this.selectedPotIndex < 0 || this.selectedPotIndex >= pots.length){
            return new Vec3(0,0,0);
        }

        return pots[this.selectedPotIndex].node.worldPosition;
    }

    getPotWorldPosition ( portIndex : number):Vec3{

        const pots = [this.tableBetButtonL,this.tableBetButtonF,this.tableBetButtonR];
        if(portIndex == null || portIndex < 0 || portIndex >= pots.length){
            return new Vec3(0,0,0);
        }

        return pots[portIndex].node.worldPosition;
    }

    setActivePlaceBetText(active : boolean){
        this.placeYouBetText.node.active = active;

        this.tableBetButtonR.interactable = active;
        this.tableBetButtonF.interactable = active;
        this.tableBetButtonL.interactable = active;

        if(!active){
            this.hideHighlight();
        }
    }

    onLoad() {
        this.hideHighlight();
    }

    sendBet(amount: number) {
            
        var index = this.getSelectedPotValue();

        if(index < 0){
            console.log("No pot selected to place bet");
            return;
        }
        // Send to server
        BlackJackManager.instance.sendBet(index, amount);
    
    }

    highLightSelectedPot() {
        if (this.selectedPotIndex >= 0 && this.selectedPotIndex < this.node.children.length) {

            var targetPot = this.selectedPotIndex;
            var highPotIndex = this.selectedPotIndex;

            switch(targetPot ){
                case 3: 
                    highPotIndex = 0;
                    break;
                case 4: 
                    highPotIndex = 1;
                    break;
                case 5: 
                    highPotIndex = 2;
                    break;
            }
            this.highlightedPot.setPosition(this.node.children[highPotIndex].getPosition());
            this.highlightedPot.active = true;
        } else {
            this.hideHighlight();
        }
    }

    hideHighlight() {
        this.highlightedPot.active = false;
    }


    selectPot(index : number){
        this.selectedPotIndex = index;
        this.highLightSelectedPot();
    }

    onSelectedPot0() {
        this.selectedPotIndex = 0;
        this.sendBet(BlackJackUIBettingPanel.instance.getSelectedChipAmount);
        this.highLightSelectedPot();
    }

    onSelectedPot1() {
        this.selectedPotIndex = 1;
        this.sendBet(BlackJackUIBettingPanel.instance.getSelectedChipAmount);
        this.highLightSelectedPot();
    }
     
    onSelectedPot2() {
        this.selectedPotIndex = 2;
        this.sendBet(BlackJackUIBettingPanel.instance.getSelectedChipAmount);
        this.highLightSelectedPot();
    }


   getSelectedPotValue(): number {
        if (this.selectedPotIndex >= 0 && this.selectedPotIndex < this.potValues.length) {
            return this.potValues[this.selectedPotIndex];
        }
        return 0; // Default value if no pot is selected
    }

    OnPotSelectedEvent(): EventHandler[] {
        const eventHandlers: EventHandler[] = [];
        const eventHandler = new EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "BlackJackPlayerBettingPots";
        eventHandler.handler = "onSelectedPot" + this.selectedPotIndex;
        eventHandlers.push(eventHandler);
        return eventHandlers;
    }

}


