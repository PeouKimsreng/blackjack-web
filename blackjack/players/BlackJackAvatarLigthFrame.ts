import {
    _decorator,
    Component,
    Node,
    tween,
    Tween,
    UIOpacity,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackAvatarLightFrame')
export class BlackJackAvatarLightFrame extends Component {
    /** Degrees per second. */
    @property
    rotateSpeed = 180;

    /** Seconds for one fade-in/out cycle (1 = in, 1 = out → total 2 s). */
    @property
    pulseCycle = 2;

    /** Minimum visible opacity while pulsing (0–255). */
    @property
    minOpacity = 80;

    /** Set to true when it should run (e.g. when the seat becomes active). */
    private _isRunning = false;

    private _tweenScale: Tween<Node> | null = null;

    protected onLoad(): void {
        this._isRunning = false;
    }

    isStartedEffect(){
        return this._isRunning;
    }

    reset(){
        this.stopEffect();
        this._isRunning = false;
    }

    public startEffect(): void {
        this.node.active =true;
        if (this._isRunning) return;
        this._isRunning = true;

        if(this._tweenScale){
            this._tweenScale.stop();
            this._tweenScale = undefined;
        }

        const opacity = this.node.getComponent(UIOpacity)
            ?? this.node.addComponent(UIOpacity);
        opacity.opacity = 255;

        // ✨ Scale bounce
        this._tweenScale = tween(this.node)
            .to(this.pulseCycle * 0.5, { scale: new Vec3(1.1, 1.1, 1) })
            .to(this.pulseCycle * 0.5, { scale: new Vec3(1.0, 1.0, 1) })
            .start();
    }


    /** Optional: call from outside to stop & hide the highlight */
    public stopEffect(): void {
        if (!this._isRunning) return;
        this._isRunning = false;

        this._tweenScale?.stop();

        this.node.angle = 0;
        const opacity = this.node.getComponent(UIOpacity);
        if (opacity) opacity.opacity = 0;
    }

    // Convenience hooks – automatically run while the node is enabled
    // protected onEnable()  { this.startEffect(); }
    // protected onDisable() { this.stopEffect(); }
    protected onDestroy() { this.stopEffect(); }
}

