// Only the controls and plotters used by the explorer; other explainers use Tempus.
export { Timeline, Player, type Clip } from './animation/explorer-player';
export { default as TimeSlider } from './components/TimeSlider.svelte';
export { default as DropDown } from './components/DropDown.svelte';
export { default as IconToggleButton } from './components/IconToggleButton.svelte';
export { useCanvas2D } from './plotting/canvas';
export { drawScatterPlot } from './plotting/plotting';
export { computeContours, plotContours } from './plotting/contours';
export { plotMeshGrid } from './plotting/mesh_grid';
export { drawTrajectories, type TrajectoryStyleOptions } from './plotting/trajectories';
