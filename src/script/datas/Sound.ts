import { Sounder } from "../library/Sounder";

export const sounder = new Sounder();

// 使用SE：魔王魂


sounder.addFile("sound/stop.wav", "stop").addTag("se").addTag('small');
sounder.addFile("sound/stop2.wav", "stop2").addTag("se").addTag('small');

sounder.addFile("sound/start.wav", "start").addTag("se").addTag('small');
sounder.addFile("sound/bet.wav", "bet").addTag("se").addTag('small');
sounder.addFile("sound/pay4.wav", "pay4").addTag("se");
sounder.addFile("sound/pay12.wav", "pay12").addTag("se");
sounder.addFile("sound/payAT.wav", "payAT").addTag("se");
sounder.addFile("sound/replay.wav", "replay").addTag("se");

sounder.addFile("sound/seg1.wav", "seg1").addTag("se");
sounder.addFile("sound/seg2.wav", "seg2").addTag("se");
sounder.addFile("sound/seg3.wav", "seg3").addTag("se");
sounder.addFile("sound/seg4.wav", "seg4").addTag("se");

sounder.addFile("sound/paka-n.mp3", "paka-n").addTag("se");
sounder.addFile("sound/countup1.wav", "countUp1").addTag("se");
sounder.addFile("sound/hua.wav", "hua").addTag("se");
sounder.addFile("sound/pyui.wav", "pyui").addTag("se");
sounder.addFile("sound/hua.wav", "hua").addTag("se");
sounder.addFile("sound/nabi.wav", "nabi").addTag("se");
sounder.addFile("sound/bubu.wav", "bubu").addTag("se");
sounder.addFile("sound/atstart2.wav", "atStart2").addTag("se");
sounder.addFile("sound/down.wav", "down").addTag("se");
sounder.addFile("sound/fanfare1.wav", "fanfare1").addTag("se");
sounder.addFile("sound/bell.wav", "bell").addTag("se");

sounder.addFile("sound/countup2Start.wav", "countUp2Start").addTag("se");
sounder.addFile("sound/countup2Part.wav", "countUp2Part").addTag("se");
sounder.addFile("sound/countup2End.wav", "countUp2End").addTag("se");

sounder.addFile("sound/atstart.wav", "atStart").addTag("se");
sounder.addFile("sound/athit.wav", "atHit").addTag("se");
sounder.addFile("sound/SegStop.mp3", "SegStop").addTag("se");

sounder.addFile("sound/cd7.wav", "CD7").addTag("bgm")
sounder.addFile("sound/at1.wav", "AT1").addTag("bgm")
sounder.addFile("sound/at2.wav", "AT2").addTag("bgm")
sounder.addFile("sound/rt2.mp3", "RT2").addTag("bgm");
sounder.addFile("sound/title.wav", 'title').addTag("se");
sounder.addFile("sound/type.mp3", 'type').addTag("se");
sounder.addFile("sound/yokoku.wav", 'yokoku').addTag("se");
sounder.addFile("sound/kokuti.mp3", 'kokuti').addTag("se");
sounder.addFile("sound/syoto.mp3", "syoto").addTag("se");
sounder.addFile("sound/syotoyokoku.mp3", "syotoyokoku").addTag("se");
sounder.addFile("sound/cherry.mp3", "cherry").addTag("se");
sounder.addFile("sound/bigpay.mp3", "bigpay").addTag("se");
sounder.addFile("sound/spstop.mp3", "spstop").addTag("se");
sounder.addFile("sound/bita.mp3", "bita").addTag("se");
sounder.addFile("sound/roulette.mp3", "roulette").addTag("se");
sounder.addFile("sound/histart.mp3", "histart").addTag("se");
sounder.addFile("sound/hiroulette.mp3", "hiroulette").addTag("bgm");
sounder.addFile("sound/hirouletteend.mp3", "hirouletteend").addTag("bgm");
sounder.addFile("sound/bonuskokuti.mp3", "bonuskokuti").addTag("se");
sounder.addFile("sound/uwanose.mp3", "uwanose").addTag("se");
sounder.addFile("sound/artend.mp3", "artend").addTag("se");
sounder.addFile("sound/nabistop.wav", "nabiStop").addTag("se");
sounder.addFile("sound/cd7start.wav", "CD7Start").addTag("se");

sounder.setVolume('se', 0.5)
sounder.setVolume('bgm', 0.5)
sounder.setVolume('small', 0.3);

sounder.setMasterVolume(0.5)