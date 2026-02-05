import { _decorator, Component, Node, Prefab, Vec3, instantiate, UITransform, AudioClip, Button } from 'cc';
import { BlackJackManager } from './BlackJackManager';
import { BettingChip } from '../chips/BettingChip';

const { ccclass, property } = _decorator;

@ccclass('BettingChipManager')
export class BettingChipManager extends Component {

    @property(AudioClip)
    audioChipFalling: AudioClip = null;

    @property({type: Prefab})
    public chipPrefab500: Prefab = null;
    @property({type: Prefab})
    public chipPrefab1000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab2000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab3000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab4000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab5000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab10000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab15000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab20000: Prefab = null;

    @property({type: Prefab})
    public chipPrefab30000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab40000: Prefab = null;

    @property({type: Prefab})
    public chipPrefab50000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab100000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab150000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab200000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab300000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab400000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab500000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab1000000: Prefab = null;
    @property({type: Prefab})
    public chipPrefab5000000: Prefab = null;


    @property(Node)
    chipLayer: Node = null;

    private activeBets: Map<number, Node[]> = new Map();
    private centerChips: Node[] = [];

    private blackJackManager: BlackJackManager;

    setManagerRef(ref: BlackJackManager) {
        this.blackJackManager = ref;
    }

    /**
     * Call this to remove all betting chips (e.g., on game end or reset).
     */
    public resetAllBets(): void {

        this.centerChips = [];

        // Destroy all chips from all players
        for (const chips of this.activeBets.values()) {
            for (const chip of chips) {
                if (chip && chip.isValid) {
                    chip.destroy();
                }
            }
        }

        // Clear tracking map
        this.activeBets.clear();

        // Optional: clear any stray chips under chipLayer (e.g., center area)
        for (const chip of this.chipLayer.children) {
            if (chip && chip.isValid) {
                chip.destroy();
            }
        }
    }

    // add chips betting, one seat can bet the same chips
    addMoreBet(potIndex: number, node: Node) {
        if (!this.activeBets.has(potIndex)) {
            this.activeBets.set(potIndex, []);
        }
        this.activeBets.get(potIndex)!.push(node);
    }

    // add chips betting, one seat can bet only one chip
    addChip(seatId: number, chip: Node) {
        // Check if player already has a chip
        if (this.activeBets.has(seatId)) {
            const existingChips = this.activeBets.get(seatId);
            for (const oldChip of existingChips) {
                if (oldChip && oldChip.isValid) {
                    oldChip.destroy(); // 💥 Remove previous chip
                }
            }
        }

        // Replace with new chip
        this.activeBets.set(seatId, [chip]);
    }


    getChipsInPot(potIndex: number): Node[] {
        return this.activeBets.get(potIndex) || [];
    }
    

    // For example, when returning all chips to player
    returnChips(potIndex: number, targetNode: Node,playSound = false) {
        const chips = this.activeBets.get(potIndex) || [];
        chips.forEach((chip, index) => {
            this.animateChipToTarget(chip, targetNode, index * 0.1,playSound);
        });
        this.activeBets.delete(potIndex);
    }

    
    /**
     * Animate chip from player to center
     * @param fromNode The player node (must be in same hierarchy as chipLayer or world-based)
     * @param toCenterPos The center table position in world space
     * @returns The instantiated chip node
     */
    public animateChipToCenter(totalBet :number,fromNode: Node, toCenterPos: Vec3,playSound =false): Node {
        var chipPrefabsMaped = [
            {value:500,prefab :this.chipPrefab500},
            {value:1000,prefab :this.chipPrefab1000},
            {value:2000,prefab :this.chipPrefab2000},
            {value:3000,prefab :this.chipPrefab3000},
            {value:4000,prefab :this.chipPrefab4000},
            {value:5000,prefab :this.chipPrefab5000},
            {value:10000,prefab :this.chipPrefab10000},
            {value:15000,prefab :this.chipPrefab15000},
            {value:20000,prefab :this.chipPrefab20000},
            {value:30000,prefab :this.chipPrefab30000},
            {value:40000,prefab :this.chipPrefab40000},
            {value:50000,prefab :this.chipPrefab50000},
            {value:100000,prefab :this.chipPrefab100000},
            {value:150000,prefab :this.chipPrefab150000},
            {value:200000,prefab :this.chipPrefab200000},
            {value:300000,prefab :this.chipPrefab300000},
            {value:400000,prefab :this.chipPrefab400000},
            {value:500000,prefab :this.chipPrefab500000},
            {value:1000000,prefab :this.chipPrefab1000000},
            {value:5000000,prefab :this.chipPrefab5000000},
        ];

        const chipData = chipPrefabsMaped.find( c => c.value == totalBet);
        if(chipData && chipData.prefab != null){
            const chip = instantiate(chipData.prefab);
            this.chipLayer.addChild(chip);

            const fromWorldPos = fromNode.getWorldPosition();
            const centerOffset = new Vec3(
                toCenterPos.x + Math.random() * 60 - 15,
                toCenterPos.y + Math.random() * 50 - 15,
                0
            );

            const localFrom = this.chipLayer.getComponent(UITransform).convertToNodeSpaceAR(fromWorldPos);
            const localTo = this.chipLayer.getComponent(UITransform).convertToNodeSpaceAR(centerOffset);

            chip.setPosition(localFrom);
            //✅ Fix: Store Target Position When Animating
            chip['__targetPosition'] = localTo;  // 🆕 Add this
            chip.getComponent(BettingChip).moveTo(localTo,
                0,()=>{
                    this.playAudioChipFalling(playSound);
                }
            );
            this.centerChips.push(chip);
            return chip;
        }
        else
        {
            console.log( `No chip amount : ${totalBet} on table`);
            return null;
        }
            
    }

