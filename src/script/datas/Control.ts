export enum ControlName {
    "はずれ",
    "リプレイ",
    "ベル2",
    "ベル3",
    "BIG",
    "REG",
    "重複ベル",
    "ボーナス制御",
    "ベル1"
}

export const Control = {
    reel: {
        speed: 37,
        slipspeed: 37,
        margin: 0
    },
    minbet: 1,
    wait: 0,
    maxpay: [12, 12, 12]
}