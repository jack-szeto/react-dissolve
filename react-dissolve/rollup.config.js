import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/index.ts',
    output: [
        {
            dir: 'dist',
            sourcemap: true,
            format: 'cjs',
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        external(),
        postcss({
            extract: false,
            modules: true,
            use: ['sass'],
        }),
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-react']
        }),
        resolve(),
        terser(),
    ],
    external: ['react', 'react-dom'],
}