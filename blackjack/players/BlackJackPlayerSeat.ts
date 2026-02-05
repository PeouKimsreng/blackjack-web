import { __private, _decorator, Button, Component, isValid, Label, UIOpacity, Vec3} from 'cc';
import { BlackJackPlayerProfile } from './BlackJackPlayerProfile';
import { BlackJackManager } from '../manager/BlackJackManager';
import { BlackJackHandCards } from './BlackJackHandCards';
import { BlackJackDealer } from './BlackJackDealer';
import { BlackJackCard } from '../card/BlackJackCard';
import { PlayerProfileResponse } from '../data/PlayerProfileResponse';
import { HandCardPots } from './HandCardPots';


const { ccclass, property } = _decorator;

@ccclass('BlackJackPlayerSeat')
export class BlackJackPlayerSeat extends Component {
    
    @property({type: Button})
    seatButton : Button = null;

    @property({type: BlackJackPlayerProfile})
    profile : BlackJackPlayerProfile = null;
    @property({type: Number})
    seat_id : number = 0;

    @property({type: BlackJackHandCards})
    hand : BlackJackHandCards = null;

    @property({type: HandCardPots})
    handCardPots : HandCardPots = null; 
    
    private is_self : boolean = false;    
    is_playing : boolean = false;
    isdealer : boolean = false;
    
    private serverSeatId : number = -1;

    private  _isOpenCardsCompared :boolean = false;

    get isOpenCardsCompared( ){
        return this._isOpenCardsCompared;
    }

    setServerSeatID(serverSeat: number) {
        this.serverSeatId = serverSeat;
    }

    get getServerSeatID(): number {

        if(this.serverSeatId == -1){
            this.serverSeatId = this.seat_id;
        }

        return this.serverSeatId;
    }

    get isDealer()  {
        return this.isdealer;
    }

    getDealer():BlackJackDealer{
        return this.getComponent(BlackJackDealer);
    }

    set isDealer(value : boolean){

        this.isdealer = value;

        var dealer : BlackJackDealer = this.getDealer();

        if(value){
            //this.node.emit('dealer');
            if(this.is_self){
                //this.node.emit('me-dealer');
                this.profile.avatar.node.active = true;
                if(dealer != undefined){
                    dealer.onMeIsDealer();
                }
                
            }
            else{
                this.profile.avatar.node.active = false;
               // this.node.emit('has-dealer');
                if(dealer != undefined){
                    dealer.onHasDealer(false);
                }
            }
        }
        else{
           this.profile.avatar.node.active = true;
           // this.node.emit('no-dealer');
            if(dealer != undefined){
                dealer.onNoDealer();
            }
        }
    }

    get BetOrginNode()
    {
        return this.profile.betOrigin;
    }

    set IsPlaying(value : boolean){

        this.is_playing = value;
        this.profile.setIsPlaying(value);        

        if(value){
            this.hand.show();
        }
        else{
            this.hand.hide();
        }
    }

    get IsPlaying():boolean{
        return this.is_playing;
    }

    set IsSelf(is_self : boolean){
        this.is_self = is_self;
        this.profile.isSelf = is_self;
        //if(is_self && !this.isdealer){
        if(is_self && this.seat_id != 0){
            this.hand.setResizeCard(is_self);
        }
        else{
            this.hand.setResizeCard(false);
        }
        

        if(this.profile.getAvatarLightFrame !== undefined){
        
            if(!is_self && this.isdealer){
                this.profile.getAvatarLightFrame.stopEffect();
            }
            else if (is_self) {
                this.profile.getAvatarLightFrame.startEffect();
            }
        }        
    }

    get IsSelf(): boolean{
        return this.is_self;
    }

    get allCards() :BlackJackCard[]
    {
        return this.hand.cards;
    }

    reset(){

    }

    resetSeat(){
        this.seatButton.node.active = true;
        this.profile.node.active = false
        this.profile.reset();
        this.profile.setReady(false);
        this.profile.setIsPlaying(false);
        this.is_self = false;
        this.IsSelf = false;
        this.hand.onClear();
        this.hand.hide();
    }

