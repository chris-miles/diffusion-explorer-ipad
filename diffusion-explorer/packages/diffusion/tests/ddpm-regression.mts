import assert from 'node:assert/strict';
import * as tf from '@tensorflow/tfjs';
import { DiffusionModel } from '../src/diffusion/diffusion';
import { ConditionalDiffusionModel } from '../src/diffusion/conditional_diffusion';
await tf.setBackend('cpu');
for (const conditional of [false, true]) {
 const model = conditional ? new ConditionalDiffusionModel(2,3,4,10) : new DiffusionModel(2,4,10);
 const observed: number[]=[];
 // Oracle noise predictor for a clean distribution concentrated at x0=1.25.
 (model as any).forward=(x:tf.Tensor2D,t:tf.Tensor1D)=>tf.tidy(()=> {
  observed.push(t.dataSync()[0]);
  const cumulative=conditional ? (model as any).alphasCumprod : (model as any).scheduleParams.alphasCumprod;
  const a=tf.gather(cumulative,t).expandDims(1);
  return x.sub(tf.sqrt(a).mul(1.25)).div(tf.sqrt(tf.sub(1,a)));
 });
 const initial=tf.zeros([2,2]) as tf.Tensor2D;
 let callbacks=0;
 const baseline=tf.memory().numTensors;
 const result=await model.sample_from_initial_points(initial,2,{},()=>callbacks++);
 assert.deepEqual(observed,[9,8,7,6,5,4,3,2,1,0]);
 const last=result!.gather(result!.shape[0]-1);
 assert.ok([...last.dataSync()].every(v=>Math.abs(v-1.25)<1e-3));
 assert.equal(callbacks,2);
 last.dispose(); result!.dispose();
 assert.equal(tf.memory().numTensors,baseline,'sampling frees intermediates');
 let stopped=false;
 const cancelled=await model.sample_from_initial_points(initial,2,{},()=>{stopped=true;},()=>stopped);
 assert.equal(cancelled,null);
 assert.equal(tf.memory().numTensors,baseline,'cancellation frees partial trajectory');
 initial.dispose();
 console.log(`${conditional?'Conditional diffusion':'Diffusion'}: full schedule, clean endpoint, streaming and cancellation passed`);
}
