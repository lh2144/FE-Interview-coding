// deep-clone
function deepClone(data) {
    if (typeof data === 'object') {
        const result = Array.isArray(data) ? [] : {};
        for (let key in data) {
            if (typeof data[key] === 'object') {
                result[key] = deepClone(data[key]);
            } else {
                result[key] = data[key];
            }
        }
        return result;
    } else {
        return data;
    }
}

//function bind call apply
Function.prototype.call2 = function (that = window, ...arg) {
    that.fn = this;
    const args = arg.slice(1);
    const result = that.fn(...args);
    delete that.fn;
    return result;
}

Function.prototype.apply2 = function (that = window, arg) {
    that.fn = this;
    const result = arg ? that.fn(...arg) : that.fn();
    delete that.fn;
    return result;
}

Function.prototype.mybind = function (...arg) {
    const callerFunction = this;
    const [context, ...args] = arg;
    return function () {
        return callerFunction.apply(context, args);
    }
}

//curryi
function carrying(fn) {
    return function carried(...args) {
        if (args.length === fn.length) {
            return fn.apply(this, args);
        } else {
            return function (...arg2) {
                return carried.apply(this, [...args, ...arg2]);
            }
        }
    };
}

//flat out
const flat = function(arr) {
    const flattend = [];

    while (arr.length) {
        const v = arr.shift();
        if (Array.isArray(v)) {
            arr = v.concat(arr);
        } else {
            flattend.push(v);
        }
    }
    return flattend;
}

const flat2 = function(arr) {
    const res = [];
    arr.forEach((i) => {
        if (Array.isArray(i)) {
            res.push(...flat2(i));
        } else {
            res.push(i);
        }
    });
    return res;
}

const flat2 = function(arr) {
    while (arr.some((i) => Array.isArray(i))) {
        arr = [].concat(...arr);
    }
    return arr;
}

//Promise all
Promise.all = function(...arr) {
    const result = [];
    let isFail = false;
    let error;
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (isFail) {
            return Promise.reject(errorInfo);
        }
        arr[i].then(res => {
            result.push(res);
            count++;
            if (count === arr.length) {
                return Promise.resolve(result);
            } 
        }, (e => {
            isFail = true;
            error = e;
        }))
    }

}

//compose    
const compose = function(...args) {
    let len = args.length;
    let count = len - 1;
    let result;

    return function f1(...argsInner) {
        result = args[count].apply(this, argsInner);
        if (count <= 0) {
            return result;
        } else {
            count--;
            f1.call(null, result);
        }
    }
}
// implement debounce
function debounce(fn, delay) {
    let timer = null;
    
    return function(...args) {
        let context = this;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}
//implement throttle
function throttle(func, delay) {
    let timer = null;

    return function(...args) {
        let context = this;
        if (!timer) {
            timer = setTimeout(function() {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}
// const format = (value: string | number ) => {
//     if (typeof value === 'string') {
//         return value.substring(-2);
//     } else if (typeof value === 'number') {
//         return value.toLocaleString();
//     } else {
//         console.log(value);
//         return
//     }
// }
// format(5);

//finding missing number
function getMissing(a) {
    let n = a.length;
    let i, total = 1;

    for (i  = 2; i <= n+1; i++) {
        total += i;
        total -= a[i];
    }
    return total;
}

//compress string
function compress(a) {
    let res = '';
    let count = 1;
    for (let i = 0; i < a.length - 1;i++) {
        if (a[i] === a[i+1]) {
            count++;
            continue;
        } else {
            res += a[i] + count;
            count = 1;
        }
    }
    // if (count > 0) {
    //     res += a[a.length - 1] + count;
    // } else {
    //     res += a[a.length - 1] + 1;
    // }
    res += a[a.length-1]+count;
    return res;
}

//reverse string preserving space

function revesrString(s) {
    const res = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] === ' ') {
            res[i] = s[i];
        }
    }

    let j = s.length - 1;
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== ' ') {
            if (res[j] === ' ')
                j--;
            res[j] = s[i];
            j--;
        }
    }
    return res;
}

// ali excel
const data = {
    AB00: "(AA00 + AA01) * 15",
    AA01: "20 + AA02",
    AA02: "AB00 * 15",
    AA00: "10",
  };
  
function spellCheck(keys = []) {
    const targetKey = keys[keys.length - 1];
    const targetValue = data[targetKey];

    const matches = targetValue.match(/[A-Z]{2}[0-9]{2}/g);
    if (matches) {
        for (let keyInTargetValue of matches) {
            if (keys.includes(keyInTargetValue)) {
                return true;
            }
            keys.push(keyInTargetValue);
            const isCircular = spellCheck(keys);
            if (isCircular) return true;
        }
    }
}

function getSpellCheckoutput(data) {
    for (let key in data) {
        const isCircular = spellCheck([key]);
        if (isCircular) return true;
    }
}

//filter implementation
Array.prototype.filters = function(func) {
    const arr = this;
    const filterArr = [];
    for (let i = 0, len = arr.length; i < len;i++) {
        if (func(i, arr[i])) {
            filterArr.push(arr[i]);
        }
    }
    return filterArr;
}

// async await
function asyncToGenerator(generator) {
    return function() {
        const gen = generator.apply(this, arguments);
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let generatorResult;
                try {
                    generatorResult = gen[key](arg);
                } catch (error) {
                    return reject(error);
                }
                const {value, done} = generatorResult;
                if (done) {
                    return resolve(value);
                } else {
                    return Promise.resolve(value).then((val) => step('next', val), err => step('throw', err));
                }
            }
        })
    }
}

//发布订阅 模型
class EventEmitter {
    constructor() {
        this._eventPool = {};
    }

    on(event, callback) {
        this._eventPool[event] ? this._eventPool[event].push(callback) : this._eventPool[event] = [callback];
    }

    emit(event, ...args) {
        this._eventPool[event] && this._eventPool[event].forEach(cb => cb(...args));
    }

    remove(event) {
        if (this._eventPool[event]) {
            delete this._eventPool[event];
        }
    }

    once(event, callback) {
        this.on(event, (...args) => {
            callback(...args);
            this.remove(event);
        })
    }
}

//use reduce implement map

Array.prototype.map = function (callback) {
    const arr = this;
    return arr.reduce((acc,cur, i) => {
        acc.push(callback(cur, i, arr));
        return acc;
    }, []);
}

//后序遍历
function TreeNode (val) {
    this.val = val;
    this.left = null;
    this.right = null;
}
 
function vist(root) {
    if (root) {
        vist(root.left);
        vist(root.right);
        console.log(root.val);
    }
}