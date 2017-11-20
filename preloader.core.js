//Core namespace declaration
Core = new function() {

    //Core.Preloader namespace declaration
    this.Preloader = new function(params) {

        var PendingScript = function (src, dependencies, implicit) {
            //The script source
            this.src = src;
            //The scripts this script depends on to work properly
            this.dependencies = dependencies || [];
            //The pending status of this script query
            this.pendingStatus = "pending";

            //Loads and executes this script
            this.execute = function () {
                var _this = this;
                
                function scriptOnLoad() {
                    //Add script to loaded list
                    loadedScripts.push(_this);

                    _this.pendingStatus = "success";
                }
                
                function scriptOnError() {
                    _this.pendingStatus = "error";
                }

                var script = document.createElement("script");
                script.type="text/javascript";
                script.src = this.src;

                script.onload = scriptOnLoad;
                script.onerror = scriptOnError;
                
                document.head.appendChild(script);
                
                this.pendingStatus = "started";
            }
            
            //Checks if this script's dependencies have been loaded
            this.dependenciesLoaded = function () {
                return this.dependencies.length == 0 ||
                    this.dependencies.every(function (src) {
                        return loadedScripts.some(function (script) {
                            return script.src == src;
                            });
                        });
            }
        }
        
        var pendingScripts = [
            new PendingScript("typeChecking.core.js"),
            new PendingScript("objectManipulator.core.js"),
            new PendingScript("stringManipulator.core.js"),
            new PendingScript("modules.core.js", ["objectManipulator.core.js", "typeChecking.core.js", "stringManipulator.core.js"]),
            new PendingScript("userInterface.core.js", ["modules.core.js"]),
            new PendingScript("icons.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("primitives.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("coreProgressBar.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("coreInput.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("iconElement.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("coreButton.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("coreDialog.userInterface.core.js", ["modules.core.js"]),
            new PendingScript("coreDataGrid.userInterface.core.js", ["modules.core.js"])
        ];

        var loadedScripts = [];
        
        function loadAllScripts() {
            console.log(pendingScripts);

            function loadPendingScript(pendingScript) {
                if (!pendingScript.dependenciesLoaded(loadedScripts))
                    setTimeout(loadPendingScript, 0, pendingScript);
                else
                    pendingScript.execute();
            }

            for (var i = 0; i < pendingScripts.length; i++)
                loadPendingScript(pendingScripts[i]);
        }
        
        loadAllScripts(pendingScripts);
    }
}