    removePlayer(){
        this.seatButton.node.active = true;
        this.profile.node.active = false
        this.profile.reset();
        this.profile.setReady(false);
        this.profile.setIsPlaying(false);
        this.IsSelf = false;
        this.hand.onClear();
        this.hand.hide();
        this.hand.setResizeCard(false);
    }

    setPlayerCardsToHand(showNumber:number){
        this.hand.setNumberCardsInHand = showNumber;        
        this.hand.cards.forEach( (card,indexCard) => {
           if(indexCard < showNumber){
            this.hand.setCardToSlot(card, indexCard);
            card.setToRankingPosition();
            card.showCard();
            card.updateContentSize(this.hand.isResizeCard);
          }
        });
        this.profile.alignScorePanelToCardsCenter();
    }

    stopDeal(skip : number){
      //  this.hand.stopDeal(skip);
    }

    deductionResponse(deductionData : BlackJackGame.Player.PlayerDeductionResponse ){
        this.profile.setBalance(deductionData.player.balance);
    }

    updatePlayer(player : PlayerProfileResponse){
        this.profile.node.active = true;
        this.setProfileInfo(`${player.name}` , player.balance);
        this.profile.setProfile(player.avatar);
        this.IsSelf = player.isMe;
        this.seatButton.node.active = false;
        this.profile.setIsPlaying(true);
        this.profile.frameOfMonth.updateFrameUI(player.isMe,false,player.isPlayerOfMonth);

        // if(!player.is_playing){
        //     this.onPlayerIsWaiting();
        // }
    }

    setProfileInfo(name : string , balance : number){
        this.profile.setProfileName(name);
        this.profile.setBalance(balance);
        this.seatButton.node.active = false;
        this.profile.node.active = true;
    }

    updateBalance(newBalance : number){
        this.profile.setBalance(newBalance);
    }

    onLoad() {

        console.log(BlackJackManager.instance);
        this.serverSeatId = this.seat_id;
        this.seatButton.node.on('click', this.onSeatButtonClicked, this);
    }


    protected onDisable(): void {
        this.seatButton.node.off('click', this.onSeatButtonClicked, this);
    }

    protected onDestroy(): void {
    }

    onConfirmedCard(cardSize: number,  cardDatas : BlackJackGame.Card[]){
        this.profile.setReady(true);
        this.hand.onConfirmedCard(cardSize,cardDatas);
    }

    onSeatButtonClicked(){

        if(this.getComponent(BlackJackDealer) != null){
            BlackJackManager.instance.onRequestSeat(this.seat_id);
        }
        else {
            BlackJackManager.instance.onRequestSeat(this.getServerSeatID);
        }
        
    }
    
    updateCards(cards : BlackJackGame.Card[]){
        this.hand.responseCards(cards);
    }


    onPlayerBet(amount : number,playSound :boolean= false){
        this.profile.setBetAmount(amount);
        // comment this line because sound was play in chips moving already
        /*if(playSound){
         
           this.profile.playAudioBettingChips();
        }
        */
    }

    dealPlayingCard(indexCard: number,delay : number) {
        if (indexCard >= 0 && indexCard < this.allCards.length) {

            var enablecardsLayout = indexCard >= 3;
            var cardToMove = this.allCards[indexCard];    
            cardToMove.active= true;
           // cardToMove.dealCard(0.5,delay ,Vec3.ONE,(enableLayout: boolean = enablecardsLayout) => {
           // });
        } 
    }

    onPlayerIsWaiting(){
        this.profile.onWaiting();
        this.hand.onWaiting();
        this.profile.setReady(false);
        this._isOpenCardsCompared = false;
    }

    onWaiting(){
        this.profile.onWaiting();
        this.hand.onWaiting();
        this.profile.setReady(false);
        this._isOpenCardsCompared = false;
    }

