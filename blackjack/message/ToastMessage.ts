import { _decorator, Component, director, isValid, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToastMessage')
export class ToastMessage extends Component {

    static ins : ToastMessage = null;

    @property(Label)
    text: Label = null;

     static get instance() {
        if (!isValid(this.ins)) {
            this.ins = director.getScene().getChildByName('Canvas').getComponentInChildren(ToastMessage);
        }    
        return this.ins;
    }

    show(message: string, duration: number = 2) {
        console.log("ToastMessage: " + message);
        this.text.string = message;
        this.node.active = true;
        this.scheduleOnce(this.hideMessage, duration);
    }

    hideMessage(){
        this.node.active = false;
    }

    reset(){
        this.unschedule(this.hideMessage);

        this.node.active = false;
    }
}

