import * as ts from "typescript";
import * as fs from "fs";

class DeserializeRecursionLevel {
    public derive(): DeserializeRecursionLevel {
        return new DeserializeRecursionLevel();
    }

    public schemas: Markup.OXMLSchemaInfo[];
}

function deserialize(fileNames: string[], options: ts.CompilerOptions): void {
    for (let fileName of fileNames) {
        let xmlContent: string = fs.readFileSync(fileName, { encoding: "utf-8" }),
            parser = new DOMParser(),
            xmlDoc = parser.parseFromString(xmlContent, "application/xml");

        function parseChildrenRecursive(node: Node, upperRecursion: DeserializeRecursionLevel) {
            let recursion = upperRecursion.derive()



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