    playAudioChipFalling(playSound: boolean) {
        if(this.audioChipFalling && playSound && this.blackJackManager){
            this.blackJackManager.playSound(this.audioChipFalling);
        }
    }

    public forceChipsToCenter(): void {
        for (const chip of this.centerChips) {
            if (!chip || !chip.isValid) continue;

            const targetPos: Vec3 = chip['__targetPosition'];
            const bettingChip = chip.getComponent(BettingChip);
            if (targetPos && bettingChip) {
                //console.log(`[forceChipsToCenter] Skipping animation and snapping chip to`, targetPos);
                bettingChip.skipToPosition(targetPos);
            } else {
               // console.warn(`[forceChipsToCenter] Missing target position or BettingChip on`, chip);
            }
        }
    }


    /**
     * Return chip to player or move to dealer after result
     * @param chip The chip Node returned from animateChipToCenter
     * @param toNode Target Node (player or dealer)
     * @param delay Optional delay
     */
    public animateChipToTarget(chip: Node, toNode: Node, delay: number = 0,playSound = false) {
        if(chip){
            const targetWorldPos = toNode.getWorldPosition();
            const localTarget = this.chipLayer.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);

            const betChip =  chip.getComponent(BettingChip);
            if(betChip){
                betChip.moveTo(localTarget, delay, () => {
                    this.playAudioChipFalling(playSound);
                    chip.destroy();
                });
            }
        }
    }

    /**
     * Create chip nodes to match a given amount using available denominations.
     * @param amount Total value to return (e.g., 12000)
     * @param fromNode Dealer position
     * @param toNode Player position
     * @param playSound Whether to play sound on arrival
     */
    public payBackChips(amount: number, fromNode: Node, toNode: Node, playSound = false) {
        const chipPrefabsMaped = [
            { value: 5000000, prefab: this.chipPrefab5000000 },
            { value: 1000000, prefab: this.chipPrefab1000000 },
            { value: 500000, prefab: this.chipPrefab500000 },
            { value: 400000, prefab: this.chipPrefab400000 },
            { value: 300000, prefab: this.chipPrefab300000 },
            { value: 200000, prefab: this.chipPrefab200000 },
            { value: 150000, prefab: this.chipPrefab150000 },
            { value: 100000, prefab: this.chipPrefab100000 },
            { value: 50000, prefab: this.chipPrefab50000 },
            { value: 40000, prefab: this.chipPrefab40000 },
            { value: 30000, prefab: this.chipPrefab30000 },
            { value: 20000, prefab: this.chipPrefab20000 },
            { value: 15000, prefab: this.chipPrefab15000 },
            { value: 10000, prefab: this.chipPrefab10000 },
            { value: 5000, prefab: this.chipPrefab5000 },
            { value: 4000, prefab: this.chipPrefab4000 },
            { value: 3000, prefab: this.chipPrefab3000 },
            { value: 2000, prefab: this.chipPrefab2000 },
            { value: 1000, prefab: this.chipPrefab1000 },
            { value: 500, prefab: this.chipPrefab500 },
        ];

        let remaining = amount;
        let delayStep = 0;

        for (const { value, prefab } of chipPrefabsMaped) {
            while (remaining >= value) {
                remaining -= value;

                const chip = instantiate(prefab);
                this.chipLayer.addChild(chip);

                const fromWorld = fromNode.getWorldPosition();
                const toWorld = toNode.getWorldPosition();

                const localFrom = this.chipLayer.getComponent(UITransform).convertToNodeSpaceAR(fromWorld);
                const localTo = this.chipLayer.getComponent(UITransform).convertToNodeSpaceAR(toWorld);

                chip.setPosition(localFrom);

                chip.getComponent(BettingChip).moveTo(localTo, delayStep * 0.1, () => {
                    this.playAudioChipFalling(playSound);
                    chip.destroy(); // or keep it visible for stacking
                });

                delayStep++;
            }
        }
    }

}
