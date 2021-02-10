/**
 * Created by pekko1215 on 2017/07/15.
 */

import { Matrix, YakuData } from "../library/SlotModule";

const X = true, _ = false;

const DummyFlash = {
    "中段": Matrix.from([
        [_, _, _],
        [X, X, X],
        [_, _, _]
    ]),
    "上段": Matrix.from([
        [X, X, X],
        [_, _, _],
        [_, _, _]
    ]),
    "下段": Matrix.from([
        [_, _, _],
        [_, _, _],
        [X, X, X]
    ]),
    "右下がり": Matrix.from([
        [X, _, _],
        [_, X, _],
        [_, _, X]
    ]),
    "右上がり": Matrix.from([
        [_, _, X],
        [_, X, _],
        [X, _, _]
    ]),
    "なし": Matrix.from([
        [_, _, _],
        [_, _, _],
        [_, _, _]
    ]),
    "小V": Matrix.from([
        [X, _, X],
        [_, X, _],
        [_, _, _]
    ]),
    "小山": Matrix.from([
        [_, _, _],
        [_, X, _],
        [X, _, X]
    ])
}

export const yakuData: YakuData[] = [{
    name: "リプレイ",
    pay: [0, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "ベル",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "ベル",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "ベル",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "ベル",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "BIG1",
    pay: [0, 0, 0]
},
{
    name: "BIG2",
    pay: [0, 0, 0]
},
{
    name: "REG",
    pay: [0, 0, 0]
},
{
    name: "リプレイ",
    pay: [0, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "リプレイ",
    pay: [0, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "リプレイ",
    pay: [0, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "ボーナス小役",
    pay: [0, 15, 15],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
},
{
    name: "チェリー",
    pay: [8, 0, 0],
    flashLine: DummyFlash.なし
}
]