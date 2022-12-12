
const _ = `Monkey 0:
Starting items: 54, 82, 90, 88, 86, 54
Operation: new = old * 7
Test: divisible by 11
  If true: throw to monkey 2
  If false: throw to monkey 6

Monkey 1:
Starting items: 91, 65
Operation: new = old * 13
Test: divisible by 5
  If true: throw to monkey 7
  If false: throw to monkey 4

Monkey 2:
Starting items: 62, 54, 57, 92, 83, 63, 63
Operation: new = old + 1
Test: divisible by 7
  If true: throw to monkey 1
  If false: throw to monkey 7

Monkey 3:
Starting items: 67, 72, 68
Operation: new = old * old
Test: divisible by 2
  If true: throw to monkey 0
  If false: throw to monkey 6

Monkey 4:
Starting items: 68, 89, 90, 86, 84, 57, 72, 84
Operation: new = old + 7
Test: divisible by 17
  If true: throw to monkey 3
  If false: throw to monkey 5

Monkey 5:
Starting items: 79, 83, 64, 58
Operation: new = old + 6
Test: divisible by 13
  If true: throw to monkey 3
  If false: throw to monkey 0

Monkey 6:
Starting items: 96, 72, 89, 70, 88
Operation: new = old + 4
Test: divisible by 3
  If true: throw to monkey 1
  If false: throw to monkey 2

Monkey 7:
Starting items: 79
Operation: new = old + 8
Test: divisible by 19
  If true: throw to monkey 4
  If false: throw to monkey 5`.split('\n');

var round = 0;
var current = 0;
var worry = 0;

class Monkey {
    constructor(id, items, op, test, tm, fm) {
        this.id = id;
        this.items = items;
        this.op = op;
        this.test = test;
        this.tm = tm;
        this.fm = fm;
        this.inspectionCount = 0;
    }

    operation(index) {            
        this.items[index] = eval(this.items[index] + this.op.op + (this.op.v == "old" ? this.items[index] : this.op.v));
        return this.items[index];
    }

    testWorry(index) {       
        return this.items[index] % this.test == 0;
    }

    throw(itemIndex, targetId) {        
        var item = this.items.splice(itemIndex, 1)[0];   
        monkeys[targetId].items.push(item);
    }

    dropWorry(value) {  

    }  
}
const monkeys = [];

var i = 0;
do {
    m = _[i];
    if (m.startsWith('Monkey')) {
        const id = m.substring(7, 8);
        const items = new RegExp(/.+?: ([\d, ]+)/).exec(_[++i])[1].split(', ').map(x => parseInt(x));
        const _op = new RegExp(/.+?= old (.+)/).exec(_[++i])[1].split(' ');
        const op = _op[0];
        const v = _op[1];
        const mod = parseInt(new RegExp(/.+?by (\d+)/).exec(_[++i])[1]);
        const _true = parseInt(new RegExp(/.+?monkey (\d)/).exec(_[++i])[1]);
        const _false = parseInt(new RegExp(/.+?monkey (\d)/).exec(_[++i])[1]);
        monkeys[id] = new Monkey(id, items, { op: op, v: v }, mod, _true, _false);
    }
} while(++i < _.length);

function play() {
    for (var ii = 0; ii < monkeys.length; ii++) {
        var m = monkeys[ii];
        worry = 0;
        /*if (m.items.length > 0)
          */  //m.inspectionCount++;  
        while (m.items.length > 0) {  
            m.inspectionCount++;    
            m.items[0] = dropWorry(m.operation(0));
            m.throw(0, m.testWorry(0) ? m.tm : m.fm);
        }
    };

    round++;
}



    BigInt.prototype.mod = function (v) { return ~~(this % v); }
Number.prototype.mod = function (v) { return ~~(this % v); }

function ForceBigInt(fn) {
    return function (...args) {
        for (var i = 0; i < args.length; i++)
            if (typeof (args[i]) === 'number')
                args[i] = BigInt(~~args[i]);
        return fn.apply(this, args);
    }
}

// co-primes
cp = ForceBigInt(
    (n) => {
        var cp = [];
        for (var k = 1; k < n; k++)
            if (gcd(n, k) == 1n) cp.push(k);
        return cp;
    }
);

// extended euclidian
xe = ForceBigInt(
    (a, b) => {
        var r = [a, b];
        var x = [1n, 0n];
        var y = [0n, 1n];

        var q = [];

        var i = 0n;
        while (r[++i] != 0n) {
            q[i] = ~~(r[i - 1n] / r[i]);
            r[i + 1n] = ~~(r[i - 1n] - (q[i] * r[i]));
            x[i + 1n] = ~~(x[i - 1n] - (q[i] * x[i]));
            y[i + 1n] = ~~(y[i - 1n] - (q[i] * y[i]));
        }

        return {
            x: x[i - 1n],
            y: y[i - 1n],
            gcd: r[i - 1n],
            __i: i
        }
    }
);

// lowest common multiple
lcm = ForceBigInt(
    (a, b) => {
        return a * b / gcd(a, b);
        //slow
        var v = a < b ? b : a;
        while (a != 0n && b != 0n) {
            if (0n == v.mod(a) && 0n == v.mod(b))
                break;
            v++;
        }
        return v;
    }
);

// prime factors
pf = ForceBigInt(
    (n) => {
        var pf = [];
        let d = 2n;
        while (n >= 2n) {
            if (n % d == 0n) {
                pf.push(d);
                n = ~~(n / d);
            } else {
                d++;
            }
        }
        return pf;
    }
);

// modpow
mp = ForceBigInt(
    (x, y, p) => {
        let r = 1n;
        x = x % p;
        while (y > 0n) {
            if (y & 1n)
                r = (r*x) % p;
    
            y = y >> 1n;
            x = (x * x) % p;
        }
        return r;
    }
);

// millier aprox. test
mt = ForceBigInt(
    (d, n) => {
        const r = BigInt(Math.floor(Math.random() * 100000))
        const y = r * (n - 2n) / 100000n
        let a = 2n + y % (n - 4n);
        let x = mp(a, d, n);
    
        if (x == 1n || x == n-1n)
            return true;
    
        while (d != n - 1n) {
            x = (x * x) % n;
            d *= 2n;
            if (x == 1n)	
                return false;
            if (x == n-1n)
                return true;
        }
    
        return false;
    }
);

// test prime with k being precision
tp = ForceBigInt(
    (n, k = 64) => {
        if (n <= 1n || n == 4n) return false;
        if (n <= 3n) return true;
    
        let d = n - 1n;
        while (d % 2n == 0n)
            d /= 2n;
    
        for (let i = 0; i < k; i++)
            if (!mt(d, n))
                return false;
    
        return true;
    }
);

var x = monkeys.map(_ => _.inspectionCount).sort((a, b) => b - a);
    console.log(x[0] * x[1]);

var mod = 1;
monkeys.map(_ => _.test).forEach(_ => mod *= _);
function dropWorry(value) {    
    return value%mod;
}
    