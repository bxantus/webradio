import { bundle } from "https://raw.githubusercontent.com/bxantus/bundleForWeb/v1.0.0/bundler.ts";

const srcFile = Deno.args[0]
const out = Deno.args[1]

const filesToCopy:string[] = ["index.css"]
for (const f of filesToCopy){
    console.log(`copy src/${f} -> ${out}/${f}`)
    Deno.copyFileSync(`src/${f}`, `${out}/${f}` )
}

await bundle(srcFile, {
    importMap: "src/import_map.json", // optional: if you want to specify import maps
    outDir: out
})