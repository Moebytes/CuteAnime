import {defineConfig} from "@rsbuild/core"
import {pluginReact} from "@rsbuild/plugin-react"
import {pluginLess} from "@rsbuild/plugin-less"
import {pluginNodePolyfill} from "@rsbuild/plugin-node-polyfill"

export default defineConfig({
    tools: {
        rspack(config) {
            config.module = config.module || {}
            config.module.rules = config.module.rules || []
            
            config.module.rules.push({
                test: /\.svg$/,
                type: "javascript/auto",
                use: [{
                    loader: "@svgr/webpack", 
                    options: {
                        svgoConfig: {
                            plugins: [
                                {name: "preset-default", params: {overrides: {removeViewBox: false}}}
                            ]
                        }
                    }
                }]
            })

            return config
        }
    },
    plugins: [pluginNodePolyfill(), pluginReact(), pluginLess()],
    dev: {
        hmr: true,
        writeToDisk: true
    },
    html: {
        template: "./index.html"
    },
    source: {
        entry: {
            index: "./index.tsx"
        }
    },
    output: {
        filenameHash: false
    }
})