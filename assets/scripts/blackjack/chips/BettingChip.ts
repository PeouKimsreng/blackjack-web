import { _decorator, Component, tween, Tween, Vec3 , Node} from "cc";

const { ccclass, property } = _decorator;

@ccclass('BettingChip')
export class BettingChip extends Component {
     private activeTween: Tween<Node> = null;

    public moveTo(targetPos: Vec3, delay: number = 0, onComplete?: () => void) {
        this.activeTween = tween(this.node)
            .delay(delay)
            .to(0.4, { position: targetPos }, { easing: 'quadInOut' })
            .call(() => {
                this.activeTween = null;
                onComplete && onComplete();
            })
            .start();
    }

    public skipToPosition(pos: Vec3) {
        if (this.activeTween) {
            this.activeTween.stop();
            this.activeTween = null;
        }
        this.node.setPosition(pos);
    }
}