    onNewGame(){

        if(this.hand){
            this.hand.onNewGame();
        }

        if(this.handCardPots){
            this.handCardPots.onNewGame();
        }
        
        this.profile.onNewGame();
        this._isOpenCardsCompared = false;
    }

    onDealCards(dealCardData : BlackJackGame.Player.PlayerCardsResponse){
        this.hand.activeCardsBySize(dealCardData.player.card_size,true);
    }

    showBettingAmount(dataPlayer: BlackJackGame.Player.PlayerBetResponse) {

        if (!dataPlayer || !dataPlayer.player) {        
            return;
        }

        const betData = BlackJackManager.instance.getPlayerBetData(dataPlayer.player.seat_id);
        if (betData) this.onPlayerBet(betData.player.bet_amount);
    }

    onRankingCards(playerRanking :BlackJackGame.Player.PlayerRankingCardsResponse ){

       // var cardSize = // this.hand.currentCardsInHand;
        this.hand.activeCardsBySize(playerRanking.player.card_size);
        if(this.IsSelf ){
            this.profile.setStatusScore(playerRanking.player.score,playerRanking.player.result_status);
            this.profile.setVisibleStatusScore(true);
        }
        else{
            this.profile.setVisibleStatusScore(false);
        }
    }

    onSkipComparedCards(dataCompare: BlackJackGame.Player.PlayerCardsResponse){
        const isSelft = this.IsSelf;
        const data = dataCompare;
        this.hand.stopAnimateCompareCard();
        this.setPlayerCardsToHand(data.player.card_size);
        this.hand.responseCards(data.player.cards);
        this.profile.setStatusScore(data.player.score, data.player.result_status,isSelft);
        this.profile.setVisibleStatusScore(true);
    }

    onCompareCards(data: BlackJackGame.Player.PlayerCardsResponse){

        if(this.isOpenCardsCompared){
           // console.log("animated compared cards ");
            return;
        }

        this._isOpenCardsCompared = true;
        this.hand.activeCardsBySize(data.player.card_size);
        this.profile.hideReady();
        //this.hand.currentCardsInHand = data.player.card_size;
        this.profile.setResult(data.player.win_amount);
        this.profile.setStatusScore(data.player.score,data.player.result_status);
        this.hand.onCompareCards(data.player.cards,()=>{
            // show player hand results (play animation move up result status)
            this.profile.setVisibleStatusScore(true);
        
            this.hand.updateContenSize(false);
           // this.startAnimationGameResults();
        }); 
    }

    onGameResults(){
        this.startAnimationGameResults();
    }

    onComparedCards(data: BlackJackGame.Player.PlayerCardsResponse) {
        this.hand.activeCardsBySize(data.player.card_size);

        // ✅ Always apply resize logic based on current IsSelf status
        this.hand.setResizeCard(this.hand.isResizeCard);

        this.hand.onSkipAnimationCompare(data.player.cards, () => {
            this.profile.setStatusScore(data.player.score, data.player.result_status);
            this.profile.setVisibleStatusScore(true);
        });

        this.onEndCompareCards();
    }

    showResultsSkipAnimations(){
        var data = BlackJackManager.instance.getDeductionData(this.getServerSeatID);
        this.profile.skipAnimationResult(data.player.win_amount);
        this.profile.setStatusScore(data.player.score,data.player.result_status);
    }
        

    onEndCompareCards(){
        this.hand.onEndCompareCard();
        this.profile.onEndCompareCard();
    }

    startAnimationGameResults(){
        this.profile.startResultsAnimation();
        this.profile.setVisibleStatusScore(true);
    }

    getBetAmount(){
        return BlackJackManager.instance.getPlayerBetData(this.getServerSeatID);
    }


    getDeductionAmount(): BlackJackGame.Player.PlayerCardsResponse {
        return BlackJackManager.instance.getDeductionData(this.getServerSeatID);
    }

    onMeTakeASit(){
     //       OptionsMenu.instance.activeStandButton(true)
    //        OptionsMenu.instance.isRequestStand = false;    
    }
}


