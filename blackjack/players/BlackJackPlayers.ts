import { _decorator, Component, Layers, Layout, Node, toDegree, Vec3 } from 'cc';
import { BlackJackPlayerSeat } from './BlackJackPlayerSeat';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackCard } from '../card/BlackJackCard';
import { BlackJackOptionsMenu } from '../menu/BlackJackOptionsMenu';
//import { OptionsMenu } from '../../samgong/menu/OptionsMenu';
const { ccclass, property } = _decorator;

export enum GamePlayFlags {
    IsGameStart,
    IsBetting,
    IsDrawMoreCard,
    IsResult,
}

class SeatRotation {
    static readonly TOTAL_SEATS: number = 6;
    static readonly DEALER_SEAT_ID: number = 0;

    private static readonly UI_POSITIONS: Record<number, string> = {
        0: "Dealer (Top)",
        1: "Bottom (Player)",
        2: "Right",
        3: "Top-Right",
        4: "Top-Left",
        5: "Left"
    };

    public static getDisplaySeatId(playerSeatId: number, targetSeatId: number): number {
        if (targetSeatId === this.DEALER_SEAT_ID) {
            return 0;
        }
        if (targetSeatId === playerSeatId) {
            return 1;
        }
        const offset = 2;
        return (targetSeatId - playerSeatId + this.TOTAL_SEATS) % (this.TOTAL_SEATS - 2) + offset;
    }

    public static getUIPosition(displaySeatId: number): string {
        return this.UI_POSITIONS[displaySeatId] || "Unknown";
    }
}

@ccclass('BlackJackPlayers')
export class BlackJackPlayers extends Component {

    
    flag : GamePlayFlags;

    @property([BlackJackPlayerSeat])
    seats : BlackJackPlayerSeat[] = [];
    skipedNumber: number;
    private wasChangedServerSeats: boolean = false;
    private previousSeatId: number = -1;

    _isNoDealer : boolean = false;

    // New property to track local player's seat ID
    private mySeatId: number = -1;    

    get mySeat (): BlackJackPlayerSeat {
        return this.seats.find(s => s.seat_id == 1);
    }

    get WasChangedServerSeats():boolean{

        return this.wasChangedServerSeats;
    }


    set WasChangedServerSeats(value : boolean){
        this.wasChangedServerSeats = value;
    }


    set isNoDealer(value : boolean){
          this._isNoDealer = value;

        //this.seats[3].onNoDealer = value;
        this.seats[0].isDealer = !value;
      
    }

    get isNoDealer(): boolean{
       return this._isNoDealer;
    }



    public get allDealCards() {
        const cards = new Array<BlackJackCard>();
        let clientSeat = 0;

        for (let p = 0; p < 6; p++) {
            const player = this.seats[clientSeat];
            cards.push(...player.hand.cards);
            clientSeat = (clientSeat + 6 - p) % 6;
        }

        return cards;
    }

    onLoad() {
        this.flag = GamePlayFlags.IsGameStart;
        this.WasChangedServerSeats = false;
    }

    reset(){
        this.WasChangedServerSeats = false;
        this.mySeatId = -1;
    }

    onMeTakeASit(){
       // OptionsMenu.instance.activeStandButton(true)
       // OptionsMenu.instance.isRequestStand = false;    
    }

    onMeStand(player : BlackJackPlayerSeat){

        const myPlayer  = player;
        if(myPlayer){
            if(myPlayer.profile.getAvatarLightFrame){
                myPlayer.profile.getAvatarLightFrame.reset();
               // myPlayer.profile.getAvatarLightFrame.node.active =false;
            }
        }
        
        this.wasChangedServerSeats = false;
        BlackJackOptionsMenu.instance.activeStandButton(false);
        BlackJackOptionsMenu.instance.isRequestStand = false;

       // this.mySeatId = -1;
    }

    update(deltaTime: number) {
        
    }


    startPlay(){
        this.flag = GamePlayFlags.IsBetting;
    }

    clearAllBets(){
        this.seats.forEach( seat => {
            seat.profile.hideBetAmount();
        });
    }

    startBetting(){
        this.flag = GamePlayFlags.IsBetting;

        this.seats.forEach( seat => {
            seat.hand.cards.forEach( card => {
                card.hideCard();
            });
        });
    }
    
    showBetAmounts(){
        /*
        if(SamgongManager.instance.responseBetsData.players !== undefined){
            var players = SamgongManager.instance.players;
            SamgongManager.instance.responseBetsData.players.forEach( betData =>{
                if(!betData.is_dealer){
                        const playerBet = players.seats.find( p => p.seat_id == betData.seat_id);
                        if(playerBet != undefined){
                            playerBet.onPlayerBet(betData.bet_amount);
                        }
                    }
                }
            );
        }
            */
    }
    onNewGame(){
        this.seats.forEach( seat => {
            seat.onNewGame();
        });
    }

    onWaiting(){
        this.seats.forEach( seat => {
            seat.onWaiting();
        })
    }

    endPlay(){
        this.flag = GamePlayFlags.IsResult;
        this.seats.forEach( seat => {
            seat.hand.onClear();
            seat.profile.onEndGame();
        });
    }

    play(){

    }

