import { _decorator, Component, director, isValid, Label, Layout, Node, UITransform } from 'cc';
import { SFSRoom } from '../../smartfox/sfs2x-api';
import { numberToCash, numberToCashM } from '../../GlobalBlackJack';
import { BlackJackManager } from '../manager/BlackJackManager';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIRoomInfoPanel')
export class BlackJackUIRoomInfoPanel extends Component {
    @property(Label)
    roomNameLabel: Label = null;

    @property(Label)
    minMaxBalanceLabel: Label = null;

    @property(Label)
    dealerBalanceLabel: Label = null;

    @property(Label)
    periodLabel: Label = null;

    @property(Label)
    infoMin_MaxLabel: Label = null;
    @property(Label)
    infoDealerLabel: Label = null;
    @property(Label)
    infoPeriodLabel: Label = null;
    
    @property(Layout)
    layout : Layout = null;

    setInfoMin_MaxLabel(text: string) {
        this.infoMin_MaxLabel.string = text;
    }

    setInfoDealer(text: string) {
        this.infoDealerLabel.string = text;
    }

    setInfoPeriod(text: string) {
        this.infoPeriodLabel.string = text;
    }
    
    private static _ins: BlackJackUIRoomInfoPanel = null;
    public static get instance() {
        if (!isValid(this._ins)) {
            this._ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUIRoomInfoPanel);
        }
 
        return this._ins;
    }

    protected onLoad(): void {
        
    }

    setRoomInfo(room: SFSRoom) {
        if(room){
            this.roomNameLabel.string = `${room.name}`;//`${room.name.substring(0, 6)}...`;
            if (room.containsVariable("min_amount") && room.containsVariable("max_amount")) {
                this.minMaxBalanceLabel.string = `${numberToCashM(room.getVariable("min_amount").value)} - ${numberToCashM(room.getVariable("max_amount").value)}`;
            }
           // this.dealerBalanceLabel.string = `${numberToCashM(room.getVariable('bet').value)}`
           // this.setPariod(room);
        }
    }

    setRoomInfomations( roomName: string, minAmount ,maxAmount){
        this.roomNameLabel.string = `${roomName}`;//`${roomName.substring(0, 6)}...`;
        this.minMaxBalanceLabel.string = `${numberToCashM(minAmount)} - ${numberToCashM(maxAmount)}`;

        this.layout.updateLayout();

        if (this.node.getComponent(UITransform).contentSize.width > 900 && roomName.length > 7) {
            this.roomNameLabel.string = `${roomName.substring(0, 6)}...`;
            this.layout.updateLayout();
        }   
    }

    setPariod(room: SFSRoom) {
        if(room){
            this.periodLabel.string = `${room.getVariable('round').value}`;
        }
    }

    setPariodValue(periodValue : string) 
    {
        if(periodValue){
            this.periodLabel.string = `${periodValue}`;
        }
    }
}


