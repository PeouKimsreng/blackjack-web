import { _decorator, AudioClip, Component, director, isValid, Node, SpriteFrame } from 'cc';
import { SmartFoxManager } from '../../smartfox/SmartFoxManager';
import { SFSObject, SFSRoom } from '../../smartfox/sfs2x-api';
import { BlackJackPlayerSeat } from '../players/BlackJackPlayerSeat';
import { BlackJackPlayers } from '../players/BlackJackPlayers';
import { CommandNames, SFSObjectKeys } from '../../GlobalBlackJack';
import { Audio } from '../../lobby/Audio';
import { AudiosManager } from '../../blackjack/manager/AudiosManager';
import { BlackJackMenuPanel } from '../menu/BlackJackMenuPanel';
import { PlayerProfileResponse } from '../data/PlayerProfileResponse';
import { BlackJackUIBettingPanel } from '../game_ui/BlackJackUIBettingPanel';
import { UITotalBetInfo } from '../game_ui/UITotalBetInfo';
import { BlackJackAlertStartGameMessage } from '../game_ui/BlackJackAlertStartGameMessage';
import { BlackJackPlayerBettingPots } from '../game_ui/BlackJackPlayerBettingPots';
import { BlackJackUIPlayerButtonsPanel, UIPlayerButtonType } from '../game_ui/BlackJackUIPlayerButtonsPanel';
import { BlackJackUIPotInfo } from '../game_ui/BlackJackUIPotInfo';
import { BlackJackUIDealerPotInfo } from '../game_ui/BlackJackUIDealerPotInfo';
import { BettingChipManager } from './BettingChipManager';
import { ToastMessage } from '../message/ToastMessage';
import { BlackJackUIRoomInfoPanel } from '../game_ui/BlackJackUIRoomInfoPanel';
import { BlackJackUITimmer } from '../game_ui/BlackJackUITimmer';
import { BlackJackUIPotResult } from '../game_ui/BlackJackUIPotResult';
import { BlackJackUIResults } from '../game_ui/BlackJackUIResutls';
import { BlackJackUIDealerResutls } from '../game_ui/BlackJackUIDealerResutls';
const { ccclass, property,executionOrder } = _decorator;

@ccclass('BlackJackManager')
@executionOrder(-100)
export class BlackJackManager extends Component {

    static ins: BlackJackManager = null;

    @property(BlackJackPlayers)
    players: BlackJackPlayers = null;
    @property(UITotalBetInfo)
    totalBetInfo: UITotalBetInfo = null;
    @property(BettingChipManager)
    bettingChipManager:BettingChipManager;

    currentPotIndex: number = -1;
    isRebetting : boolean = false;
    

    @property(BlackJackPlayerBettingPots)
    bettingPots: BlackJackPlayerBettingPots = null;

    playersData : BlackJackGame.Player.PlayerResponse[] = [];
    bettingData :BlackJackGame.Player.PlayerBetResponse[] = [];
    rankingData : BlackJackGame.Player.PlayerRankingCardsResponse[] = undefined;

    dealsData : BlackJackGame.Player.PlayerCardsResponse[] = undefined;
    compareCardsData : BlackJackGame.Player.PlayerCardsResponse[] = undefined;
    deductionData : BlackJackGame.Player.PlayerCardsResponse[] = undefined;
    me : PlayerProfileResponse = undefined;

    screenCapture : any = undefined;

    bettingChips : number[] = [];
    
    private skipChipsAnimation :boolean = false;

    static get instance() {
            if (!isValid(this.ins)) {
                this.ins = director.getScene().getChildByName('Canvas').getComponent(BlackJackManager);
            }
        
            return this.ins;
    }

    get hasMe(): boolean {
        return this.me !== undefined;
    }

    get lastJoinedRoom(){
        return SmartFoxManager.ins.smartFox.lastJoinedRoom;
    }

    playButtonClickSound(){
        Audio.ins.playButtonClickSound()
    }
    
    playMusic(clip: AudioClip){
        AudiosManager.ins.playMusic(clip);
    }
    
    playSound(clip: AudioClip){
        //AudiosManager.ins.playSound(clip);
        Audio.ins.playSound(clip);
    
    }
    
