<script lang="ts">
  import { base } from '$app/paths';
</script>

<svelte:head>
  <title>Conditional Diffusion — Diffusion Explorer</title>
</svelte:head>

<main class="conditional-guide">
  <h1>Conditional Diffusion</h1>
  <p>Conditional diffusion is available in the main explorer. Select <strong>Conditional Diffusion</strong> in the Training Objective menu to explore the Three Modes distribution.</p>
  <a href={`${base}/`}>Open Diffusion Explorer</a>
</main>

<style>
  .conditional-guide { max-width: 42rem; margin: 3rem auto; padding: 1.5rem; line-height: 1.6; }
  a { display: inline-block; padding: 0.7rem 1rem; border-radius: 0.5rem; background: #4594e3; color: white; }
</style>
