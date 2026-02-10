import {
    _decorator,
    assetManager,
    Component,
    Node,
    Sprite,
    SpriteAtlas,
    SpriteFrame,
    tween,
    Tween,
    UIOpacity,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackAvatarFrameOfMonth')
export class BlackJackAvatarFrameOfMonth extends Component {

    /** Minimum visible opacity while pulsing (0–255). */
    @property
    minOpacity = 80;

    @property(Sprite)
    frame : Sprite;

    /** Set to true when it should run (e.g. when the seat becomes active). */
    private _isRunning = false;

    private _tweenScale: Tween<Node> | null = null;

    protected onLoad(): void {
        this._isRunning = false;
    }

    getPlayerFrameOfMonth(isSelf: boolean) : SpriteFrame {
        const frameName = isSelf ? "frame player of month_myself":"frame player of month";
        var frameSprite : SpriteFrame = (assetManager.bundles.get('resources').get(`avatar`, SpriteAtlas) as SpriteAtlas).getSpriteFrame(frameName);
        return frameSprite;
    }

    updateFrameUI(isSelf : boolean,isDealer : boolean,session_is_player_of_month: boolean): void {

        var active_session_is_player_of_month = session_is_player_of_month;

        if(!this.frame){return;}
        
        this.frame.spriteFrame = this.getPlayerFrameOfMonth(isSelf);
        
        if(!isSelf && isDealer && active_session_is_player_of_month){
            this.frame.node.active = false;
        }
        else if (active_session_is_player_of_month){
            this.frame.node.active = true;
        }
        else{
            this.frame.node.active = false;
        }
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

