namespace Core.UserInterface {

    //CoreDataGrid
    export class DataGrid extends HTMLElement {
        private createTableElement() {
            let tableElement = new DataGridContent();
            this.shadow.appendChild(tableElement);

            //The table element
            this.tableElement = tableElement;
        }

        constructor() {
            super();
            
            this.shadow = Utils.attachShadow(this);
            this.createTableElement();
        }


        protected shadow: ShadowRoot;
        private tableElement: DataGridContent;
        
        get head() { return this.tableElement.head; }
        get body() { return this.tableElement.body; }
    }

    Utils.defineCustomElement('core-dataGrid', DataGrid);

    //CoreDataGridTable
    export class DataGridContent extends HTMLElement {

        private createHeadElement() {
            let head = new DataGridSection();
            this.appendChild(this.head);

            this.head = head;
        }

        private createBodyElement() {
            let body = new DataGridSection();
            this.appendChild(this.body);

            this.body = body;
        }

        constructor() {
            super();

            this.createHeadElement();
            this.createBodyElement();
        }

        head: DataGridSection;
        body: DataGridSection;
    }

    Utils.defineCustomElement('core-dataGridTable', DataGridContent);

    //CoreDataGridBody
    class DataGridSection extends Primitives.ElementContainer {
    }

    Utils.defineCustomElement('core-dataGridSection', DataGridSection);

    //CoreDataGridRow
    export class DataGridRow extends Primitives.ElementContainer {
    }

    Utils.defineCustomElement('core-datagridrow', DataGridRow, 'tr');

    //CoreDataGridCell
    export class DataGridCell extends Primitives.ElementContainer {
        constructor() {
            super();
        }
        
        selected: boolean;
    }

    Utils.defineCustomElement('core-datagridcell', DataGridCell, 'td');

}