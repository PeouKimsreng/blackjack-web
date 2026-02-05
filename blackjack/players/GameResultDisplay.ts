import {
    _decorator,
    Component,
    sp,
    tween,
    Tween,
    Node,
    UIOpacity,
    Vec3,
    AudioClip
} from 'cc';

import { UIWinLostAmount } from '../game_ui/UIWinLostAmount';
import { BlackJackManager } from '../manager/BlackJackManager';
import { numberToCash } from '../../GlobalBlackJack';
import { BlackJackUIWinLostAmount } from '../game_ui/BlackJackUIWinLostAmount';

const { ccclass, property } = _decorator;

@ccclass('GameResultDisplay')
export class GameResultDisplay extends Component {

    @property(sp.Skeleton)
    public winerEffect: sp.Skeleton = null;

    @property(UIOpacity)
    public opacityControl: UIOpacity = null;

    @property(BlackJackUIWinLostAmount)
    public resultAmount: BlackJackUIWinLostAmount = null;

    @property(AudioClip)
    winGameAudioClip: AudioClip = null;

    private _isWinner: boolean = false;
    private _amountGain: number = 0;
    private _isStartedAnim = false;
    private _isEndedAnim = false;
    private targetAmountPosition = new Vec3(0, 90, 0);

    private fadeTween: Tween<UIOpacity> | null = null;
    private scaleTween: Tween<Node> | null = null;
    private moveTween: Tween<Node> | null = null;

    get isBusyAnim(): boolean {
        return this._isStartedAnim && !this._isEndedAnim;
    }

    public get isAnimatePlaying(): boolean {
        return this._isStartedAnim;
    }

    public get isAnimateReady(): boolean {
        return this._isEndedAnim;
    }

    onLoad() {
        this.node.active = false;
        this.opacityControl.opacity = 0;
        this.reset();
    }

    reset() {
        this.stopAllTweens();
        
        this.winerEffect.node.active = false;
        if(this.resultAmount != null){
            this.resultAmount.reset();
        }
        this._isStartedAnim = false;
        this._isEndedAnim = false;
    }

    onNewGame() {
        this.reset();
    }

    onWaiting() {
        this.reset();
    }

    stopAnimation() {
        this.skipAnimationImmediately();
    }

    skipAnimationImmediately() {
        this.stopAllTweens();
        this.node.active = true;
        this.opacityControl.opacity = 255;
        this.setAmountDisplay(false);
        this.resultAmount.node.setPosition(this.targetAmountPosition);
        this._isStartedAnim = false;
        this._isEndedAnim = true;

        //console.log(`skipAnimationImmediately ${this._isStartedAnim}  ended anim ${this._isEndedAnim}`);
    }

    startAnimation(onCompleted: () => void, skip: boolean = false) {
        this._isStartedAnim = true;
        this._isEndedAnim = false;
        this.stopAllTweens();
        this.node.active = true;
        this.opacityControl.opacity = 255;

        //console.log(`startAnimation ${this._isStartedAnim}  ended anim ${this._isEndedAnim}`);

        if (skip) {
            this.skipAnimationImmediately();
            onCompleted?.();
            return;
        }

        this.setAmountDisplay(true);
        this.animationResult(() => {
            this._isStartedAnim = false;
            this._isEndedAnim = true;
            onCompleted?.();
        });
    }

    setAmount(amountGain: number) {
        this._isWinner = amountGain > 0;
        this._amountGain = amountGain;
    }

    responseResult(isWinner: boolean, amountGain: number, skipAnimation: boolean = false) {
        this._isWinner = isWinner;
        this._amountGain = amountGain;

        this.node.active = true;
        this.opacityControl.opacity = 255;
        this.stopAllTweens();

        if (skipAnimation) {
            this.skipAnimationImmediately();
        } else {
            this.setAmountDisplay(true);
            this.animationResult(() => {
                this._isStartedAnim = false;
                this._isEndedAnim = true;
            });
        }
    }

    private setAmountDisplay(showEffect: boolean = false) {
        if (this._isWinner) {
            this.resultAmount.setWinAmount(`+${numberToCash(this._amountGain)}`);
            this.winerEffect.node.active = showEffect;

            if (showEffect && this.winGameAudioClip) {
                if (!BlackJackManager.instance.isPlayingSoundClip(this.winGameAudioClip)) {
                    BlackJackManager.instance.playSound(this.winGameAudioClip);
                }
            }
        } else {
            this.resultAmount.setLostAmount(`${numberToCash(this._amountGain)}`);
            this.winerEffect.node.active = false;
        }
    }

    private animationResult(onComplete: () => void) {
      //  console.log(`animationResult ${this._isStartedAnim} ended anim ${this._isEndedAnim}`);

        this._isStartedAnim = true;

        const scaleSmall = new Vec3(0.8, 0.8, 1);
        const scaleBig = new Vec3(1.1, 1.1, 1);
        const scaleNormal = Vec3.ONE.clone();
        const startPos = Vec3.ZERO.clone();
        const targetPos = this.targetAmountPosition.clone();

        this.opacityControl.opacity = 0;
        this.node.scale = scaleSmall;
        this.resultAmount.node.setPosition(startPos);

        // Fade in
        this.fadeTween = tween(this.opacityControl)
            .to(0.3, { opacity: 255 })
            .call(() => this.fadeTween = null)
            .start();

        // Scale bounce animation
        this.scaleTween = tween(this.node)
            .to(0.3, { scale: scaleBig })
            .to(0.2, { scale: scaleNormal })
            .call(() => this.scaleTween = null)
            .start();

        // Move result amount
        this.moveTween = tween(this.resultAmount.node)
            .to(1, { position: targetPos })
            .call(() => {
                this.resultAmount.node.setPosition(targetPos);
                this.moveTween = null;
                onComplete?.();
            })
            .start();
    }

    public hideResult() {
        this._isStartedAnim = false;
        this._isEndedAnim = false;
        this.stopAllTweens();

        this.fadeTween = tween(this.opacityControl)
            .to(0.3, { opacity: 0 })
            .call(() => {
                this.fadeTween = null;
                this.node.active = false;
            })
            .start();
    }

    private stopAllTweens() {
        this.fadeTween?.stop();
        this.fadeTween = null;

        this.scaleTween?.stop();
        this.scaleTween = null;

        this.moveTween?.stop();
        this.moveTween = null;
    }
}