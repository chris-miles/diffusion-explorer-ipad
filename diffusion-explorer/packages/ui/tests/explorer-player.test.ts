import assert from 'node:assert/strict';
import { Timeline, Player } from '../src/animation/explorer-player';

let nextId = 0;
const frames = new Map<number, FrameRequestCallback>();
globalThis.requestAnimationFrame = (callback) => {
  frames.set(++nextId, callback);
  return nextId;
};
globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };
function frame(ms: number) {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(ms));
}
function makePlayer(looping = true) {
  return new Player(Timeline.from({
    duration: 2,
    initialState: { time: 0 },
    clips: [{ start: 0, end: 1, clip: {
      name: 'Forward', reduce: (t) => ({ time: t }),
    } }],
  }), { looping });
}

const player = makePlayer();
let observed = -1;
const unsubscribe = player.onTick((t, state) => {
  assert.equal(state.time, t);
  observed = t;
});
player.seek(0.4);
assert.equal(observed, 0.4);
assert.equal(player.state.time, 0.4);
player.seek(2);
assert.equal(player.t, 1);
player.seek(-1);
assert.equal(player.t, 0);
player.play();
assert.equal(player.isPlaying, true);
frame(0);
frame(1000);
assert.equal(player.t, 0.5);
player.pause();
assert.equal(player.isPlaying, false);
assert.equal(frames.size, 0);
player.seek(0.75);
player.play();
frame(2000);
frame(3000);
assert.equal(player.t, 0);
unsubscribe();
player.dispose();
assert.equal(frames.size, 0);

const once = makePlayer(false);
once.play();
frame(4000);
frame(7000);
assert.equal(once.t, 1);
assert.equal(once.isPlaying, false);
assert.equal(frames.size, 0, 'finished playback must not schedule another frame');
once.dispose();
console.log('Explorer player seek, pause, resume, looping, and disposal passed.');
