import { _decorator, AudioClip, Component, director, isValid, Label, Node, Tween, tween, UIOpacity, Vec3 } from 'cc';

import { BlackJackAudiosManager } from '../manager/BlackJackAudiosManager';
import { BlackJackCustomDigitLabel } from '../menu/BlackJackCustomDigitLabel';
const { ccclass, property } = _decorator;

@ccclass('BlackJackUITimmer')
export class BlackJackUITimmer extends Component {

    @property(BlackJackCustomDigitLabel)
    digits: BlackJackCustomDigitLabel = null;

    @property(Label)
    text: Label = null;

    @property(AudioClip)
    private timeAudioClip: AudioClip = null;

    @property(UIOpacity)
    private uiOpacity: UIOpacity = null;

    static ins: BlackJackUITimmer = null;

    private tweenTimerUI: Tween<Node>;
    private tweenShake: Tween<Node>;
    private tweenDigits: Tween<Node>;
    private tweenAlarm: Tween<Node>;

    private timmerValue: number = 0;
    private _isDisplay: boolean = false;
    private timerIntervalId: number = null;

    private set IsDisplay(value: boolean) {
        this._isDisplay = value;
        if (!this._isDisplay) {
           // BlackJackAudiosManager.ins.stopSound(this.timeAudioClip);
        }
    }

    static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(BlackJackUITimmer);
        }
        return this.ins;
    }

    resetTimmerValue() {
        this.digits.setDisplay(`${0}`);
    }

    clearTweenUIMoving() {
        if (this.tweenTimerUI !== undefined) {
            this.tweenTimerUI.stop();
            this.tweenTimerUI = undefined;
        }
    }

    clearAlarmTween() {
        if (this.tweenAlarm !== undefined) {
            this.tweenAlarm.stop();
            this.tweenAlarm = undefined;
        }
    }

    clearDigitScaleTween() {
        if (this.tweenDigits !== undefined) {
            this.tweenDigits.stop();
            this.tweenDigits = undefined;
        }
    }

    startCountdown(seconds: number) {
        this.timmerValue = seconds;
        this.digits.setDisplay(`${this.timmerValue}`);

        // clear any previous timers
        this.unschedule(this.updateCountdown);

        // schedule every 1 second
        this.schedule(this.updateCountdown, 1, seconds - 1, 0);
    }

    updateCountdown() {
        this.timmerValue--;
        this.digits.setDisplay(`${this.timmerValue}`);

        if (this.timmerValue <= 0) {
            this.unschedule(this.updateCountdown);
            console.log("Countdown finished!");
        }
    }

    show(initialTime: number) {
        this.timmerValue = initialTime;
        this.startCountdown(initialTime);

        let tweenDuration: number = 0.1;
        if (this.uiOpacity == null) {
            this.uiOpacity = this.getComponent(UIOpacity);
        }

        this.clearTweenUIMoving();

        let tweenBounce = tween(this.node)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: "bounceInOut" });

        let tweenFade = tween(this.uiOpacity)
        .call(() => {
            this._isDisplay = true;
        })
        .to(tweenDuration, { opacity: 255 }, { easing: "fade" });

        this.tweenTimerUI = tween(this.node).parallel(tweenBounce, tweenFade).call(() => {
           this.uiOpacity.opacity = 255
        }).start();
    }

    hide() {

        let tweenDuration: number = 0.2;

        if (this.uiOpacity == null) {
            this.uiOpacity = this.getComponent(UIOpacity);
        }

        this.clearTweenUIMoving();
        this.clearAlarmTween();
        this.clearDigitScaleTween();
        let tweenFade  = tween(this.uiOpacity)
        .to(tweenDuration, { opacity: 0 }, { easing: "fade" })
            .call(() => {
                this.IsDisplay = false;
            })
            .start();

        this.tweenTimerUI = tween(this.node).parallel(tweenFade).start();
    }

    responseTimmer(time: number) {
        this.timmerValue = time;
        // Update the digit label
        this.digits.setDisplay(`${time}`);

        // Animate digit scale
        const target = this.digits.node;
        this.clearDigitScaleTween();
    
        this.tweenDigits = tween(target)
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
    
        // Handle time-based effects
        if (time <= 0) {
            this.resetTimmerValue();
          //  BlackJackAudiosManager.ins.stopSound(this.timeAudioClip);
        } else if (time < 3) {
            this.animateAlarm();
    
            /*
            if (!BlackJackAudiosManager.ins.isPlaying(this.timeAudioClip)) {
                BlackJackAudiosManager.ins.playSound(this.timeAudioClip);
            }
            */
        }
    }

    displayText(text: string) {
        this.text.string = text;
    }

    animateAlarm() {
        this.clearAlarmTween();

        this.node.setRotationFromEuler(0, 0, 0);
        this.node.setScale(1, 1, 1);

        const scaleTween = tween(this.node)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.2, { scale: new Vec3(1, 1, 1) });

        const shakeTween = tween(this.node)
            .to(0.05, { eulerAngles: new Vec3(0, 0, -15) })
            .to(0.05, { eulerAngles: new Vec3(0, 0, 15) })
            .to(0.05, { eulerAngles: new Vec3(0, 0, -15) })
            .to(0.05, { eulerAngles: new Vec3(0, 0, 15) })
            .to(0.05, { eulerAngles: new Vec3(0, 0, 0) });

        this.tweenAlarm = tween(this.node)
            .parallel(scaleTween, shakeTween)
            .start();
    }
}
