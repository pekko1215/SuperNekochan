import { LotBase } from "../library/Lottery";
import { YakuData } from "../library/SlotModule";

export abstract class RT {
    rt: number = -1;
    countGame(): void {
    }
    abstract hitCheck(hit: YakuData): void;
    onHit(hit: YakuData): void {
        this.hitCheck(hit);
        this.countGame();
    }
    abstract onLot(lot: LotBase): LotBase;
}

export class DefaultRT extends RT {
    constructor() {
        super();
        console.log(this.constructor.name + 'へ以降');
    }
    hitCheck(_hit: YakuData): void {
    }
    onLot(lot: LotBase): LotBase {
        return lot;
    }

}


export const RTData: { rt: RT } = {
    rt: new DefaultRT

}