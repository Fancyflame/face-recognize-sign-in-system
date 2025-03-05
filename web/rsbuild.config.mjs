import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    plugins: [pluginReact(), pluginLess()],
    jsx: {
        jsxImportSource: "react",
    },
    tools: {
        webpack: (config) => {
            config.plugins.push(
                new webpack.DefinePlugin({
                    "require('fs')": "undefined",
                }),
            );
        },
    },
});
