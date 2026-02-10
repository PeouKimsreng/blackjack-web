import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackPlayerScorePosition')
export class BlackJackPlayerScorePosition extends Component {

    private  bottomStatusScoreY_PositionForMe : number = 67.695;

    private  bottomStatusScoreY_PositionForOther: number =-91.842;

    @property(Node)
    statusNode :Node
    
    updatePosition(isResizeCard : boolean){
       // this.node.position = isMe ? this.bottomStatusScorePositionForMe : this.bottomStatusScorePositionForOther;
        
        const offsetY = isResizeCard? this.bottomStatusScoreY_PositionForMe : this.bottomStatusScoreY_PositionForOther;
        const pos= this.node.position;
        this.node.position = new Vec3(pos.x,offsetY);
        this.updateSizeStatusNode(isResizeCard);
    }  

    updateSizeStatusNode(isResizeCard : boolean){
        this.statusNode.scale = isResizeCard ? Vec3.ONE : new Vec3(0.556,0.556);
    }
}


