var Core;
(function (Core) {
    var Events;
    (function (Events) {
        class ProgressEvent extends Core.MethodGroup {
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