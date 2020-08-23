// 洗牌算法
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(list) {
    // 不要直接对list做修改
    let _list = list.slice();
    for (let i = 0; i < _list.length; i++) {
        let j = getRandomInt(0, i);
        [_list[i], _list[j]] = [_list[j], _list[i]]
    }
    return _list
}

// 按id拼接两个list
export function mergeList(arr1, arr2) {
    const dummy1 = arr1.slice()
    const dummy2 = arr2.slice()
    const mergedArray = dummy2.reduce((merge, cur) => {
        const target = merge.find(e => e.id === cur.id);
        if (target) {
            Object.assign(target, cur);
        } else {
            merge.push(cur);
        }
        return merge;
    }, dummy1);
    return mergedArray
}


// 函数节流
export function debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}