// The public upstream timeline from bbab3e4's parent combines a timeline and
// clock. Adapt it to the explorer's Timeline + Player API.
import { Timeline as LegacyTimeline, type Clip } from './explorer-timeline';
export type { Clip } from './explorer-timeline';

export class Timeline<TState> {
  private constructor(readonly spec: {
    duration: number;
    initialState: TState;
    clips: { clip: Clip<TState>; start: number; end: number }[];
  }) {}
  static from<TState>(spec: Timeline<TState>['spec']): Timeline<TState> {
    return new Timeline(spec);
  }
}

export class Player<TState> {
  private readonly clock = new LegacyTimeline<TState>();
  constructor(timeline: Timeline<TState>, options: { looping?: boolean } = {}) {
    this.clock.duration = timeline.spec.duration;
    this.clock.initialState = timeline.spec.initialState;
    this.clock.looping = options.looping ?? false;
    for (const { clip, start, end } of timeline.spec.clips) {
      this.clock.add(clip, { start, end });
    }
  }
  get t() { return this.clock.time / this.clock.duration; }
  get state() { return this.clock.state; }
  get isPlaying() { return this.clock.isPlaying; }
  play() { this.clock.play(); }
  pause() { this.clock.pause(); }
  seek(t: number) { this.clock.seek(t); }
  dispose() { this.clock.dispose(); }
  onTick(callback: (t: number, state: Readonly<TState>) => void) {
    return this.clock.onTick(callback);
  }
}
