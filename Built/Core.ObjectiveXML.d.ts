declare namespace Core.ObjectiveXML {
    interface IValueConverter {
        convert(value: object): object;
        convertBack(value: object): object;
    }
    interface IDependencyObject extends Object {
        /**
         * Gets the value of the specified dependency property.
         * @param property The dependency property.
         */
        getValue(property: DependencyProperty): object;
        /**
         * Sets the value of the specified dependency property.
         * @param property The dependency property.
         * @param value The new value for the specified dependency property.
         */
        setValue(property: DependencyProperty, value: object): void;
    }
    namespace IDependencyObject {
        function getValue(owner: IDependencyObject, property: DependencyProperty): object;
        function setValue(owner: IDependencyObject, property: DependencyProperty, value: object): void;
    }
    class DependencyObject extends Object implements IDependencyObject {
        /**
         * Gets the value of the specified dependency property.
         * @param property The dependency property.
         */
        getValue(property: DependencyProperty): object;
        /**
         * Sets the value of the specified dependency property.
         * @param property The dependency property.
         * @param value The new value for the specified dependency property.
         */
        setValue(property: DependencyProperty, value: object): void;
    }
    class DependencyObjectType {
        private static _registeredTypes;
        private static _getUniqueId(type);
        static fromSystemType(type: Type): DependencyObjectType;
        private constructor();
        /**
         * Gets the DependencyObjectType of the immediate base class of the current DependencyObjectType.
         */
        readonly baseType: DependencyObjectType;
        /**
         * Gets a zero-based unique identifier for constant-time array lookup operations.
         */
        id: number;
        /**
         * Gets the name of the represented common language runtime (CLR) system type.
         */
        name: string;
        /**
         * Gets the common language runtime (CLR) system type represented by this DependencyObjectType.
         */
        environmentType: Type;
    }
    type DependencyPropertyChangedEventArgs = {
        property: DependencyProperty;
        oldValue: object;
        newValue: object;
    };
    type PropertyChangedCallback = (owner: IDependencyObject, args: DependencyPropertyChangedEventArgs) => void;
    type CoerceValueCallback = (owner: IDependencyObject, baseValue: object) => object;
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
        constructor(defaultValue?: object, propertyChangedCallback?: PropertyChangedCallback, coerceValueCallback?: CoerceValueCallback);
        /**Gets or sets a reference to a CoerceValueCallback implementation specified in this metadata. */
        coerceValueCallback: CoerceValueCallback;
        /**Gets or sets the default value of the dependency property. */
        defaultValue: object;
        /**Gets a value that determines whether the metadata has been applied to a property in some way, resulting
         * in the immutable state of that metadata instance. */
        isSealed: boolean;
        /**Gets or sets a reference to a PropertyChangedCallback implementation specified in this metadata. */
        propertyChangedCallback: PropertyChangedCallback;
        /**
         * Called when this metadata has been applied to a property, which indicates that the metadata is being sealed.
         * @param dp The dependency property to which the metadata has been applied.
         * @param targetType The type associated with this metadata if this is type-specific metadata. If this
         * is default metadata, this value is a null reference.
         */
        onApply(dp: DependencyProperty, targetType: Type): void;
        /**
         * Merges this metadata with the base metadata.
         * @param baseMetadata The base metadata to merge with this instance's values.
         * @param dp The dependency property to which this metadata is being applied.
         */
        merge(baseMetadata: PropertyMetadata, dp: DependencyProperty): void;
    }
    class DependencyPropertyRegistryEntry {
        property: DependencyProperty;
        metadata: PropertyMetadata;
        constructor(property: DependencyProperty, metadata: PropertyMetadata);
    }
    type ValidateValueCallback = (value: object) => boolean;
    class DependencyPropertyKey {
        property: DependencyProperty;
        /**
         * Overrides the metadata of a read-only dependency property that is represented by this dependency
         * property identifier.
         * @param ownerType
         * @param metadata
         */
        overrideMetadata(forType: Type, typeMetadata: PropertyMetadata): void;
    }
    class DependencyProperty {
        private static _propertyFromName;
        private static _registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
        /**
         * Registers a dependency property with the specified property name, property type, owner type,
         * property metadata, and a value validation callback for the property.
         * @param name
         * @param propertyType
         * @param ownerType
         * @param metadata
         * @param validateValueCallback
         */
        static register(name: string, propertyType: Type, ownerType: Type, metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty;
        /**
         * Registers an attached property with the specified property type, owner type, property metadata,
         * and value validation callback for the property.
         * @param name
         * @param propertyType
         * @param ownerType
         * @param metadata
         * @param validateValueCallback
         */
        static registerAttached(name: string, propertyType: Type, ownerType: Type, metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty;
        /**
         * Gets the name of the dependency property.
         */
        name: string;
        /**
         * Gets the type that the dependency property uses for its value.
         */
        propertyType: Type;
        /**
         * Gets the type of the object that registered the dependency property with the property system,
         * or added itself as owner of the property.
         */
        ownerType: Type;
        /**
         * Gets an internally generated value that uniquely identifies the dependency property.
         */
        globalIndex: number;
        /**
         * Gets a value that indicates whether the dependency property identified by this DependencyProperty
         * instance is a read-only dependency property.
         */
        readOnly: boolean;
        /**
         * Gets the default metadata of the dependency property.
         */
        defaultMetadata: PropertyMetadata;
        /**
         * Adds another type as an owner of a dependency property that has already been registered, providing
         * dependency property metadata for the dependency property as it will exist on the  provided owner type.
         * @param ownerType
         * @param metadata
         */
        addOwner(ownerType: Type, metadata?: PropertyMetadata): DependencyProperty;
        /**
         * Returns the metadata for this dependency property as it exists on a specified type.
         * @param owner
         */
        getMetadata(owner: IDependencyObject | DependencyObjectType): void;
        /**
         * Gets the value validation callback for the dependency property.
         */
        validateValueCallback: ValidateValueCallback;
    }
}
