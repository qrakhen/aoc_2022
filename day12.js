const map = `abaaaaaccccccccccccccccccaaaaaaaaaaaaaccccaaaaaaaccccccccccccccccccccccccccccaaaaaa
abaaaaaaccaaaacccccccccccaaaaaaaaacaaaacaaaaaaaaaacccccccccccccccccccccccccccaaaaaa
abaaaaaacaaaaaccccccccccaaaaaaaaaaaaaaacaaaaaaaaaacccccccccccccaacccccccccccccaaaaa
abaaaaaacaaaaaacccccccccaaaaaaaaaaaaaaccaaacaaaccccccccccccccccaacccccccccccccccaaa
abccaaaccaaaaaacccaaaaccaaaaaaaaaaaaaccccaacaaacccccccccaacaccccacccccccccccccccaaa
abcccccccaaaaaccccaaaacccccaaaaacccaaaccaaaaaaccccccccccaaaaccccccccccccccccccccaac
abcccccccccaaaccccaaaacccccaaaaacccccccccaaaaaccccccccccklllllccccccccccccccccccccc
abcccccccccccccccccaaccccccccaaccccccccaaaaaaaccccccccckklllllllcccccddccccaacccccc
abaccccccccccccccccccccccccccaaccccccccaaaaaaaaccccccckkkklslllllcccddddddaaacccccc
abacccccccccccccccccccccccccccccccaaaccaaaaaaaaccccccckkkssssslllllcddddddddacccccc
abaccccccccccccccccccccccccccccccccaaaaccaaacaccccccckkksssssssslllmmmmmdddddaacccc
abcccccccccccccccaaacccccccccccccaaaaaaccaacccccccccckkkssssusssslmmmmmmmdddddacccc
abcccccccaaccccaaaaacccccccccccccaaaaaccccccaaaaaccckkkrssuuuussssqmmmmmmmmdddccccc
abcccccccaaccccaaaaaacccccccaaccccaaaaacccccaaaaacckkkkrruuuuuussqqqqqqmmmmdddccccc
abccccaaaaaaaacaaaaaacccccccaaaaccaaccaccccaaaaaacjkkkrrruuuxuuusqqqqqqqmmmmeeccccc
abcaaaaaaaaaaacaaaaaccccccaaaaaacccccaaccccaaaaajjjjrrrrruuuxxuvvvvvvvqqqmmmeeccccc
abcaacccaaaaccccaaaaaaacccaaaaacccacaaaccccaaaajjjjrrrrruuuxxxxvvvvvvvqqqmmeeeccccc
abaaaaccaaaaacccccccaaaccccaaaaacaaaaaaaacccaajjjjrrrrtuuuuxxxyvyyyvvvqqqnneeeccccc
abaaaaaaaaaaacccaaaaaaaccccaacaacaaaaaaaacccccjjjrrrttttuxxxxxyyyyyvvvqqnnneeeccccc
abaaaaaaaccaacccaaaaaaaaacccccccccaaaaaaccccccjjjrrrtttxxxxxxxyyyyyvvvqqnnneeeccccc
SbaaaaaacccccccccaaaaaaaaaccccccccaaaaacccccccjjjrrrtttxxxEzzzzyyyvvrrrnnneeecccccc
abaaaaacccccccccccaaaaaaacccccccccaaaaaaccccccjjjqqqtttxxxxxyyyyyvvvrrrnnneeecccccc
abaaacccccccccccaaaaaaaccaaccccccccccaaccaaaaajjjqqqttttxxxxyyyyyyvvrrrnnneeecccccc
abaaacccccccccccaaaaaaaccaaacaaacccccccccaaaaajjjjqqqtttttxxyywyyyywvrrnnnfeecccccc
abcaaacccccccaaaaaaaaaaacaaaaaaaccccccccaaaaaaciiiiqqqqtttxwyywwyywwwrrrnnfffcccccc
abcccccccccccaaaaaaaaaaccaaaaaacccccccccaaaaaacciiiiqqqqttwwywwwwwwwwrrrnnfffcccccc
abccccccccccccaaaaaacccaaaaaaaacccccccccaaaaaaccciiiiqqqttwwwwwswwwwrrrrnnfffcccccc
abccccccccccccaaaaaacccaaaaaaaaacccccccccaaacccccciiiqqqtswwwwssssrrrrrroofffcccccc
abccccccaaaaacaaaaaacccaaaaaaaaaaccccccccccccccccciiiqqqssswsssssssrrrrooofffaccccc
abccccccaaaaacaaccaaccccccaaacaaacccccccccccccccccciiiqqssssssspoorrrooooofffaacccc
abcccccaaaaaacccccccccccccaaacccccccccccccccccccccciiiqppssssspppooooooooffffaacccc
abcccccaaaaaacccccccccccccaacccccccccccccccccccccccciipppppppppppoooooooffffaaccccc
abcccccaaaaaaccccccccccccccccccccccccccccccccccccccciihppppppppgggggggggfffaaaccccc
abccccccaaacccccccccccccccccccccccaccccccccccccccccchhhhpppppphggggggggggfaaaaccccc
abaaaccccccccccccccccccccccaccccaaacccccccccccccccccchhhhhhhhhhgggggggggcaacccccccc
abaaccaaaccaccccccccccccccaaacccaaacaacccaaaaacccccccchhhhhhhhhgaaccccccccccccccccc
abaaacaaacaacccccccccaaaccaaaacaaaaaaaaccaaaaaccccccccchhhhhhaaaaacccccccccccccccca
abaaaccaaaaaccccccccccaaacaaaaaaaacaaaaccaaaaaaccccccccccaaacccaaaacccccccccccaccca
abcccaaaaaaccccccccccaaaaaaaaaaaaacaaaaccaaaaaaccccccccccaaaccccaaaccccccccccaaaaaa
abcccaaaaaaaacccccccaaaaaaaaaaaaaaaaaccccaaaaaacccccccccccccccccccccccccccccccaaaaa
abcccaacaaaaaccccccaaaaaaaaaaaaaaaaaaacccccaacccccccccccccccccccccccccccccccccaaaaa`.split('\n');

