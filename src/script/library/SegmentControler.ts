import { SevenSegment } from "./external/SevenSegment";

export class SegmentControler {
    segments:SevenSegment[];
    constructor(canvas:HTMLCanvasElement,length: number,x: number,y: number,width: number,offset: number){
        this.segments = [];
        for (var i = 0; i < length; i++) {
            this.segments[i] = new SevenSegment(canvas, x + offset * i, y, width);
        }
        this.reset();
    }
    setSegments(str: string | number) {
        str = "" + str
        var arr = str.split("");
        while (arr.length < this.segments.length) {
            arr.unshift(" ");
        }
        arr = arr.slice(-3);
        var i = 0;
        this.reset();
        while (this.segments[i] != undefined && arr[i] != undefined) {
            this.segments[i].draw(this.segments[i].mapping(arr[i]));
            i++;
        }
    }
    setSegment(idx: number, s: string) {
        s = s.toString();
        this.segments[idx].draw(this.segments[idx].mapping(s))
    }
    setOnColor(r: number, g: number, b: number) {
        this.segments.forEach(v=> {
            v.setOnColor(r, g, b);
        })
    }
    setOffColor(r: number, g: number, b: number) {
        this.segments.forEach(v=> {
            v.setOffColor(r, g, b);
        })
    }
    reset() {
        this.segments.forEach(v=> {
            v.reset();
        })
    }
}