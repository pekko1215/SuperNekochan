import { Flash, PanelData } from "../library/SlotModule";
import { flashData } from "./Flash";

export const panelData = new class implements PanelData {
    reel = {
        x: 0,
        y: 10,
        blank: 1,
        defaultFlash: flashData.default,
        speed: 37,
        slipSpeed: 37
    };
    PIXIOptions = {
        width: 614,
        height: 273,
        backgroundColor: 0xcccccc
    };

}