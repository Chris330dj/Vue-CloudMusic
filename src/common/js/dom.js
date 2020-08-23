// 封装增删查class相关方法
export function hasClass(el, className) {
    let reg = new RegExp("\\b" + className + "\\b");
    return reg.test(el.className)
}

export function addClass(el, className) {
    if (!hasClass(el, className)) {
        let newClass = el.className.split(' ');
        newClass.push(className);
        el.className = newClass.join(' ');
    }
}

export function removeClass(el, className) {
    let reg = new RegExp("\\b" + className + "\\b");
    el.className = el.className.replace(reg, "");
}

// 封装获取元素数据相关方法
export function getData(el, name, val) {
    const prefix = 'data-';
    if (val) {
        return el.setAttribute(prefix + name, val);

    }
    return el.getAttribute(prefix + name);
}

// css样式前缀封装
let elementStyle = document.createElement('div').style

let vendor = (() => {
    // 前缀检测
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    }
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key
        }
    }
    return false
})()

export function prefixStyle(style) {
    if (vendor === false) {
        return false
    }
    if (vendor === 'standard') {
        return style
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
