

const _ = `addx 1
noop
addx 5
addx -1
addx 5
addx 1
noop
noop
addx 2
addx 5
addx 2
addx 1
noop
addx -21
addx 26
addx -6
addx 8
noop
noop
addx 7
noop
noop
noop
addx -37
addx 13
addx -6
addx -2
addx 5
addx 25
addx 2
addx -24
addx 2
addx 5
addx 5
noop
noop
addx -2
addx 2
addx 5
addx 2
addx 7
addx -2
noop
addx -8
addx 9
addx -36
noop
noop
addx 5
addx 6
noop
addx 25
addx -24
addx 3
addx -2
noop
addx 3
addx 6
noop
addx 9
addx -8
addx 5
addx 2
addx -7
noop
addx 12
addx -10
addx 11
addx -38
addx 22
addx -15
addx -3
noop
addx 32
addx -25
addx -7
addx 11
addx 5
addx 10
addx -9
addx 17
addx -12
addx 2
noop
addx 2
addx -15
addx 22
noop
noop
noop
addx -35
addx 7
addx 21
addx -25
noop
addx 3
addx 2
noop
addx 7
noop
addx 3
noop
addx 2
addx 9
addx -4
addx -2
addx 5
addx 2
addx -2
noop
addx 7
addx 2
addx -39
addx 2
noop
addx 1
noop
addx 5
addx 24
addx -20
addx 1
addx 5
noop
noop
addx 4
noop
addx 1
noop
addx 4
addx 3
noop
addx 2
noop
noop
addx 1
addx 2
noop
addx 3
noop
noop`.split('\n');

var cycle = 1;
var x = 1;
var y = 0;
var buffer = 0;

const targets = [];
for (var i = 20; i <= 220; i += 40)
    targets.push(i);

const values = [];

const crt = [];

const doCycle = () => {
    console.log(cycle - (y * 40), x);
    if (cycle - (y * 40) >= x - 2 && cycle - (y * 40) <= x + 0) {
        crt.push('#');
    } else {
        crt.push('.');
    }
    if (targets.includes(cycle)) {
        values.push({ x: x, c: cycle, v: x * cycle });
    }
    if (cycle % 40 == 0) y++;
    cycle++;
}; 

_.forEach(_ => {
    if (_.includes('noop')) {
        doCycle();
    } else {
        var n = parseInt(_.substring(5));
        doCycle();
        doCycle();
        x += n;
    }
});

console.log(values);

var sum  =0;
values.map(_ => _.v).forEach(_ => sum += _); console.log(sum);
var str = "";
crt.forEach((_, i) => { 
    if (_ == '') return;
    str += _;
    if (i % 40 == 0) str += '\n';

});
console.log(str);
