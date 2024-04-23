import adapter from "@sveltejs/adapter-auto"
import adapterGhpages from "svelte-adapter-ghpages";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // vitePlugin: {
  //     dynamicCompileOptions({filename}){
  //       if(filename.includes('node_modules')){
  //         return {runes: undefined} // or false, check what works
  //       }
  //   },
  // },

  // compilerOptions: {
  // 	runes: true
  // },

  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // Use different adapters based on the environment. 
    // For GitHub Pages deployment, use svelte-adapter-ghpages. 
    // For local development, you can use a different adapter like @sveltejs/adapter-static or any other suitable one.
    adapter: process.env.NODE_ENV === 'production' ? adapterGhpages({
      pages: 'build',
      assets: 'build',
      fallback: null
    }) : adapter(),
    prerender: {
      entries: []
    },
    paths: {
      base: process.env.NODE_ENV === 'production' ? "/BreakOften" : "",
    },
  },
}

export default config
