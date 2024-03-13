import * as esbuild from 'esbuild'

let names = ['main', 'preload', 'renderer']
names.forEach((name) => {
	esbuild.build({
		entryPoints: [`src/${name}.ts`],
		bundle: true,
		outfile: `dist/${name}.js`,
		platform: name == 'renderer' ? 'browser' : 'node',
		external: ['electron'],
	})
})