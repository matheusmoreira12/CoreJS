var Core;
(function (Core) {
    var Decorators;
    (function (Decorators) {
        function enumerable(isEnumerable) {
            return function (target, key, descriptor) {
                descriptor.enumerable = isEnumerable;
            };
        }
        Decorators.enumerable = enumerable;
        function writable(isWritable) {
            return function (target, key, descriptor) {
                descriptor.writable = isWritable;
            };
        }
        Decorators.writable = writable;
        function configurable(isConfigurable) {
            return function (target, key, descriptor) {
                descriptor.configurable = isConfigurable;
            };
        }
        Decorators.configurable = configurable;
    })(Decorators = Core.Decorators || (Core.Decorators = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Decorators.js.map