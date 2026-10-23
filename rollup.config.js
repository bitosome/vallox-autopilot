import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
export default {input:'src/card.ts',output:{file:'custom_components/vallox_autopilot/www/vallox-autopilot-card.js',format:'es'},plugins:[resolve(),commonjs(),typescript(),terser()]};
