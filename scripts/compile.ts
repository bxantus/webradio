const srcFile = Deno.args[0]
const out = Deno.args[1]

const filesToCopy:string[] = [/* "index.html" */]
for (const f of filesToCopy){
    console.log(`copy src/${f} -> ${out}/${f}`)
    Deno.copyFileSync(`src/${f}`, `${out}/${f}` )
}

console.log(`Compiling src/${srcFile}`)
const { files, diagnostics } = await Deno.emit(`src/${srcFile}`, {
    bundle: "module",
    compilerOptions: {
        noImplicitAny: false,
        lib: ["dom", "esnext", "deno.ns"],
    },
    importMapPath: "src/import_map.json"
});

if (diagnostics.length) {
    // there is something that impacted the emit
    console.warn(Deno.formatDiagnostics(diagnostics));
}


for (const name in files) {
    const url = new URL(name)
    console.log(`  -> ${out}${url.pathname}`)
    const content = url.pathname.endsWith(".js") ?  files[name] + "\n//# sourceMappingURL=bundle.js.map\n" // attach sourcemap
                        : sourceMap(files[name]) 
    Deno.writeTextFileSync(out + url.pathname, content)
}

// with older version of deno, see: https://github.com/denoland/deno/issues/10953
function sourceMap(sourceMapText:string) {
    return sourceMapText
}