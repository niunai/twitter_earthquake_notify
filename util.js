toHalfWidth = (value) => {
  if (!value) return value;
  return String(value).replace(/[！-～]/g, function (all) {
    return String.fromCharCode(all.charCodeAt(0) - 0xfee0);
  });
};

exports.makeNotifyMsg = (username, text) => {
  const MIN_SHINDO = 3;

  let shingenchi = "";
  let shindoText = "";
  let shindo = 0;

  switch (username) {
    case "yurekuru":
      out_text = text.split(/\x20/); // hankaku space
      shingenchi = out_text[3]?.split("：")[1] ?? "";
      shindoText = out_text[10]?.split("：")[1] ?? "";
      ret = toHalfWidth(shindoText).match(/(?<shindo>\d+)/);
      if (ret != null) {
        shindo = ret.groups.shindo;
      }
      break;

    case "earthquake_jp":
      out_text = text.split(/\u3000/); // zenkaku space
      if (out_text[0].match(/速報/)) {
        return null;
      }
      shingenchi = out_text[2]?.split("（")[0] ?? "";
      shindoText = out_text[3]?.split("（")[0] ?? "";
      ret = shindoText.match(/(?<shindo>\d+)/);
      if (ret != null) {
        shindo = ret.groups.shindo;
      }
      break;

    default:
      return null;
  }

  if (MIN_SHINDO <= shindo) {
    return `地震です。震度${shindo}、${shingenchi}`;
  } else {
    return null;
  }
};
