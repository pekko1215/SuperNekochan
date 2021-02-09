import { ControlName } from "./datas/Control";
import { SegmentControler } from "./library/SegmentControler";
import { LotBase } from "./library/Lottery";
import { Bonus } from "./datas/Bonus";
import { BonusFlag, GameMode } from "./index";
import { HitYakuData } from "./library/SlotModule/ReelController";


abstract class Effect {
    effectManager: EffectManager;
    isAT: boolean = false;

    constructor(effectManager: EffectManager) {
        this.effectManager = effectManager;
    }
    abstract onLot(lot: LotBase | null, control: ControlName, gameMode: GameMode, bonusFlag: BonusFlag): Promise<void>;
    abstract payEffect(payCoin: number, hitYakus: HitYakuData[], gameMode: GameMode, bonusFlag: BonusFlag): Promise<void>;
    onPay(payCoin: number, hitYakus: HitYakuData[], gameMode: GameMode, bonusFlag: BonusFlag) {
        this.payEffect(payCoin, hitYakus, gameMode, bonusFlag);
    }
    abstract onBonusEnd(bonusData: Bonus): Promise<void>;
}

function segInit(canvas: HTMLCanvasElement, size: number) {
    let sc = new SegmentControler(canvas, size, 0, -3, 50, 30);
    sc.setOffColor(120, 120, 120)
    sc.setOnColor(230, 0, 0)
    sc.reset();
    return sc;
}
export class EffectManager {
    credit = 50;
    dummyRTGameCount: number = -1;
    downEffectLevel: number = 3;
    Segments = {
        PaySeg: segInit(document.querySelector('#paySegment') as HTMLCanvasElement, 2),
        EffectSeg: segInit(document.querySelector('#effectSegment1') as HTMLCanvasElement, 3),
        DekaSeg: segInit(document.querySelector('#effectSegment2') as HTMLCanvasElement, 3),
        CreditSeg: segInit(document.querySelector('#creditSegment') as HTMLCanvasElement, 2)
    }
    pushOrder: number[] | null = null;
    currentEffect: Effect = new NormalEffect(this);
    shortFreezed: boolean = false;
    typeWritterd: boolean = false;
    onLot(lot: LotBase | null, control: ControlName, gameMode: GameMode, bonusFlag: BonusFlag) {

        return this.currentEffect.onLot(lot, control, gameMode, bonusFlag);
    }
    async onPay(payCoin: number, hitYakus: HitYakuData[], gameMode: GameMode, bonusFlag: BonusFlag) {

        await this.currentEffect.onPay(payCoin, hitYakus, gameMode, bonusFlag);
    }
    constructor() {
        this.Segments.CreditSeg.setSegments(50);
        this.Segments.CreditSeg.setOffColor(80, 30, 30);
        this.Segments.PaySeg.setOffColor(80, 30, 30);
        this.Segments.EffectSeg.setOffColor(5, 5, 5);
        this.Segments.DekaSeg.setOffColor(5, 5, 5);
        this.Segments.CreditSeg.reset();
        this.Segments.PaySeg.reset();
        this.Segments.EffectSeg.reset();
        this.Segments.DekaSeg.reset();
    }
    changeCredit(delta: number) {
        this.credit += delta;
        if (this.credit < 0) {
            this.credit = 0;
        }
        if (this.credit > 50) {
            this.credit = 50;
        }
        this.Segments.CreditSeg.setSegments(this.credit)
    }
    async onBonusEnd() {

    }
    async syotoRegister() {

    }
}

class NormalEffect extends Effect {
    isNabi: boolean = false;
    isPenalty: boolean = false;
    constructor(effectManager: EffectManager) {
        super(effectManager);
    }
    async onLot(lot: LotBase, control: ControlName, gameMode: GameMode, bonusFlag: BonusFlag) {

    }
    async payEffect(_payCoin: number, hitYakus: HitYakuData[], _gameMode: GameMode, _bonusFlag: BonusFlag): Promise<void> {
    }
    async lotEffect() {

    }
    async onBonusEnd() {

    }
}