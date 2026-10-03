/** Regenerate animation caches with the full, adjacent-step DDPM chain. */
import * as tf from '@tensorflow/tfjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { DiffusionModel } from '../../../packages/diffusion/src/diffusion/diffusion';
import { ConditionalDiffusionModel } from '../../../packages/diffusion/src/diffusion/conditional_diffusion';
const staticRoot = new URL('../static/', import.meta.url);
await tf.setBackend('cpu'); await tf.ready();
for (const [stem, conditional] of [['diffusion_smiley_face', false], ['conditional_diffusion_three_modes', true]] as const) {
    const json = JSON.parse(await readFile(new URL(`models/${stem}/model.json`, staticRoot), 'utf8'));
    const bytes = await readFile(new URL(`models/${stem}/model.weights.bin`, staticRoot));
    const model = await tf.loadLayersModel(tf.io.fromMemory({ modelTopology: json.modelTopology, weightSpecs: json.weightsManifest[0].weights, weightData: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) }));
    const generator = conditional ? new ConditionalDiffusionModel(2, 3, 64) : new DiffusionModel(2, 64);
    generator.setModel(model as tf.Sequential);
    const samples = await generator.sample(300, 200);
    const grid = await generator.sample_grid(15, { xMin: -3, xMax: 3, yMin: -3, yMax: 3 }, 200);
    for (const [suffix, tensor] of [['samples', samples], ['grid', grid]] as const) {
        const values = tensor.arraySync() as number[][][];
        if (!values.flat(2).every(Number.isFinite)) throw new Error(`${stem} has nonfinite samples`);
        await writeFile(new URL(`cached_samples/${stem}_${suffix}.json`, staticRoot), JSON.stringify(values));
        console.log(`${stem}_${suffix}: ${values.length} frames, ${values[0].length} points`);
        tensor.dispose();
    }
    model.dispose();
}
