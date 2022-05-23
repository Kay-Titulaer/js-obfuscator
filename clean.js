const child_process = require('child_process');

var devDependices = [
    "javascript-obfuscator",
    "esbuild"
];

var installedDependencies = child_process.execSync('npm list --depth=0').toString().split('\n');
installedDependencies.shift();
console.log("Uninstalling old dependencies...");
for (var i = 0; i < installedDependencies.length; i++) {
    var dependency = installedDependencies[i].split('@')[0].split(' ')[1];
    if (dependency == undefined) continue;
    if (devDependices.indexOf(dependency) == -1) {
        child_process.execSync('npm uninstall ' + dependency);
    }
}

const config = require("./config.js")

for (var key in config.dependencies) {
    console.log('installing ' + key + '@' + config.dependencies[key]);
    child_process.execSync('npm install ' + key + '@' + config.dependencies[key]);
}

const fs = require('fs');

console.log("Bundling...");
require('esbuild').build({
    entryPoints: [`./src/${config.main}`],
    bundle: true,
    outfile: 'out.js',
    platform: 'node'
}).catch((err) => console.error(err));
console.log("Bundling done");
const JavaScriptObfuscator = require('javascript-obfuscator');
console.log("Obfuscating...");
var obfuscated = JavaScriptObfuscator.obfuscate(fs.readFileSync('out.js', 'utf8'), {
    compact: true,
    deadCodeInjection: true,
    disableConsoleOutput: false,
    numbersToExpressions: true,
    selfDefending: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    target: 'node',
    unicodeEscapeSequence: false
})
fs.writeFileSync('out.js', obfuscated.getObfuscatedCode());
console.log("Obfuscating done");
console.log("Done");