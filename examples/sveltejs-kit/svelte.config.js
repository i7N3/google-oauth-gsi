import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			typescript: true,
			preserve: ['ld+json', 'module']
		})
	],
	kit: {
		adapter: adapter({
			split: true
		}),
		alias: {
			$lib: 'src/lib/',
			$app: '.svelte-kit/runtime/app/'
		}
	}
};

export default config;
