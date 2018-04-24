import * as ts from "typescript";
import * as fs from "fs";

function compile(fileNames: string[], options: ts.CompilerOptions): void {
    for (let fileName of fileNames) {
        let xmlContent: string = fs.readFileSync(fileName, { encoding: "utf-8" }),
            parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlContent, "application/xml");

        function parseChildrenRecursive(node: Node) {


            if (node.nodeType === node.ELEMENT_NODE) {
                for (let childNode of node.childNodes)
                    parseChildrenRecursive(childNode);
            }
        }
    }
}

compile(process.argv.slice(2), {
    noEmitOnError: true, noImplicitAny: true,
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});