///<reference path="Core.Collections.ts"/>

namespace Core.UserInterface {

    export class AttributePropertyAssociator {
        constructor(target: Node) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, Node, true, false);

            this.target = target;
        }

        private _associations = new Collections.GenericList<[string, string]>();

        protected target: Node;

        private _getAssociatedPropertyName(attributeName: string): string {
            let matches = this._associations.filter((item) => item[1] == attributeName);

            if (matches.length > 0)
                return matches[0][0];
            else
                return null;
        }

        private _getAssociatedAttributeName(propertyName: string): string {
            let matches = this._associations.filter((item) => item[0] == propertyName);

            if (matches.length > 0)
                return matches[0][1];
            else
                return null;
        }

        private _onPropertyChanged(target: any, args: Events.PropertyChangedEventArgs) {
            let assocAttrName = this._getAssociatedAttributeName(args.propertyName);

        }
        //Property changed event
        propertyChangedEvent = new Events.PropertyChangedEvent(this, this.onPropertyChanged);
        //  Invokes the propertyChanged event
        onPropertyChanged(propertyName: string, args: Events.PropertyChangedEventArgs) {
            this.propertyChangedEvent.invoke(args);
        }

        private _onAttributeChanged(target: any, args: Events.PropertyChangedEventArgs) {
            let assocPropName = this._getAssociatedPropertyName(args.propertyName);
            
        }
        //Attribute changed event
        attributeChangedEvent = new Events.PropertyChangedEvent(this, this.onAttributeChanged);
        //  Invokes the attributeChanged event
        onAttributeChanged(propertyName: string, args: Events.PropertyChangedEventArgs) {
            this.attributeChangedEvent.invoke(args);
        }

        associate(propertyName: string, attributeName: string = propertyName) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("propertyName", propertyName, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("attributeName", attributeName, STRING, true, false);

            this._associations.add([attributeName, propertyName])
        }
    }
}