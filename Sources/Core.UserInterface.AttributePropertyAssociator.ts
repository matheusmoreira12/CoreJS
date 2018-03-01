///<reference path="Core.ts"/>
///<reference path="Core.Validation.ts"/>
///<reference path="Core.Collections.ts"/>
///<reference path="Core.Events.ts"/>

namespace Core.UserInterface {
    export class AttributePropertyAssociator {
        constructor(target: Node) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("target", target, Node, true, false);

            this.target = target;

            this.propertyChangedEvent.attach(this.onPropertyChanged);
            this.attributeChangedEvent.attach(this.onAttributeChanged);
        }

        private _associations = new Collections.GenericCollection<[string, string]>();

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

        private 

        //Property changed event
        propertyChangedEvent = new Events.PropertyChangedEvent(this);
        private _onPropertyChanged(src: any, propertyName: string, oldValue: any, newValue: any) {
            let assocAttrName = this._getAssociatedAttributeName(propertyName);

        }
        //  Invokes the propertyChanged event
        onPropertyChanged(propertyName: string, oldValue: any, newValue: any) {
            this.propertyChangedEvent.invoke(propertyName, oldValue, newValue);
        }

        //Attribute changed event
        attributeChangedEvent = new Events.PropertyChangedEvent(this);
        private _onAttributeChanged(src: any, attributeName: string, oldValue: any, newValue: any) {
            let assocPropName = this._getAssociatedPropertyName(attributeName);
            
        }
        //  Invokes the attributeChanged event
        onAttributeChanged(propertyName: string, oldValue: any, newValue: any) {
            this.attributeChangedEvent.invoke(propertyName, oldValue, newValue);
        }

        associate(propertyName: string, attributeName: string = propertyName) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("propertyName", propertyName, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("attributeName", attributeName, STRING, true, false);

            this._associations.add([attributeName, propertyName])
        }
    }
}