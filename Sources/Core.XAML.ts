namespace Core.XAML {
    export interface IValueConverter {
        convert(value: object): object;
        convertBack(value: object): object;
    }

    export interface IDependencyObject extends Object {
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
    export namespace IDependencyObject {
        export function getValue(owner: IDependencyObject, property: DependencyProperty): object {
            return null;
        }

        export function setValue(owner: IDependencyObject, property: DependencyProperty, value: object): void {

        }
    }

    export class DependencyObject extends Object implements IDependencyObject {
        /**
         * Gets the value of the specified dependency property.
         * @param property The dependency property.
         */
        getValue(property: DependencyProperty): object {
            return IDependencyObject.getValue(this, property);
        }

        /**
         * Sets the value of the specified dependency property.
         * @param property The dependency property.
         * @param value The new value for the specified dependency property.
         */
        setValue(property: DependencyProperty, value: object): void {
            IDependencyObject.setValue(this, property, value);
        }
    }

    export class DependencyObjectType {

        private static _registeredTypes: Collections.GenericList<DependencyObjectType> =
            new Collections.GenericList<DependencyObjectType>();

        private static _getUniqueId(type: Type): number {
            let depObjType = this._registeredTypes.first((item) => Object.is(item.environmentType, type)),
                newId = this._registeredTypes.length;

            if (depObjType !== null)
                return depObjType.id;

            return newId;
        }

        public static fromSystemType(type: Type) {
            let id = this._getUniqueId(type),
                name = type.constructor.name;

            return new DependencyObjectType(id, name, type);
        }

        private constructor(id: number, name: string, environmentType: Type) {
            this.id = id;
            this.name = name;
            this.environmentType = environmentType;

            return Object.freeze(this);
        }

        /**
         * Gets the DependencyObjectType of the immediate base class of the current DependencyObjectType.
         */
        public get baseType(): DependencyObjectType {
            let baseEnvironmentType = Object.getPrototypeOf(this.environmentType);

            return DependencyObjectType.fromSystemType(baseEnvironmentType)
        }

        /**
         * Gets a zero-based unique identifier for constant-time array lookup operations.
         */
        public id: number;

        /**
         * Gets the name of the represented common language runtime (CLR) system type.
         */
        public name: string;

        /**
         * Gets the common language runtime (CLR) system type represented by this DependencyObjectType.
         */
        public environmentType: Type;
    }

    export type DependencyPropertyChangedEventArgs = { property: DependencyProperty, oldValue: object, newValue: object };
    export type PropertyChangedCallback = (owner: IDependencyObject, args: DependencyPropertyChangedEventArgs) => void;

    export type CoerceValueCallback = (owner: IDependencyObject, baseValue: object) => object;

    export class PropertyMetadata {
        /**
         * Initializes a new instance of the PropertyMetadata class with the specified default value and callbacks.
         * @param defaultValue The default value of the dependency property, usually provided as a value of some 
         * specific type.
         * @param propertyChangedCallback Reference to a handler implementation that is to be called by the property 
         * system whenever the effective value of the property changes.
         * @param coerceValueCallback Reference to a handler implementation that is to be called whenever the property 
         * system calls CoerceValue(DependencyProperty) against this property.
         */
        constructor(defaultValue?: object, propertyChangedCallback?: PropertyChangedCallback,
            coerceValueCallback?: CoerceValueCallback) {

            this.defaultValue = defaultValue;
            this.propertyChangedCallback = propertyChangedCallback;
            this.coerceValueCallback = coerceValueCallback;
        }

        /**Gets or sets a reference to a CoerceValueCallback implementation specified in this metadata. */
        public coerceValueCallback: CoerceValueCallback;
        /**Gets or sets the default value of the dependency property. */
        public defaultValue: object;
        /**Gets a value that determines whether the metadata has been applied to a property in some way, resulting 
         * in the immutable state of that metadata instance. */
        public isSealed: boolean;
        /**Gets or sets a reference to a PropertyChangedCallback implementation specified in this metadata. */
        public propertyChangedCallback: PropertyChangedCallback;

        /**
         * Called when this metadata has been applied to a property, which indicates that the metadata is being sealed.
         * @param dp The dependency property to which the metadata has been applied.
         * @param targetType The type associated with this metadata if this is type-specific metadata. If this 
         * is default metadata, this value is a null reference.
         */
        public onApply(dp: DependencyProperty, targetType: Type): void {

        }

        /**
         * Merges this metadata with the base metadata.
         * @param baseMetadata The base metadata to merge with this instance's values.
         * @param dp The dependency property to which this metadata is being applied.
         */
        public merge(baseMetadata: PropertyMetadata, dp: DependencyProperty): void {

        }
    }

    export class DependencyPropertyRegistryEntry {
        public property: DependencyProperty;
        public metadata: PropertyMetadata;

        constructor(property: DependencyProperty, metadata: PropertyMetadata) {
            this.property = property;
            this.metadata = metadata;
        }
    }

    namespace DependencyPropertyRegistry {
        let registryEntries: Collections.GenericList<DependencyPropertyRegistryEntry>;

        export function register(property: DependencyProperty, metadata: PropertyMetadata): number {
            let entry = new DependencyPropertyRegistryEntry(property, metadata),
                globalIndex = registryEntries.length;

            registryEntries.add(entry);

            return globalIndex;
        }
    }

    export type ValidateValueCallback = (value: object) => boolean;

    export class DependencyPropertyKey {
        public property: DependencyProperty;

        /**
         * Overrides the metadata of a read-only dependency property that is represented by this dependency 
         * property identifier.
         * @param ownerType
         * @param metadata
         */
        public overrideMetadata(forType: Type, typeMetadata: PropertyMetadata): void {
        }
    }

    export class DependencyProperty {
        private static _registerCommon(name: string, propertyType: Type, ownerType: Type,
            metadata: PropertyMetadata, validateValueCallback: ValidateValueCallback): DependencyProperty {

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
        public static register(name: string, propertyType: Type, ownerType: Type,
            metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty {

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
        public static registerAttached(name: string, propertyType: Type, ownerType: Type,
            metadata?: PropertyMetadata, validateValueCallback?: ValidateValueCallback): DependencyProperty {

            return this._registerCommon(name, propertyType, ownerType, metadata, validateValueCallback);
        }

        /**
         * Gets the name of the dependency property.
         */
        public name: string;

        /**
         * Gets the type that the dependency property uses for its value.
         */
        public propertyType: Type;

        /**
         * Gets the type of the object that registered the dependency property with the property system, 
         * or added itself as owner of the property.
         */
        public ownerType: Type;

        /**
         * Gets an internally generated value that uniquely identifies the dependency property.
         */
        public globalIndex: number;

        /**
         * Gets a value that indicates whether the dependency property identified by this DependencyProperty 
         * instance is a read-only dependency property.
         */
        public readOnly: boolean;

        /**
         * Gets the default metadata of the dependency property.
         */
        public defaultMetadata: PropertyMetadata;

        /**
         * Adds another type as an owner of a dependency property that has already been registered, providing 
         * dependency property metadata for the dependency property as it will exist on the  provided owner type.
         * @param ownerType
         * @param metadata
         */
        public addOwner(ownerType: Type, metadata?: PropertyMetadata): DependencyProperty {
            return null;
        }

        /**
         * Returns the metadata for this dependency property as it exists on a specified type.
         * @param owner
         */
        public getMetadata(owner: IDependencyObject | DependencyObjectType) {

        }

        /**
         * Gets the value validation callback for the dependency property.
         */
        public validateValueCallback: ValidateValueCallback;
    }
}