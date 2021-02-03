export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};

/**
 * 将字符串时间转化为长度
 * @param datetimeStr
 * @param zoom 放大倍数
 * @returns {number}
 */
export function datetime2height(datetimeStr, zoom) {
  let length = 0
  if (!datetimeStr) {
    return 0
  }
  datetimeStr = datetimeStr.replaceAll('年', '-')
  datetimeStr = datetimeStr.replaceAll('月', '-')
  datetimeStr = datetimeStr.replaceAll('日', '')
  // 公元前
  if (datetimeStr.startsWith('-')) {
    datetimeStr = datetimeStr.substring(1)
    let now = new Date()
    length = now.getFullYear() + now.getMonth() / 12 + now.getDay() / 360 + parseInt(datetimeStr)
  }
  // 公元后
  else {
    if (datetimeStr.length <= 4 && parseInt(datetimeStr) < 1970) {
      length = new Date().getFullYear() - parseInt(datetimeStr)
    } else {
      let date = new Date(datetimeStr)
      length = new Date().getFullYear() - (date.getFullYear() + date.getMonth() / 12 + date.getDay() / 360)
    }
  }
  return length * zoom + 100
}

export function formHistoryData(datas, zoom) {
  let data = []
  datas.forEach((obj) => {
    let item = deepClone(obj);
    // 单个时间
    if (obj['curTime']) {
      item['curLength'] = datetime2height(obj['curTime'], zoom)
    }
    // 时间范围
    if (obj['startTime'] && obj['endTime']) {
      item['startLength'] = datetime2height(obj['startTime'], zoom)
      item['endLength'] = datetime2height(obj['endTime'], zoom)

      item['curLength'] = item['endLength'] + (item['startLength'] - item['endLength']) / 2
    }
    if (!item.appendHeight) {
      item.appendHeight = 0
    }
    data.push(item)
  })
  return data;
}

export function getConfigVisiableValue() {
  let value = null;
  if (window.localStorage.getItem('configVisiable')) {
    value = parseInt(window.localStorage.getItem('configVisiable'))
  } else {
    value = 0
  }
  return value;
}

export function getZoomValue() {
  let zoom = 0;
  if (window.localStorage.getItem('zoom')) {
    zoom = parseInt(window.localStorage.getItem('zoom'))
  } else {
    zoom = 2
  }
  return zoom
}

export function getBooleanValue(key) {
  if (window.localStorage.getItem(key) == 'true') {
    return true
  } else {
    return false
  }
}
