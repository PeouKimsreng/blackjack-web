declare namespace BlackJackGame {

    export class WaitingResponse {
        state: string;
        time: number;
        max_time: number;
    }
 
    export class Card {

        suit: string;
        rank: string;
    }

    export class NewGameResponse {
        player_count:number;
        round_count:number;
        game_play_code:string;
        state:string;
    }

    export namespace Player {

        export class UpdatePlayerBalanceCommand {
            balance: number;
            server_seat: number;
            state: string;
        }

        //{"state":"PLAYER_TURN","player":[{"seat":0,"is_playing":true,"hand":{"cards":[],"num_of_card":3}},{"seat":1,"is_playing":true,"hand":{"cards":[],"num_of_card":2}}]}
        export class PlayersResponse {
            state: string;
            players: Player[];
            //players: PlayerSeat[];
        }

        export class PlayerResponse {
            state: string;
            player: Player;
        }

        export class PlayerBet { 
            balance:number;
            seat_id:number;
            bet_amount:number;
        }
    
        export class PlayerBetResponse {
            state: string;
            player: PlayerBet;
        }

        export class PlayerDeductionResponse{
            state: string;
            player: Player;
        }

        export class PlayerCardsResponse {
            state: string;
            player: Player;
        }

        export class DealCardsResponse {
            state: string;
            players: Player[];
        }

        export class PlayerRankingCardsResponse {
            state: string;
            player: PlayerRanking;
        }

        export class PlayerRankingNextCardResponse {
            state: string;
            player: RankingNextCardResponse;
        }
        
        export class RankingNextCardResponse {
              score : number;
              card_size: number;
              result_status: string
              seat_id: number;
              card: Card;
        }

        export class PlayerRanking {
            score: number  ;
            seat_id: number;
            cards: Card[];
            card_size:number;
            result_status:string;
        }

        export class PlayerHand{
            score: number;
            cards: Card[];
            card_size: number;
            result_status: string;
            seat_id: number;
        }

        export class PlayerConfirmedHandCardsResponse {
            state: string;
            player: PlayerHand;
            score:number;
        }

        //{"state":"PLAYER_TURN","player":{"seat":0,"is_playing":true,"hand":{"cards":[],"num_of_card":3}}}        
        export class PlayerJoinResponse {
            state: string;
            player: Player;
        }

        export interface PlayerSeat {
            server_seat: number;
            client_seat: number;
            player: Player;
        }



        export class Player {
        
            score: number;
            avatar_id: number;
            balance: number;
            is_dealer: boolean;
            seat_id: number;
            name: string;
            bet_amount: number;
            id: string;
            username: string;
            cards: Card[];
            card_size: number;
            is_playing: boolean;
            is_me: boolean;
            result_status:string; //"Samgong" "Card" , "Set" ,..etc
            // game results
            win_amount : number;
            status : string;  // "WIN" "LOSE"
            session_is_player_of_month: boolean;
        }

        export class CardGroups {
            group_card_count: number;
            group_cards: Card[];
            group_index: number;
        }

        export class PlayerStandUp {
            state: string;
            player: Player;

            server_seat: number;
            is_playing: boolean;
            message: string;
            is_stand: boolean;
            is_request_stand: boolean;

        }

        export class PlayerLeave {
            state: string;
            is_leave_pending: boolean;
            message: string;
        }

        export class Massage{
            state: string;
            server_seat: boolean;
            message: string;
        }
    }

}