    isPlayingSoundClip(clip: AudioClip): boolean {
        return AudiosManager.ins.isPlaying(clip);
    }
    public get isMuteMusic() {
        // get mute from lobby
        return Audio.ins.isMuteMusic;
    }
    public set isMuteMusic(value) {
        Audio.ins.isMuteMusic = value;
        AudiosManager.ins.isMuteMusic = value;
    }
    
    public get isMuteSound() {
        // get mute from lobby
        return Audio.ins.isMuteSound;
    }
    
    public set isMuteSound(value) {
            Audio.ins.isMuteSound = value;
            AudiosManager.ins.isMuteSound = value;
    }

    showToast(message: string){

    }

    protected onLoad(): void {

        var room = SmartFoxManager.ins.lastJoinedRoom;
       // console.log("+++++++++ Room Joined : " + room.id + " " + room.name);

    
        
        BlackJackManager.ins = this;
        this.bettingChipManager.setManagerRef(this);

        if(room != null){
            BlackJackMenuPanel.instance.onPlayerEnterRoom(room);
        }
        
        BlackJackUIPlayerButtonsPanel.instance.hide();
        SmartFoxManager.ins.extensionResponseCallback = async (cmd: string, params: SFSObject, room: SFSRoom) =>{
                  // console.log("BlackJackManager extensionResponseCallback cmd: " + cmd);
                  // console.log( "cmd: " + cmd + " params: " + params.getDump());
                    switch (cmd){

                        case "CMD_ROOM_INFO":

                            const roomName = params.getUtfString("name");
                            const minAmount = params.getDouble("min_amount");
                            const maxAmount = params.getDouble("max_amount");

                            //console.log([roomName,minAmount,maxAmount]);
                            BlackJackUIRoomInfoPanel.instance.setRoomInfomations(roomName,minAmount,maxAmount);

                            break;

                        case "CMD_PERIOD_CHANGED": 
                            const period = params.getUtfString("value");

                            BlackJackUIRoomInfoPanel.instance.setPariodValue(period);
                            break;
                        case "CMD_INVALID_MIN_BET_AMOUNT": 
                            BlackJackUIBettingPanel.instance.onInvalidMinBetAmount();

                            break;
                        case "CMD_NOT_ENOUGH_MONEY_TO_TAKE_A_SEAT":
                            ToastMessage.instance.show("NOT ENOUGH MONEY TO TAKE A SEAT",1);
                        break;

                        case "CMD_RESET":
                            this.bettingData = [];
                            this.totalBetInfo.reset();
                            this.totalBetInfo.hide();
                            this.isRebetting = false;
                            this.skipChipsAnimation = false;
                            BlackJackUIBettingPanel.instance.hide();
                            BlackJackUIDealerPotInfo.instance.resetPotsInfo();
                            BlackJackUIPotInfo.instance.resetPotsInfo();
                            BlackJackPlayerBettingPots.instance.setActivePlaceBetText(false);                            
                            BlackJackUIResults.instance.hideAllPotsResult();

                            BlackJackUIDealerResutls.instance.hideAllPotResult();
                            
                            this.players.getDealerSeat.hand.onClear();
                            this.players.mySeat.handCardPots.clearCards();
                            this.players.getDealerSeat.hand.setEnableSelected = false;
                            this.players.mySeat.handCardPots.deselectedHandCards();
                            ToastMessage.instance.reset();

                            this.bettingChipManager.resetAllBets();

                            BlackJackUITimmer.instance.hide();
                            // return chips to player
                            //this.bettingChipManager.returnChips(0,this.getPlayerSeat(1).BetOrginNode)
                            break;
                        case "CMD_PLAYER_ADDED":
                            const id = params.getInt("id");
                            const name = params.getUtfString("name");
                            const avatar = params.getInt("avatar");
                            const balance = params.getDouble("balance");
                            const isPlayerOfMonth = params.getBool("is_player_of_month");
                            const isMe = params.getBool("is_me");

                            var playerProfile: PlayerProfileResponse = {
                                id: id,
                                name: name,
                                avatar: avatar,
                                balance: balance,
                                isPlayerOfMonth: isPlayerOfMonth,
                                isMe: isMe
                            };

                            BlackJackManager.ins.players.mySeat.updatePlayer(playerProfile);
                            BlackJackManager.ins.addPlayer(playerProfile);

                            break;
                        case "CMD_PLAYER_REMOVED":
                            BlackJackManager.ins.players.mySeat.resetSeat();
                            break;
                        case "CMD_BALANCE_CHANGED":
                            const newBalance =params.getDouble("balance");
                            if(BlackJackManager.ins.hasMe){
                                BlackJackManager.ins.players.mySeat.updateBalance(newBalance);
                            }
                            break;
                        case "CMD_POT_REJOIN":

                            // Clear current UI/state to avoid duplicating chips/cards on rejoin
                            BlackJackUIPlayerButtonsPanel.instance.hide();
                            BlackJackUITimmer.instance.hide();
                            BlackJackUIPotInfo.instance.resetPotsInfo();
                            BlackJackUIDealerPotInfo.instance.resetPotsInfo();
                            BlackJackPlayerBettingPots.instance.hideHighlight();
                            this.players.getDealerSeat.hand.onClear();
                            this.players.mySeat.handCardPots.clearCards();
                            this.bettingChipManager.resetAllBets();

                            const rejoinPotsData = params.getSFSArray("pots");
                            for(let i =0; i< rejoinPotsData.size(); i++){
                                const potObj = rejoinPotsData.getSFSObject(i);
                                var betPotIndex = potObj.getInt("index");
                                if(betPotIndex != -1){

                                    // set Betting chips on pot
                                    var bettChips = potObj.getDoubleArray("chips");
                                    if(bettChips == null) continue;

                                    bettChips.forEach( betAmount => {
                                        if(betAmount && betAmount > 0){
                                            this.setChipsOnPot(betPotIndex,betAmount,this.getPlayerSeat(1));
                                        }
                                    });
                                }
                                 // set pot info
                                if(potObj.containsKey("value")){
                                    const value = potObj.getUtfString("value");
                                    BlackJackUIPotInfo.instance.setPotInfo(betPotIndex,value);
                                }
                                
                                // set hand cards
                                if(potObj.containsKey("card")){
                                    var cards = potObj.getUtfStringArray("card");
                                    if(betPotIndex == -1) {
                                        
                                        cards.forEach( (dealerCard, cardIndex) => {
                                            this.players.getDealerSeat.hand.currentIndex = cardIndex;
                                            this.players.getDealerSeat.hand.setCard(cardIndex,dealerCard);
                                        });
                                    }
                                    else{
                                        var handCardPot = this.players.mySeat.handCardPots.getHandCards(betPotIndex);
                                        cards.forEach( (card, cardIndex) => {
                                            handCardPot.currentIndex = cardIndex;
                                            handCardPot.setCard(cardIndex, card);
                                        });
                                    }
                                }

                                //waiting confirm split
                                if(potObj.containsKey("waiting_confirm_split")){    
                                    const isWaitConfirmSplit = potObj.getBool("waiting_confirm_split");
                                    if(isWaitConfirmSplit){
                                        BlackJackUIPlayerButtonsPanel.instance.show(UIPlayerButtonType.SPLIT_CONFIRMATION);
                                    }
                                }

                                if(potObj.containsKey("total_time")){    
                                    const total_time = potObj.getInt("total_time");
                                    if(total_time > 0){
                                        BlackJackUITimmer.instance.show(total_time);
                                    }
                                }

                                // show pot result on reconnect if result already resolved
                                if (potObj.containsKey("result_type")) {
                                    if (betPotIndex == -1) {
                                        const dealerPotResult = potObj.getInt("result_type");
                                        BlackJackUIDealerResutls.instance.result.setPotResult(dealerPotResult);
                                    } else {
                                        BlackJackUIPotInfo.instance.showPotResult(betPotIndex, potObj);
                                    }
                                }
                            }
                            break;
                        case "CMD_STAND":
                            break;
                        case "CMD_START_GAME":
                            BlackJackAlertStartGameMessage.instance.show();
                            BlackJackUIPotInfo.instance.resetPotsInfo();
                            BlackJackUIDealerPotInfo.instance.resetPotsInfo();
                            this.bettingData = [];

                            this.players.onNewGame();
                            break;

                        case "CMD_START_BET":
                            this.bettingData = [];
                            BlackJackAlertStartGameMessage.instance.hide();
                            BlackJackUIBettingPanel.instance.show();
                            BlackJackPlayerBettingPots.instance.setActivePlaceBetText(true);
                            this.totalBetInfo.reset();
                            this.totalBetInfo.show();

                            break;
                        case "CMD_BET_CHIP_CHANGED":
                            const chips = params.getSFSArray("chips");
                            const chipList: { chip: number; active: boolean }[] = [];

                            for (let i = 0; i < chips.size(); i++) {
                                const obj = chips.getSFSObject(i);
                                const chip = obj.getDouble("chip");   // or getLong if server used long
                                const active = obj.getBool("active");
                                chipList.push({ chip, active });
                            }

                            BlackJackUIBettingPanel.instance.setChips(chipList.map(c => c.chip));
                            this.bettingChips = chipList.filter(c => c.active).map(c => c.chip);
                            // select min active chip as default
                            BlackJackUIBettingPanel.instance.setSelectMinActiveChipAsDefault();
                            break;
                        case "CMD_BET":
                           
                           var betPotIndex = params.getInt("index");
                           var bettChips = params.getDoubleArray("chips");

                           var chipsCount = bettChips.length;
                           var betAmount = bettChips[chipsCount -1]; //params.getDouble("bet");
                           if(betAmount && betAmount > 0){
                                this.animateChipsBettingFromPlayerToCenterTable(betPotIndex,this.getPlayerSeat(1),betAmount);
                           }
                            break;
                        case "CMD_CLEAR_BET":
                            for(var i =0; i<=5; i++){
                                this.bettingChipManager.returnChips(i,this.getPlayerSeat(1).BetOrginNode)
                            }
                            this.isRebetting = false;
                            break;
                        case "CMD_DOUBLE": 
                            const doubleBetPotIndex = params.getInt("index");
                            const doubleBettChips = params.getDoubleArray("chips");

                            const bettingChips = this.bettingChipManager.getChipsInPot(doubleBetPotIndex);

                            const allBetChipsCount = bettingChips.length;

                            doubleBettChips.forEach( (betAmount,index) => {
                                if(index > allBetChipsCount){
                                    if(betAmount && betAmount > 0){
                                        this.animateChipsBettingFromPlayerToCenterTable(doubleBetPotIndex,this.getPlayerSeat(1),betAmount);
                                    }
                                }
                            });
                        break;

                        case "CMD_CONFIRM_BET":

                            BlackJackUIBettingPanel.instance.hide();

                            BlackJackPlayerBettingPots.instance.setActivePlaceBetText(false);
                            break;
                        case "CMD_LAST_BET":
                            if(this.isRebetting){
                                break;
                            }
                            this.isRebetting = true;

                            this.totalBetInfo.responseBetInfo(params);
                            var pots = params.getSFSArray("pots");
                            for(let i =0; i< pots.size(); i++){
                                const potObj = pots.getSFSObject(i);
                                var betPotIndex = potObj.getInt("index");
                                if(potObj.containsKey("chips")){
                                    var bettChips = potObj.getDoubleArray("chips");
                                    BlackJackPlayerBettingPots.instance.selectPot(betPotIndex);
                                    for (const betAmount of bettChips) {
                                        if(betAmount && betAmount > 0){
                                            this.animateChipsBettingFromPlayerToCenterTable(betPotIndex,this.getPlayerSeat(1),betAmount);
                                        }
                                    }
                                }
                            }
                            break;

                        case "CMD_BET_INFO":
                            this.totalBetInfo.responseBetInfo(params);

                            break;
                        case "CMD_SEAT":
                            console.log("CMD_SEAT received" + params.getDump());
                            const seatId = params.getInt(SFSObjectKeys.SEAT_ID);
                            const success = params.getBool("success");
                            break;

                        case "CMD_CARD_ADDED":

                            const cardIndex = params.getInt("index");
                            const card = params.getUtfString("card");
                            if(cardIndex != -1){
                                var handCardPot = this.players.mySeat.handCardPots.getHandCards(cardIndex);
                                var currentIndex = handCardPot.currentIndex;
                                handCardPot.deal2(0,currentIndex,card);
                                handCardPot.currentIndex++;
                            }         
                            else{
                                this.players.getDealerSeat.hand.deal2(0,this.players.getDealerSeat.hand.currentIndex,card);
                                this.players.getDealerSeat.hand.currentIndex++;
                            }
                            if(BlackJackUIBettingPanel.instance.isShown){
                                BlackJackUIBettingPanel.instance.hide();
                            }

                            if(!BlackJackUIPlayerButtonsPanel.instance.isShown){
                                BlackJackUIPlayerButtonsPanel.instance.show(UIPlayerButtonType.HIT_AND_STAND);
                            }
                           
                            break;
                        case "CMD_OPEN_DEALER_SECOND_CARD": 
                            const nextDealerCard = params.getUtfString("card");
                            const dealerPotValue = params.getUtfString("value");
                            this.players.getDealerSeat.hand.setEnableSelected = true;
                            this.players.getDealerSeat.hand.openDealerSecondsCard(nextDealerCard);
                            BlackJackUIDealerPotInfo.instance.setPotInfo(dealerPotValue);
                            BlackJackPlayerBettingPots.instance.hideHighlight();
                            break;

                        case "CMD_CHECK_TIME":

                            var active = params.getBool("active");
                            const indexPot = params.getInt("index");
                            var canDouble = params.getBool("can_double");
                            var total_time = params.getInt("total_time");

                            this.currentPotIndex = indexPot;
                            BlackJackPlayerBettingPots.instance.selectPot(indexPot);

                            if(active){
                                BlackJackUITimmer.instance.show(total_time);
                            }
                            else{
                                BlackJackUITimmer.instance.hide();
                            }
                            if(active)
                                this.players.mySeat.handCardPots.selectHandCards(indexPot);
                            else{
                                this.players.mySeat.handCardPots.deSelectHandCards(indexPot);
                            }
                        
                            if(active){
                                BlackJackUIPlayerButtonsPanel.instance.show(UIPlayerButtonType.HIT_AND_STAND,canDouble);
                            }
                            else{
                                BlackJackUIPlayerButtonsPanel.instance.hide();
                            }

                            break;
                        case "CMD_POT_SPLIT":

                            var newPot = params.getSFSObject("new_pot");
                            var oldNewPot = params.getSFSObject("old_pot");

                            if(oldNewPot == null) break;

                            const old_split_index = oldNewPot.getInt("index");

                            if(old_split_index != -1){

                                var card1 = oldNewPot.getUtfString("card1");
                                var card2 = oldNewPot.getUtfString("card2");

                                 if(old_split_index != -1){
                                    var handCardPot = this.players.mySeat.handCardPots.getHandCards(old_split_index);
                                    handCardPot.currentIndex = 0;
                                    handCardPot.getCardNodeAt(0).setStringCard(card1);
                                    handCardPot.currentIndex ++;
                                    handCardPot.hideCardBackAt(1);
                                    handCardPot.deal2(1,handCardPot.currentIndex,card2);
                                    handCardPot.currentIndex++;
                                    
                                    if(oldNewPot.containsKey("value")){
                                        const value = oldNewPot.getUtfString("value");
                                        BlackJackUIPotInfo.instance.setPotInfo(old_split_index,value);
                                    }
                                }

                            }

                            if(newPot == null) break;

                            const split_index = newPot.getInt("index");

                            var betPotIndex = newPot.getInt("index");
                            var bettChips = newPot.getDoubleArray("chips");

                            var chipsCount = bettChips.length;
                            var betAmount = bettChips[chipsCount -1]; //params.getDouble("bet");
                            if(betAmount && betAmount > 0){
                                this.animateChipsBettingFromPlayerToCenterTable(betPotIndex,this.getPlayerSeat(1),betAmount);
                            }

                            if(split_index != -1){
                                var newPotCard1 = newPot.getUtfString("card1");
                                var newPotCard2 = newPot.getUtfString("card2");

                                if(split_index != -1){
                                    var handCardNewPot = this.players.mySeat.handCardPots.getHandCards(split_index);
                                    handCardNewPot.currentIndex = 0;
                                    handCardNewPot.setCard(0, newPotCard1);
                                    handCardNewPot.currentIndex++;
                                    handCardNewPot.deal2(2,1,newPotCard2);
                                    handCardNewPot.currentIndex++;

                                    if(newPot.containsKey("value")){
                                        const value = newPot.getUtfString("value");
                                        BlackJackUIPotInfo.instance.setPotInfo(split_index,value);
                                    }
                                }
                            }

                            break;

                        case "CMD_POT_INFO" :
                            const selectPotIndex = params.getInt("index");
                            const value = params.getUtfString("value");
                            this.currentPotIndex = selectPotIndex;
                            BlackJackUIPotInfo.instance.setPotInfo(selectPotIndex,value);
                        break;
                        case "CMD_POT_HIT":
                             const hit_pot_card = params.getUtfString("card");
                             const potIndex = params.getInt("index");
                             const potValue = params.getUtfString("value");

                            if(potIndex  == -1){
                                this.players.getDealerSeat.hand.deal2(0,this.players.getDealerSeat.hand.currentIndex,hit_pot_card);
                                this.players.getDealerSeat.hand.currentIndex++;
                                BlackJackUIDealerPotInfo.instance.setPotInfo(potValue);

                                if(params.containsKey("result_type")){
                                    const dealerPotResult = params.getInt("result_type");
                                    BlackJackUIDealerResutls.instance.result.setPotResult(dealerPotResult);
                                }
                            }
                            else{
                                var handCardPot = this.players.mySeat.handCardPots.getHandCards(potIndex);
                                var currentIndex = handCardPot.currentIndex;
                                handCardPot.deal2(0,currentIndex,hit_pot_card);
                                handCardPot.currentIndex++;
                                BlackJackUIPotInfo.instance.setPotInfo(potIndex,potValue);
                            }         
                            
                            break;
                        case "CMD_POT_STAND":
                            // handle pot stand if needed
                            break;

                        case "CMD_POT_SPLIT_CONFIRM":
                            const PotSplitIndex = params.getInt("index");

                            BlackJackUIPlayerButtonsPanel.instance.show(UIPlayerButtonType.SPLIT_CONFIRMATION);

                            break;
                        case "CMD_ALL_POTS_RESULT_WIN": 
                            BlackJackUITimmer.instance.hide();
                            BlackJackUIPlayerButtonsPanel.instance.hide();
                            console.log(params.getDump());

                            BlackJackUIResults.instance.showWinAllPotsResults();
                            break;
                        case "CMD_POT_RESULT":
                            BlackJackUITimmer.instance.hide();

                            const potIndexResult = params.getInt("index");
                            this.currentPotIndex = potIndexResult;
                            BlackJackUIPotInfo.instance.showPotResult(potIndexResult,params);

                            
                            break;


                        default:
                           
                        break;
                    }
                };
            
    }

