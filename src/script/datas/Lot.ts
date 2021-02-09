import { GameMode } from "..";
import { LotBase } from "../library/Lottery";

export const LotData: { [key in GameMode]: LotBase[] } = {
    Normal: [{
        name: "リプレイ",
        value: 1 / 7.3
    }, {
        name: 'ベル1',
        value: 1 / 11
    }, {
        name: 'ベル2',
        value: 1 / 16
    }, {
        name: 'ベル3',
        value: 1 / 21
    }, {
        name: 'BIG',
        value: 1 / 211
    }, {
        name: 'REG',
        value: 1 / 200
    }],
    BIG: [],
    REG: []
}