    get getDealerSeat (): BlackJackPlayerSeat{
        return this.seats.find(s => s.seat_id == 0);
    }

    get getMySeat (): BlackJackPlayerSeat{
        return this.seats.find(s => s.seat_id == 1);
    }

    get getPlayersSeat(): BlackJackPlayerSeat[]{

        return [this.seats[0],this.seats[1],this.seats[2], this.seats[3],this.seats[4],this.seats[5]]
    }

    get getOnlyPlayersSeat(): BlackJackPlayerSeat[]{

        return [this.seats[1],this.seats[2], this.seats[3],this.seats[4],this.seats[5]]
    }

    // call to find server seat after player take a seat
    refindSeatIndex(clientSeat: number, serverSeat: number) {

        if(this.seats == null){
            this.seats = this.getPlayersSeat;
        }

        let maxPlayersSeat = this.seats.length;
        
        for (let i = 0; i < maxPlayersSeat; i++) {

            let clientSeatIndex = (clientSeat + maxPlayersSeat + i) % maxPlayersSeat;
            let serverSeatIndex = (serverSeat + maxPlayersSeat + i) % maxPlayersSeat;
            this.seats[clientSeatIndex].setServerSeatID(serverSeatIndex);
            this.seats[clientSeatIndex].seat_id = clientSeatIndex;

        }
    }

    getSeatIDs(mySeatID){
        const seatMappingTable: number[][] = [
                                            // mySeatID = 0
                                            [0, 1, 2, 3, 4, 5],
                                            // mySeatID = 1
                                            [0, 1, 2, 3, 4, 5],
                                            // mySeatID = 2
                                            [0, 2, 3, 4, 5, 1],
                                            // mySeatID = 3
                                            [0, 3, 4, 5, 1, 2],
                                            // mySeatID = 4
                                            [0, 4, 5, 1, 2, 3],
                                            // mySeatID = 5
                                            [0, 5, 1, 2, 3, 4]
                                            ];
                                        return seatMappingTable[mySeatID];
    }

    updateServerSeatsID(seat_id: number) 
    {
        if (seat_id === 0) return;

        this.WasChangedServerSeats = this.previousSeatId !== seat_id;// this.previousSeatId !== -1 && this.previousSeatId !== seat_id;

        if(!this.wasChangedServerSeats)
        {  
            //console.warn("No change in server seats detected. Previous seat ID:", this.previousSeatId, "Current seat ID:", seat_id);
            // No change in server seats, exit early
             return;
        }

        this.previousSeatId = seat_id;
        const mappedServerIDs = this.getSeatIDs(seat_id);

        this.seats.forEach((seat, uiIndex) => {
            
            seat.seat_id = uiIndex;
          
            seat.resetSeat();
     
            const newServerID = mappedServerIDs[uiIndex];
            seat.setServerSeatID(newServerID);
        });
    }
    
    responseRankingCards( dataResponse : BlackJackGame.Player.PlayerRankingCardsResponse ){
        if(dataResponse === undefined || dataResponse.player === undefined){
            return;
        }

        var playerSeat = BlackJackManager.instance.getPlayerSeat(dataResponse.player.seat_id);
        if(playerSeat !== undefined ){
            if(dataResponse.player.cards.length > 0){
                playerSeat.hand.responseCards(dataResponse.player.cards);
            }
            else{
                playerSeat.hand.activeBackCardsBySize(dataResponse.player.card_size);
            }
        }
    }

    public get allCards() {
        return [
            this.seats[0].hand.cards,
            this.seats[1].hand.cards,
            this.seats[2].hand.cards,
            this.seats[3].hand.cards,
            this.seats[4].hand.cards,
            this.seats[5].hand.cards,
        ]
    }

    dealCards(skip : number,maxTime :number,dataResponse : BlackJackGame.Player.PlayersResponse ){
        
        if(dataResponse === undefined){
            
            return;
        }

        this.dealCardsToPlayers(skip,maxTime,dataResponse.players)
    }

    onEndDealCard(){
        this.seats.forEach(
            seat => {
                seat.hand.getComponent(Layout).enabled = true
                if(seat.IsPlaying){
                    seat.setPlayerCardsToHand(3);
                }
            }
        );
    }

    dealCardsToPlayers(skip : number,maxTime :number,playersArePlaying :BlackJackGame.Player.Player[] ){
        
        let playerIndex = 0;
        let playingCount = playersArePlaying.length;
        
        const delay = (maxTime / playingCount) / 3;
        for (let c = 0, d = 0; c < 3; c++) {
           // this.skipedNumber = skip;
            if (c > skip) {      
                
                for (let p = 0; p < playingCount; p++) {
                    
                    playerIndex = (( playerIndex  - 1 ) + playersArePlaying.length ) % playersArePlaying.length;
                    var player =  this.seats.find(p=> p.seat_id == playersArePlaying[playerIndex].seat_id);
                    d += delay;
                    if (player) {
                        player.hand.node.active = true;
                        player.dealPlayingCard(c,d);
                    }
                }
          }
            else {                
                for (let p = 0; p < playingCount; p++) {                    
                  //  this.allDealCards[c+(p*7)].stopDeal();

                }
            }

        }
    }
}