    update(deltaTime: number) {
        
    }

    onRequestSeat(seatId: number) {
        // Handle seat request logic here

        const params = new globalThis.SFS2X.SFSObject();
        params.putInt(SFSObjectKeys.SEAT_ID, seatId);
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_SEAT, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));

        console.log("Requesting seat:", seatId);
    }

    sendBet(bettingSlot: number, betAmount: number){
        // Send bet to server

        if(bettingSlot < 0){
            console.log("No pot selected to place bet");
            return;
        }

        const params = new globalThis.SFS2X.SFSObject();
        params.putInt('index', bettingSlot);
        params.putDouble('bet', betAmount);
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_BET, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }


    sendSplit(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putInt("index", 0);
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_SPLIT, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendClearBet(){
        const params = new globalThis.SFS2X.SFSObject();
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_CLEAR_BET, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendConfirmBet(){
        const params = new globalThis.SFS2X.SFSObject();

        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_CONFIRM_BET, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendReBet(){
        const params = new globalThis.SFS2X.SFSObject();
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_LAST_BET, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }    

    sendOK(){
        const params = new globalThis.SFS2X.SFSObject();
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_PLAYER_CONFIRM_HAND, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendPotHit(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putInt("index", this.currentPotIndex); // for future use if multiple hands are allowed
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_HIT, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendPotStand(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putInt("index", 0); // for future use if multiple hands are allowed
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_STAND, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendPotSplit(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putBool("yes", true); 
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_SPLIT, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendPotSplitCancel(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putBool("yes", false); 
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_SPLIT, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    sendPotDouble(){
        const params = new globalThis.SFS2X.SFSObject();
        params.putInt("index", this.currentPotIndex); // for future use if multiple hands are allowed
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_POT_DOUBLE, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));

        console.log("send CMD_DOUBLE called " + this.currentPotIndex);
    }


    onRequestStand(){

        const params = new globalThis.SFS2X.SFSObject();        
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_STAND, params, SmartFoxManager.ins.smartFox.lastJoinedRoom));
    }

    onPlayerExitRoom(){
       
        SmartFoxManager.ins.smartFox.send(new globalThis.SFS2X.ExtensionRequest(CommandNames.CMD_REQUEST_LEAVE_ROOM, undefined, SmartFoxManager.ins.smartFox.lastJoinedRoom));  
    }

    getPlayerSeat(seatId: number): BlackJackPlayerSeat{
        return this.players.seats.find(player => player.getServerSeatID === seatId) || null;
    }

    getDeductionData(seatId: number){
        const player = this.getPlayerSeat(seatId);
        return player ? player.getDeductionAmount() : null;
    }


    hasBet(seatId:number) : boolean{
        var bettingData = this.getPlayerBetData(seatId);

        if(bettingData === undefined) return false;


        if(bettingData.player.bet_amount > 0){
            return true;
        }
        else{
            return false;
        }
    }

    public GetPlayerSeat( serverSeatID : number){

        var seat  = this.players.seats.find( seat => 
            seat.getServerSeatID === serverSeatID);
        return seat;
    }

    getPlayerBetData(seatId:number) : BlackJackGame.Player.PlayerBetResponse{
        var index = this.bettingData.findIndex( p => p.player.seat_id == seatId);

        if(index != -1) return this.bettingData[index];
        return undefined;
    }

    addPlayer(player : PlayerProfileResponse){
        
        if(player.isMe){
            this.me = player;
        }

        /*
        if(this.playersData === undefined || this.playersData == null){
            this.playersData = [];
            this.playersData.push(player);
        }
        else{
            var temp = this.playersData.findIndex( p => p.player.seat_id == player.player.seat_id)

            if(temp == -1 ){
                this.playersData.push(player);
            }
            else{
                this.playersData[temp]= player;
            }
        }
        */
    }

    private updatePlayersProfilesByState(state: string): void {
        if (!this.playersData) return;

        for (const dataPlayer of this.playersData) {
            const seat = this.GetPlayerSeat(dataPlayer.player.seat_id);
            
            if (!seat) continue;

            //seat.updatePlayer(dataPlayer.player);

        }

    }

    
    animateChipsBettingFromPlayerToCenterTable(betPotIndex : number,playerBetting :BlackJackPlayerSeat,bet_amount: number) {
        if(this.skipChipsAnimation){return;}
     
        var targetWorldPosition = BlackJackPlayerBettingPots.instance.getCurrentPotWorldPosition;
                            
        var chipNode = this.bettingChipManager.animateChipToCenter(bet_amount,playerBetting.BetOrginNode,targetWorldPosition,true);
        if(chipNode){
            this.bettingChipManager.addMoreBet(betPotIndex,chipNode);
        }
        
    }

    setChipsOnPot(betPotIndex : number, bet_amount: number, playerBetting : BlackJackPlayerSeat, skipAnimation : boolean = true){
        const prevSkip = this.skipChipsAnimation;
        this.skipChipsAnimation = skipAnimation;

        var targetWorldPosition = BlackJackPlayerBettingPots.instance.getPotWorldPosition(betPotIndex);
                            
        var chipNode = this.bettingChipManager.animateChipToCenter(bet_amount,playerBetting.BetOrginNode,targetWorldPosition,true);
        if(chipNode){
            this.bettingChipManager.addMoreBet(betPotIndex,chipNode);
        }
        this.bettingChipManager.forceChipsToCenter();
        this.skipChipsAnimation = prevSkip;
    }

    /*
    animationBettingChipsDeduction(playerToDeductBalance : PlayerSeat, deductionData : SamgongGame.Player.PlayerDeductionResponse ) {
        if(this.skipChipsAnimation){return;}

         // not deler no bet chips , so return
        if(playerToDeductBalance.seat_id == 0) return;

        const isWinner = deductionData.player.status === 'WIN';
        if(isWinner){
            const dealer = this.dealer.node.getComponent(PlayerSeat);
            // dealer win, move chips betting to dealer
            this.bettingChipManager.payBackChips(deductionData.player.win_amount,dealer.BetOrginNode,playerToDeductBalance.BetOrginNode,true);

            // player win , return chips to player
            this.bettingChipManager.returnChips(deductionData.player.seat_id,playerToDeductBalance.BetOrginNode,true);
        }
        else{
            // dealer win, move chips betting to dealer
            var delaerBetOrigin = this.dealer.node.getComponent(PlayerSeat).BetOrginNode;
            if(delaerBetOrigin){
                this.bettingChipManager.returnChips(deductionData.player.seat_id,delaerBetOrigin,true);
            }
        }
    }
    */
}

