import { ControlName } from "./datas/Control";
import { SegmentControler } from "./library/SegmentControler";
import { LotBase } from "./library/Lottery";
import { Bonus } from "./datas/Bonus";
import { BonusFlag, GameMode, Slot } from "./index";
import { HitYakuData } from "./library/SlotModule/ReelController";
import { Matrix } from "./library/SlotModule";
import { colorData, flashData } from "./datas/Flash";
import { ArrayLot, ArrayLotObject, Rand, RandomChoice, Sleep } from "./Utilities";
import { sounder } from "./datas/Sound";


abstract class Effect {
    effectManager: EffectManager;
    isAT: boolean = false;
    kokutiMode = true;

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

export class NormalEffect extends Effect {
    isPenalty: boolean = false;
    isKokutid = false;
    constructor(effectManager: EffectManager) {
        super(effectManager);
    }
    async onLot(lot: LotBase, control: ControlName, gameMode: GameMode, bonusFlag: BonusFlag) {

    }
    async payEffect(_payCoin: number, hitYakus: HitYakuData[], gameMode: GameMode, bonusFlag: BonusFlag): Promise<void> {
        if (bonusFlag === null) return;
        if (gameMode !== "Normal") return;
        if (!this.effectManager.currentEffect.kokutiMode) return;
        if (this.isKokutid) return;
        if (hitYakus.length !== 0) return;
        if (!Rand(3)) return;
        let { flashController } = Slot;

        let bonusMatrix = Slot.reelController.getReelMatrix().map((v) => {
            return v && [4, 5, 6, 7].includes(v);
        })
        let flashList: { x: number, y: number, matrix: Matrix<boolean> }[] = []
        bonusMatrix.forEach((v, y, x) => {
            if (v) {
                let matrix = new Matrix(bonusMatrix.width, bonusMatrix.height).map((_, mx, my) => {
                    return mx === x && my === y
                });
                flashList.push({ x, y, matrix });
            }
        })

        let flashFlag = true;
        this.isKokutid = true;

        Slot.once('bet', e => {
            flashFlag = false;
            flashController.clearFlashReservation();
        })
        Slot.freeze();
        await sounder.playSound('pyui');
        flashController.clearFlashReservation()

        const { DekaSeg } = this.effectManager.Segments;

        let segNumber = (bonusFlag === "BIG"
            ? RandomChoice([7, 7, 5])
            : RandomChoice([3, 3, 5])) as 3 | 5 | 7

        this.bonusHitSegEffect(segNumber).then(() => {
            const fn = () => {
                setTimeout(() => {
                    if (Slot.gameMode !== "Normal") return;
                    DekaSeg.setSegments("-" + segNumber + "-")
                    setTimeout(() => {
                        if (Slot.gameMode !== "Normal") return;
                        DekaSeg.setSegments("- -")
                        fn();
                    }, 200)
                }, 200)
            }
            fn();
            Slot.resume();
        });
        while (flashFlag) {
            for (let f of flashList) {
                if (!flashFlag) break;
                let flash = flashData.syoto.copy();
                flash.front.replaceByMatrix(f.matrix, colorData.DEFAULT_F);
                flashController.setFlash(flash, 1)
            }
            await Sleep(1);
        }
    }

    async bonusHitSegEffect(segNumber: 3 | 5 | 7) {
        const NumberTableMap = {
            3: [
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [1, 2, 3],
                [9, 8, 7, 6, 5, 4, 3]
            ],
            5: [
                [1, 2, 3, 4, 5],
                [1, 2, 3, 4, 5],
                [1, 2, 3, 4, 5],
                [9, 8, 7, 6, 5]
            ],
            7: [
                [9, 8, 7],
                [9, 8, 7],
                [9, 8, 7, 6, 5, 6, 7],
                [1, 2, 3, 4, 5, 6, 7],
                [5, 6, 7]
            ]
        }[segNumber];
        let list = RandomChoice(NumberTableMap);
        for (let n of list) {
            let str = "-" + n + "-";
            this.effectManager.Segments.DekaSeg.setSegments(str);
            sounder.playSound("SegStop");
            await Sleep(700);
        }

        switch (segNumber) {
            case 3:
                await sounder.playSound('bubu');
                break
            case 5:
                await sounder.playSound('down');
                break
            case 7:
                await sounder.playSound('paka-n');
                break
        }

    }
    async lotEffect() {

    }
    async onBonusEnd() {
        this.effectManager.Segments.DekaSeg.reset();
    }
}