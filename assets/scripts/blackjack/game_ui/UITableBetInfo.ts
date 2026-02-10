import { _decorator, Component, Label, Node } from 'cc';
import { SFSArray, SFSObject, SFSRoom } from '../../smartfox/sfs2x-api';
import { numberToCash, numberToCurrency } from '../../GlobalBlackJack';
const { ccclass, property } = _decorator;

@ccclass('UITableBetInfo')
export class UITableBetInfo extends Component {

    @property(Label)
    betInfoLabel :Label =null;

    responseBetInfo(room:SFSRoom){
         var chips : SFSArray = room.getVariable('chipsets').value as SFSArray;

         if(chips.size()> 0){
            const o : SFSObject = chips.get(0);
            const minBet = o.get('chipset');
            if(minBet){
                this.betInfoLabel.string = `Bet: ${numberToCash(minBet)}`;
            }
            else{
                this.betInfoLabel.string = `Bet:`;
            }

         }

    }
}


