const { makeNotifyMsg } = require("./util");

describe("makeNotifyMsg", () => {
  test("yurekuru, 震度3", () => {
    const username = "yurekuru";
    const text =
      "[EEW] ID：ND20211219064135 SEQ：final 震源地：静岡県中部 緯度：35.0 経度：138.4 震源深さ：10km 発生日時：2021/12/19 06:41:31 マグニチュード：3.4 最大震度：３ #yurekuru";
    expect(makeNotifyMsg(username, text)).toBe("地震です。震度3、静岡県中部");
  });

  test("yurekuru, 震度2", () => {
    const username = "yurekuru";
    const text =
      "[EEW] ID：ND20211217144000 SEQ：1 震源地：福島県沖 緯度：37.7 経度：141.6 震源深さ：80km 発生日時：2021/12/17 14:39:48 マグニチュード：3.5 最大震度：２ #yurekuru";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("yurekuru, 震度不明", () => {
    const username = "yurekuru";
    const text =
      "[EEW] ID：ND20211212122202 SEQ：1 震源地：北海道北西沖 緯度：44.5 経度：141.1 震源深さ：330km 発生日時：2021/12/12 12:21:20 マグニチュード：4.8 最大震度：不明 #yurekuru";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("yurekuru, others", () => {
    const username = "yurekuru";
    const text = "dummy_text";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("earthquake_jp, 震度3", () => {
    const username = "earthquake_jp";
    const text =
      "【気象庁情報】12日　12時31分頃　茨城県南部（N36.1/E139.9）にて　最大震度3（M5）の地震が発生。　震源の深さは50km。( https://j.mp/3lZcOYq ) #saigai #jishin #earthquake";
    expect(makeNotifyMsg(username, text)).toBe("地震です。震度3、茨城県南部");
  });

  test("earthquake_jp, 震度2", () => {
    const username = "earthquake_jp";
    const text =
      "［気象庁情報］12日　18時42分頃　宮城県沖（N38.6/E142.2）にて　最大震度2（M4）の地震が発生。　震源の深さは40km。( https://j.mp/3pS1tdA ) #saigai #jishin #earthquake";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("earthquake_jp, 速報", () => {
    const username = "earthquake_jp";
    const text =
      "［速報LV5］16日　03時01分頃　茨城県沖（N36.7/E141.6）(推定)にて　M3.8（推定）の地震が発生。　震源の深さは推定41km。#saigai #jishin #earthquake";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("earthquake_jp, others", () => {
    const username = "earthquake_jp";
    const text = "dummy_text";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });

  test("other username", () => {
    const username = "dummy_user";
    const text = "dummy_text";
    expect(makeNotifyMsg(username, text)).toBe(null);
  });
});
