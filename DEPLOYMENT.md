# iPad deployment

This fork builds the Diffusion Explorer application from
[Alec Helbling's upstream project](https://github.com/helblazer811/Diffusion-Explorer).
The other explainers remain in the source tree, but are not part of the Pages site.

## Build locally

Use Node.js 22:

```sh
cd diffusion-explorer
npm ci --ignore-scripts
npx tsx packages/ui/tests/explorer-player.test.ts
npx tsx packages/diffusion/tests/ddpm-regression.mts
npm run build --workspace=diffusion-explorer-app
```

The build copies TensorFlow's browser WASM files and bundles the browser workers.
Installation skips native TensorFlow setup, which is only needed by the offline
model-training scripts. The web application trains in the browser.

The explorer uses the public animation implementation from upstream commit
`bbab3e4`'s parent through a small compatibility adapter. Its unavailable Tempus
submodule is unnecessary for this application and is not installed.

For a project Pages path, set `BASE_PATH` to the repository name prefixed by `/`.
In PowerShell, for example:

```powershell
$env:BASE_PATH = '/diffusion-explorer-ipad'
npm run build --workspace=diffusion-explorer-app
cd apps/diffusion-explorer
node node_modules/vite/bin/vite.js preview --host 127.0.0.1
```

Open the preview URL followed by `/diffusion-explorer-ipad/`.

## Publish on GitHub Pages

Create a public repository, push this checkout with branch `main`, then select
**Settings → Pages → Source → GitHub Actions**. The workflow in
`.github/workflows/pages.yml` builds on each push to `main` and can also be run
manually from Actions. It obtains the correct base path from GitHub Pages, so the
repository can be renamed without editing the app.

After a successful deployment, open `https://OWNER.github.io/REPOSITORY/` in iPad
Safari. Browser training can take time; keep Safari open while training.

## Validation

The focused playback and DDPM regression tests run in the deployment workflow.
Browser smoke checks cover all three objective choices, sampler changes,
play/pause and seeking, model/cache asset loading, and layouts at 820, 1024,
and 1180 pixels wide. Physical iPad testing remains separate from these checks.

The repository-wide Svelte/TypeScript check still reports upstream errors in
the shared math library and unused legacy components; it is not currently a
passing check. The production build and focused runtime checks are the release
checks for this fork.