String.prototype.height = function() {
    return this.charCodeAt(0) - 97;
};

const grid = [];
const visited = [];

const dirs = [
    [ -1,  0 ],
    [  1,  0 ],
    [  0, -1 ],
    [  0,  1 ]    
];

var start = [];
var end = [];

map.forEach((s, y) => {
    grid[y] = [];
    visited[y] = [];
    s.split('').forEach((c, x) => {
        visited[y][x] = 0;
        grid[y][x] = c.height();
        if (c === 'S') {
            // i was too lazy to code a new loop, so i did starts manually for #2
            start = [y, x]
        } else if (c === 'E') {
            end = [y, x];
        }
    });
});

const paths = [];

function Seeker(x, y, p, c, path) {
    visited[y][x]++;
    this.active = true;
    this.x = x;
    this.y = y;
    this.p = p;
    this.c = c;    
    this.path = path;
    this.path.push([y, x]);
    this.expand = function() {
        var seekers = [];
        dirs.forEach(_ => {          
            var _y = this.y + _[0];
            var _x = this.x + _[1];
            if (end[0] == _y && end[1] == _x) {
                paths.push(this);
                console.log("new path found");
                return;
            }
            if (_y < 0 || _x < 0) return;
            if (_y >= map.length || _x >= map[0].length) return;
            if (visited[_y][_x] > 0) return;

            var n = grid[_y][_x];
            if (this.c > 0 && n - grid[this.y][this.x] > 1) return;           
            seekers.push(new Seeker(_x, _y, this, this.c+1, this.path));
        });
        this.active = false;
        return seekers;
    }
}

var head = new Seeker(start[1], start[0], null, 0, []);
var active = [head];
do {
    var x = false;
    active.filter(_ => _.active).forEach(a =>  {
        x = true;
        active = active.concat(a.expand());
    });
} while(x == true);

var xx = paths.map(_ => _.c);
xx = xx.sort((a, b) => b - a);

console.log(xx);

