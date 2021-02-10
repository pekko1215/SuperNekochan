import { SaveData } from ".";
import { BigBonus5 } from "./datas/Bonus";
import { ControlName } from "./datas/Control";
import { colorData, flashData } from "./datas/Flash";
import { LotData } from "./datas/Lot";
import { panelData } from "./datas/Panel";
import { DefaultRT, RT, RTData } from "./datas/RT";
import { sounder } from "./datas/Sound";
import { yakuData } from "./datas/Yaku";
import { EffectManager, NormalEffect } from "./Effect";
import { LotBase, Lotter } from "./library/Lottery";
import { Flash, Matrix, PanelData, ReelControl, SlotEvent, SlotModule } from "./library/SlotModule";
import { ControlMode, HitYakuData } from "./library/SlotModule/ReelController";
import { SystemStatus } from "./library/SlotModule/Status";
import { RandomChoice, Sleep } from "./Utilities";

export type GameMode = 'Normal' | 'BIG' | 'REG';

export type BonusFlag = 'BIG' | 'REG' | null;

export class SlotClass extends SlotModule {
    isLoaded = false;
    gameMode: GameMode = 'Normal'
    bonusFlag: BonusFlag = null;
    maxPayCoin = [15, 15, 8]
    effectManager: EffectManager = new EffectManager();
    options: {
        isDummyBet: boolean,
        leverEffect: null | '無音'
    } = {
            isDummyBet: false,
            leverEffect: null
        }
    lastBonus: BonusFlag | null = null;
    static async init() {
        const control = await ReelControl.FromFetchRequest('RCD/control.smr');
        let slot = new SlotClass(panelData, control, flashData.default);
        slot.isLoaded = true;
        slot.emit('loadedControll');
        return slot;
    }
    constructor(panelData: PanelData, control: ReelControl, flash: Flash) {
        super(panelData, control, flash);
        this.slotStatus.RTData = RTData;
        this.eventRegister();
    }
    eventRegister() {

    }
    async onPay({ payCoin, replayFlag, dummyReplayFlag }: { payCoin: number, replayFlag: boolean, noSE: boolean, dummyReplayFlag: boolean }): Promise<{ isReplay: boolean; }> {        // 払い出しの処理
        // 払い出しがあるかないか、そしてリプレイかどうかで処理を分けている
        let pays = payCoin;
        let loopPaySound = null;
        let payCount = 0;
        let seLoopFlag = false;

        if (dummyReplayFlag) {
            this.options.isDummyBet = true;
            (async () => {
                this.freeze();
                await Promise.race([
                    this.once('pressBet'),
                    this.once('pressAllmity')
                ])
                await this.onBetCoin(3);
                this.resume();
            })();
            return { isReplay: true }
        }

        if (pays >= 3) {
            loopPaySound = 'pay4'
        }
        if (pays >= 12) {
            loopPaySound = 'pay12'
        }

        if (loopPaySound) {
            sounder.playSound(loopPaySound, seLoopFlag);
        }

        if (replayFlag) {
            sounder.playSound('bet')
            sounder.playSound('replay');
        }

        const Segments = this.effectManager.Segments;
        let bonus: BigBonus5 = this.slotStatus.bonusData;
        let startBonusCount = 0;
        if (bonus) {
            startBonusCount = bonus.getBonusPayCount();
        }
        while (pays--) {
            SaveData.coin++;
            payCount++;
            SaveData.outCoin++;
            SaveData.coinLog[SaveData.coinLog.length - 1]++;
            this.effectManager.changeCredit(1);
            Segments.PaySeg.setSegments(payCount);
            if (this.gameMode === 'BIG' || this.gameMode === 'REG') {
                let num = SaveData.getGetCoin();
                if (num < 0) num = 0;
                Segments.DekaSeg.setSegments(num.toString().slice(-3));
                startBonusCount--;
                if (startBonusCount < 0) startBonusCount = 0;
                Segments.EffectSeg.setSegments(startBonusCount);
            }
            await Sleep(50);
        }
        if (loopPaySound && seLoopFlag) {
            sounder.stopSound(loopPaySound);
            loopPaySound = null;
        }
        return { isReplay: replayFlag };
    }
    async onPayEnd({ payCoin, hitYakus }: { payCoin: number, hitYakus: HitYakuData[] }) {
        /**************************
         * ボーナス終了後の処理
         * 払い出し後の演出や、ボーナス終了の処理を記述する。
         * 
         */
        if (this.slotStatus.bonusData) {
            this.slotStatus.bonusData.onPay(payCoin)
            this.setGamemode(this.slotStatus.bonusData.getGameMode());
            if (this.slotStatus.bonusData.isEnd) {
                this.emit('bonusEnd');
            };
        }
        await this.effectManager.onPay(payCoin, hitYakus, this.gameMode, this.bonusFlag);
    }
    async onReelStop(_number: number) {
        sounder.playSound("stop")
    }
    @SlotEvent("bonusEnd")
    async onBonusEnd() {
        /**************************
         * ボーナス終了後の処理
         * 【注意】
         * このイベントは、手動で発火が必要です。
         * slotModule.emit('bonusEnd')
         * と呼び出してください。
         */

        // SaveData.bonusEnd();
        this.setGamemode("Normal");
        this.freeze();
        await Sleep(2000);
        this.resume();
        let currentBonus = this.slotStatus.bonusData;
        this.slotStatus.bonusData = null;
        this.bonusFlag = null;
        this.effectManager.Segments.DekaSeg.reset();

        SaveData.bonusEnd();

        this.effectManager.onBonusEnd();

    };
    @SlotEvent('leverOn')
    async onLeverOn() {
        SaveData.nextGame(this.slotStatus.betCoin);
        this.effectManager.changeCredit(0)
        if (this.options.leverEffect !== '無音') sounder.playSound("start")
        this.options.leverEffect = null;
    }
    async onHitCheck(hitYakuDatas: HitYakuData[]) {
        /***********************
         * 3リール停止後、SlotModuleから送られてくる成立役を元に、
         * 払い出し枚数、フラッシュ、アクションなどを決定する。
         */

        let replayFlag = false;
        let payCoin = 0;
        let flashMatrix = Matrix.from<boolean>([
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ]);
        let hitYakus = [];
        let dummyReplayFlag = false
        for (let data of hitYakuDatas) {
            let { index, matrix } = data;
            let yaku = yakuData[index];
            console.log(yaku)
            data.yaku = yaku;
            hitYakus.push(yaku);

            let { name, pay } = yaku;
            let p = pay[3 - this.slotStatus.betCoin];

            if (Array.isArray(p)) {
                p = p[this.reelController!.mode];
            }
            payCoin += p;
            let lineMatrix = yaku.flashLine || matrix;
            lineMatrix = lineMatrix.map((v, x, y) => {
                return lineMatrix.get(y, x)
            })

            // 成立役フラッシュの合成
            flashMatrix = lineMatrix.copy();

            switch (name) {
                case 'リプレイ':
                    replayFlag = true
                    break
                case 'BIG1':
                case 'BIG2':
                    this.slotStatus.bonusData = new BigBonus5('BIG', 210);
                    this.setGamemode("BIG");
                    this.bonusFlag = null;
                    SaveData.bonusStart('BIG')
                    this.lastBonus = "BIG";
                    (this.effectManager.currentEffect as NormalEffect).isKokutid = false;
                    this.effectManager.Segments.DekaSeg.reset();
                    break
                case 'REG':
                    this.slotStatus.bonusData = new BigBonus5('REG', 90);
                    this.setGamemode('REG');
                    this.bonusFlag = null;
                    this.lastBonus = "REG";
                    SaveData.bonusStart('REG');
                    (this.effectManager.currentEffect as NormalEffect).isKokutid = false;
                    this.effectManager.Segments.DekaSeg.reset();
                    break
            }


            (this.slotStatus.RTData.rt as RT).hitCheck(yaku)
        }
        switch (name) {
            default:
                // 成立役フラッシュ
                (async () => {
                    while (this.slotStatus.systemStatus !== SystemStatus.Beted) {
                        await this.flashController.setFlash(this.flashController.defaultFlash, 20);
                        let flash = flashData.default.copy();
                        flash.front.replaceByMatrix(flashMatrix, colorData.LINE_F);
                        await this.flashController.setFlash(flash, 20)
                    }
                })();
        }

        if (payCoin > this.maxPayCoin[this.slotStatus.betCoin - 1]) payCoin = this.maxPayCoin[this.slotStatus.betCoin - 1];

        return { payCoin, replayFlag, hitYakus: hitYakuDatas, dummyReplayFlag };
    }
    async onBet() {
        // ベットボタンを押したときの処理
        // フラッシュをリセットする
        this.flashController.clearFlashReservation();
    }
    async onBetCoin(betCoin: number) {
        // ベットを行うときの処理
        // ベット枚数分音を鳴らしている

        sounder.playSound("bet")
        while (betCoin--) {
            if (!this.options.isDummyBet) {
                SaveData.coin--;
                SaveData.inCoin++;
                this.effectManager.changeCredit(-1);
            }
            await Sleep(70);
        }
        this.options.isDummyBet = false;
        this.effectManager.Segments.PaySeg.reset();
    }
    onLot(): number {
        /**
        * 抽選処理
        * retに制御名を返す
        * Lotterクラスを使うと便利
        * lotdata.jsに各フラグの成立確率を記述しよう
        * フラグから制御への振り分けもココで行う。
        * サンプルだとスイカ1とスイカ2の振り分け
        * window.powerはデバッグの強制フラグ用
        */

        let ret: ControlName | null = null;
        let lotter = new Lotter(...LotData[this.gameMode]);
        let lot: LotBase = lotter.lot() || { name: "はずれ" };

        lot = (this.slotStatus.RTData.rt as RT).onLot(lot) || lot
        this.effectManager.pushOrder = null;

        switch (this.gameMode) {
            case 'Normal':
                switch (lot?.name) {
                    case 'BIG':
                        if (this.bonusFlag !== null) {
                            ret = ControlName[this.bonusFlag];
                            break
                        }
                        this.bonusFlag = 'BIG';
                        ret = RandomChoice([
                            ControlName["BIG"],
                            ControlName["BIG"],
                            ControlName["BIG"],
                            ControlName["BIG"],
                            ControlName["重複ベル"],
                        ])
                        break;
                    case 'REG':
                        if (this.bonusFlag !== null) {
                            ret = ControlName[this.bonusFlag];
                            break
                        }
                        this.bonusFlag = 'REG';
                        ret = RandomChoice([
                            ControlName["REG"],
                            ControlName["REG"],
                            ControlName["REG"],
                            ControlName["REG"],
                            ControlName["重複ベル"],
                        ])
                        break;
                    case 'リプレイ':
                        ret = ControlName.リプレイ
                        break
                    case 'ベル1':
                    case 'ベル2':
                    case 'ベル3':
                        ret = ControlName[lot.name as "ベル1" | "ベル2" | "ベル3"];
                        if (this.bonusFlag !== null) {
                            ret = ControlName.重複ベル;
                        }
                        break
                    case 'はずれ':
                        ret = ControlName.はずれ;
                        if (this.bonusFlag) {
                            ret = ControlName[this.bonusFlag];
                        }
                        break
                }
                break;
            case "BIG":
            case "REG":
                ret = ControlName.ボーナス制御;
                break

        }

        if (ret === null) throw new Error(`リール制御コードが不正です ${lot.name}=>${ret}`);

        this.effectManager.onLot(lot, ret, this.gameMode, this.bonusFlag);

        console.log(lot?.name, ControlName[ret], this);
        return ret;
    }
    setGamemode(mode: GameMode) {
        console.log(`${this.gameMode} -> ${mode}`);
        switch (mode) {
            case 'Normal':
                this.gameMode = mode;
                this.reelController.mode = ControlMode.NORMAL
                this.slotStatus.maxBet = 3;
                break
            case 'BIG':
                this.gameMode = mode;
                this.reelController.mode = ControlMode.JAC
                this.slotStatus.maxBet = 2;
                this.bonusFlag = "BIG";
                RTData.rt = new DefaultRT;
                break
            case 'REG':
                this.gameMode = mode;
                this.reelController.mode = ControlMode.JAC
                this.slotStatus.maxBet = 2;
                this.bonusFlag = "REG";
                RTData.rt = new DefaultRT;
                break

        }
    }
};