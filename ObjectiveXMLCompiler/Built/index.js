"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
class DeserializeRecursionLevel {
    derive() {
        return new DeserializeRecursionLevel();
    }
}
function deserialize(fileNames, options) {
    for (let fileName of fileNames) {
        let xmlContent = fs.readFileSync(fileName, { encoding: "utf-8" }), parser = new DOMParser(), xmlDoc = parser.parseFromString(xmlContent, "application/xml");
        function parseChildrenRecursive(node, upperRecursion) {
            let recursion = upperRecursion.derive();
            if (node.nodeType === node.ELEMENT_NODE)
                for (let childNode of node.childNodes)
                    parseChildrenRecursive(node, recursion);
        }
    }
}
deserialize(process.argv.slice(2), {
    noEmitOnError: true, noImplicitAny: true,
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
//# sourceMappingURL=index.js.map