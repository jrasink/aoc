const input = require('fs').readFileSync('./actual-input').toString();
// const input = require('fs').readFileSync('./example-input').toString();

const parseVectorString = (s) => {
  const [x, y, z] = s.split(', ').map((s) => parseInt(s, 10));
  return { x, y, z };
}

const parseLine = (s) => {
  const [ps, vs] = s.split(' @ ');
  const p = parseVectorString(ps);
  const v = parseVectorString(vs);
  return { p, v };
};

const parseInput = (s) => s.split('\n').map(parseLine);

const dump = ({ x, y, z }) => `(${x}, ${y}, ${z})`;
const dumps = ({ p, v }) => `[p ${dump(p)} v ${dump(v)}]`;

const mul = (v, s) => ({
  x: v.x * s,
  y: v.y * s,
  z: v.z * s
});

const div = (v, s) => ({
  x: v.x / s,
  y: v.y / s,
  z: v.z / s
});

const add = (v, w) => ({
  x: v.x + w.x,
  y: v.y + w.y,
  z: v.z + w.z
});

const sub = (a, b) => add(a, mul(b, -1));

const dot = (v, w) => v.x * w.x + v.y * w.y + v.z * w.z;

const cross = (v, w) => ({
  x: (v.y * w.z) - (v.z * w.y),
  y: (v.z * w.x) - (v.x * w.z),
  z: (v.x * w.y) - (v.y * w.x)
});

const stones = parseInput(input);

const reference = stones.shift();
const rebase = ({ p, v }) => ({ p: sub(p, reference.p), v: sub(v, reference.v) });

const solve = (s1, s2) => {
  // console.log('reference:', dumps(reference));

  // console.log('stone 1:', dumps(s1));
  // console.log('stone 2:', dumps(s2));

  // ow very nice
  // https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kxqjg33/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button

  // Stones 1 and 2, relative to stone 0:
  // p1 = position_1 - position_0
  // v1 = velocity_1 - velocity_0
  // p2 = position_2 - position_0
  // v2 = velocity_2 - velocity_0

  const { p: p1, v: v1 } = rebase(s1);
  const { p: p2, v: v2 } = rebase(s2);

  // console.log('stone 1 prime:', dumps({ p: p1, v: v1 }));
  // console.log('stone 2 prime:', dumps({ p: p2, v: v2 }));

  // t1 = -((p1 x p2) * v2) / ((v1 x p2) * v2)
  // t2 = -((p1 x p2) * v1) / ((p1 x v2) * v1)

  const t1 = -1 * dot(cross(p1, p2), v2) / dot(cross(v1, p2), v2);
  const t2 = -1 * dot(cross(p1, p2), v1) / dot(cross(p1, v2), v1);

  // console.log('t1', t1, 't2', t2);

  // c1 = position_1 + t1 * velocity_1
  // c2 = position_2 + t2 * velocity_2

  const c1 = add(s1.p, mul(s1.v, t1));
  const c2 = add(s2.p, mul(s2.v, t2));

  // v = (c2 - c1) / (t2 - t1)

  const v = div(sub(c2, c1), (t2 - t1));

  // p = c1 - t1 * v

  const p = sub(c1, mul(v, t1));

  // console.log('v', dump(v));
  // console.log('p', dump(p));

  return { v, p };
};

const wrap = ({ p }) => p.x + p.y + p.z;

console.log(wrap(solve(stones[0], stones[1])));

// 885093461440405

// console.log(wrap(solve(stones[1], stones[2])));

// 885093461440405

// console.log(wrap(solve(stones[2], stones[3])));

// 885093461440405
