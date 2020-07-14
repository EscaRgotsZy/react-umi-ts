
/**
 * 格式化金额为千位分隔，不支持四舍五入
 * @param num 金额
 * @param point 小数点后几位，默认0
 */
export function formatMoney(num: number, point: number = 0) {
  let str = num * 1 ? (num * 1).toFixed(point) : (0).toFixed(point)
  let re = `\\d(?=(\\d{3})+${point > 0 ? '\\.' : '$'})`
  return str.replace(new RegExp(re, 'g'), $0 => $0 + ',')
}

/**
 * 数字转中文
 * @param num 
 */
export function SectionToChinese(num: number | string) {
  if (!/^\d*(\.\d*)?$/.test(String(num))) {
    alert("Number is wrong!");
    return "Number is wrong!";
  }
  var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
  var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
  var a:any = ("" + num).replace(/(^0*)/g, "").split("."),
    k = 0,
    re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
          re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }
  if (a.length > 1) //加上小数部分(如果有小数部分) 
  {
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  return re;
}