import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlackJackCustomDigitLabel')
export class BlackJackCustomDigitLabel extends Component {

    @property(Sprite)
    digitsNumber: Array<Sprite> = Array()

    @property(SpriteFrame)
    numbers: Array<SpriteFrame> = Array()

    maxDigit : number ;

    current : number;
    onLoad() {
        this.maxDigit = this.digitsNumber.length;
        this.current = -1;
    }

    setDisplay(value: string, goldent : boolean = false): void {
        this.updateDigits(value, false);
    }

    setDisplayCash(value: string): void {
        this.updateDigits(value, true);
    }

    private updateDigits(value: string, isCashFormat: boolean): void {
        if (parseInt(value) === this.current) return;
        this.current = parseInt(value);

        const chars = value.split('');
        const length = chars.length;

        for (let i = 0; i < this.maxDigit; i++) {
            const hasDigit = i < length;
            this.digitsNumber[i].node.active = hasDigit;

            if (hasDigit) {
                const char = chars[i];
                let frameIndex: number;

                if (isCashFormat) {
                    if (char === '.') frameIndex = 10;
                    else if (char === ',') frameIndex = 11;
                    else if (char === '-' || char === '+') frameIndex = 12;
                    else if (char === 'K' ) frameIndex = 13;
                    else if (char === 'M' ) frameIndex = 14;
                    else frameIndex = parseInt(char);
                } else {
                    frameIndex = parseInt(char);
                }

                if (!isNaN(frameIndex) && this.numbers[frameIndex]) {
                    this.digitsNumber[i].spriteFrame = this.numbers[frameIndex];
                    this.digitsNumber[i].node.active = true;
                    this.node.active = true;
                } else {
                    //console.warn(`Invalid character '${char}' at index ${i} for digit display.`);
                    this.digitsNumber[i].node.active = false;
                }
            }
        }
    }


    
}


