System.register("index", ["typescript", "path"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createCompilerHost(options, moduleSearchLocations) {
        return {
            getSourceFile,
            getDefaultLibFileName: () => "lib.d.ts",
            writeFile: (fileName, content) => ts.sys.writeFile(fileName, content),
            getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
            getDirectories: (path) => ts.sys.getDirectories(path),
            getCanonicalFileName: fileName => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
            getNewLine: () => ts.sys.newLine,
            useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
            fileExists,
            readFile,
            resolveModuleNames
        };
        function fileExists(fileName) {
            return ts.sys.fileExists(fileName);
        }
        function readFile(fileName) {
            return ts.sys.readFile(fileName);
        }
        function getSourceFile(fileName, languageVersion, onError) {
            const sourceText = ts.sys.readFile(fileName);
            return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
        }
        function resolveModuleNames(moduleNames, containingFile) {
            const resolvedModules = [];
            for (const moduleName of moduleNames) {
                // try to use standard resolution
                let result = ts.resolveModuleName(moduleName, containingFile, options, { fileExists, readFile });
                if (result.resolvedModule) {
                    resolvedModules.push(result.resolvedModule);
                }
                else {
                    // check fallback locations, for simplicity assume that module at location should be represented by '.d.ts' file
                    for (const location of moduleSearchLocations) {
                        const modulePath = path.join(location, moduleName + ".d.ts");
                        if (fileExists(modulePath)) {
                            resolvedModules.push({ resolvedFileName: modulePath });
                        }
                    }
                }
            }
            return resolvedModules;
        }
    }
    function compile(sourceFiles, moduleSearchLocations) {
        const options = { module: ts.ModuleKind.AMD, target: ts.ScriptTarget.ES5 };
        const host = createCompilerHost(options, moduleSearchLocations);
        const program = ts.createProgram(sourceFiles, options, host);
        /// do something with program...
    }
    var ts, path;
    return {
        setters: [
            function (ts_1) {
                ts = ts_1;
            },
            function (path_1) {
                path = path_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=Core.js.map