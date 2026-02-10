import { _decorator, Component, Node, Sprite } from 'cc';
import { BlackJackUIPotResult } from './BlackJackUIPotResult';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUIGameResults')
export class BlackJackUIGameResults extends Component {


    @property([BlackJackUIPotResult])
    potResults : BlackJackUIPotResult[] = [];

    start() {

    }

    update(deltaTime: number) {
        
    }
}


