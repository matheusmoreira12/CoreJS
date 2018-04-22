namespace Core.UserInterface.Primitives {

    export class Label extends ContentContainer {
        //Sets the label text content with a format
        setText(text: string, ...params: any[]) {
            //Set text, passing the parameters through to StringUtils
            this.content = new Content(StringUtils.format(text, ...params));
        }
    }
    customElements.define('core-label', Label);
}