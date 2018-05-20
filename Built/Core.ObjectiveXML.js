var Core;
(function (Core) {
    var ObjectiveXML;
    (function (ObjectiveXML) {
        let IDependencyObject;
        (function (IDependencyObject) {
            function getValue(owner, property) {
                return null;
            }
            IDependencyObject.getValue = getValue;
            function setValue(owner, property, value) {
            }
            IDependencyObject.setValue = setValue;
        })(IDependencyObject = ObjectiveXML.IDependencyObject || (ObjectiveXML.IDependencyObject = {}));
        class DependencyObject extends Object {
            /**
             * Gets the value of the specified dependency property.
             * @param property The dependency property.
             */
            getValue(property) {
                return IDependencyObject.getValue(this, property);
            }
            /**
             * Sets the value of the specified dependency property.
             * @param property The dependency property.
             * @param value The new value for the specified dependency property.
             */
            setValue(property, value) {
                IDependencyObject.setValue(this, property, value);
            }
        }
        ObjectiveXML.DependencyObject = DependencyObject;
        class DependencyObjectType {
            constructor(id, name, environmentType) {
                this.id = id;
                this.name = name;
                this.environmentType = environmentType;
                return Object.freeze(this);
            }
            static _getUniqueId(type) {
                let depObjType = this._registeredTypes.first((item) => Object.is(item.environmentType, type)), newId = this._registeredTypes.count;
                if (depObjType !== null)
                    return depObjType.id;
                return newId;
            }
            static fromSystemType(type) {
                let id = this._getUniqueId(type), name = type.constructor.name;
                return new DependencyObjectType(id, name, type);
            }
            /**
             * Gets the DependencyObjectType of the immediate base class of the current DependencyObjectType.
             */
            get baseType() {
                let baseEnvironmentType = Object.getPrototypeOf(this.environmentType);
                return DependencyObjectType.fromSystemType(baseEnvironmentType);
            }
        }
        DependencyObjectType._registeredTypes = new Core.Collections.Generic.List();
        ObjectiveXML.DependencyObjectType = DependencyObjectType;
        class PropertyMetadata {
            /**
             * Initializes a new instance of the PropertyMetadata class with the specified default value and callbacks.
             * @param defaultValue The default value of the dependency property, usually provided as a value of some
             * specific type.
             * @param propertyChangedCallback Reference to a handler implementation that is to be called by the property
             * system whenever the effective value of the property changes.
             * @param coerceValueCallback Reference to a handler implementation that is to be called whenever the property
             * system calls CoerceValue(DependencyProperty) against this property.
             */
            constructor(defaultValue, propertyChangedCallback, coerceValueCallback) {
                this.defaultValue = defaultValue;
                this.propertyChangedCallback = propertyChangedCallback;
                this.coerceValueCallback = coerceValueCallback;
            }
            /**
             * Called when this metadata has been applied to a property, which indicates that the metadata is being sealed.
             * @param dp The dependency property to which the metadata has been applied.
             * @param targetType The type associated with this metadata if this is type-specific metadata. If this
             * is default metadata, this value is a null reference.
             */
            onApply(dp, targetType) {
            }
            /**
             * Merges this metadata with the base metadata.
             * @param baseMetadata The base metadata to merge with this instance's values.
             * @param dp The dependency property to which this metadata is being applied.
             */
            merge(baseMetadata, dp) {
            }
        }
        ObjectiveXML.PropertyMetadata = PropertyMetadata;
        class DependencyPropertyRegistryEntry {
            constructor(property, metadata) {
                this.property = property;
                this.metadata = metadata;
            }
        }
        ObjectiveXML.DependencyPropertyRegistryEntry = DependencyPropertyRegistryEntry;
        let DependencyPropertyRegistry;
        (function (DependencyPropertyRegistry) {
            let registryEntries;
            function register(property, metadata) {
                let entry = new DependencyPropertyRegistryEntry(property, metadata), globalIndex = registryEntries.count;
                registryEntries.add(entry);
                return globalIndex;
            }
            DependencyPropertyRegistry.register = register;
        })(DependencyPropertyRegistry || (DependencyPropertyRegistry = {}));
        class DependencyPropertyKey {
            /**
             * Overrides the metadata of a read-only dependency property that is represented by this dependency
             * property identifier.
             * @param ownerType
             * @param metadata
             */
            overrideMetadata(forType, typeMetadata) {
            }
        }
        ObjectiveXML.DependencyPropertyKey = DependencyPropertyKey;
        class DependencyProperty {
            static _registerCommon(name, propertyType, ownerType, metadata, validateValueCallback) {
                let keyStr = `${ownerType.inheritanceToString()}#${name}`, key = Core.HashCode.fromString(keyStr);
                return null;
            }
            /**
             * Registers a dependency property with the specified property name, property type, owner type,
             * property metadata, and a value validation callback for the property.
             * @param name
             * @param propertyType
             * @param ownerType
             * @param metadata
             * @param validateValueCallback
             */
            static register(name, propertyType, ownerType, metadata, validateValueCallback) {
                return this._registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
            }
            /**
             * Registers an attached property with the specified property type, owner type, property metadata,
             * and value validation callback for the property.
             * @param name
             * @param propertyType
             * @param ownerType
             * @param metadata
             * @param validateValueCallback
             */
            static registerAttached(name, propertyType, ownerType, metadata, validateValueCallback) {
                return this._registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
            }
            /**
             * Adds another type as an owner of a dependency property that has already been registered, providing
             * dependency property metadata for the dependency property as it will exist on the  provided owner type.
             * @param ownerType
             * @param metadata
             */
            addOwner(ownerType, metadata) {
                return null;
            }
            /**
             * Returns the metadata for this dependency property as it exists on a specified type.
             * @param owner
             */
            getMetadata(owner) {
            }
        }
        DependencyProperty._propertyFromName = new Core.Collections.Generic.Dictionary();
        ObjectiveXML.DependencyProperty = DependencyProperty;
    })(ObjectiveXML = Core.ObjectiveXML || (Core.ObjectiveXML = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.ObjectiveXML.js.map