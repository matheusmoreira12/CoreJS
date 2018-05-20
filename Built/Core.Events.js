///<reference path="Core.MethodGroup.ts"/>
var Core;
(function (Core) {
    var Events;
    (function (Events) {
        class ProgressEvent extends Core.MethodGroup {
            stopPropagation() {
                super.stopPropagation();
            }
            invoke(args) {
                super.invoke(args);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
        }
        Events.ProgressEvent = ProgressEvent;
        class PropertyChangedEvent extends Core.MethodGroup {
            stopPropagation() {
                super.stopPropagation();
            }
            invoke(args) {
                super.invoke(args);
            }
            attach(listener) {
                super.attach(listener);
            }
            detach(listener) {
                super.detach(listener);
            }
        }
        Events.PropertyChangedEvent = PropertyChangedEvent;
    })(Events = Core.Events || (Core.Events = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Events.js.map