namespace Core.UserInterface {

    //CoreDataGrid
    export class DataGrid extends HTMLElement {
        private createTableElement() {
            let tableElement = <DataGridTable>document.createElement("core-datagridtable");
            this.shadowRoot.appendChild(tableElement);

            //The table element
            this.tableElement = tableElement;
        }

        constructor() {
            super();
            
            this.attachShadow({ mode: "open" });

            this.createTableElement();
        }


        protected shadow: ShadowRoot;
        private tableElement: DataGridTable;
        
        get head() { return this.tableElement.head; }
        get body() { return this.tableElement.body; }
    }

    customElements.define('core-datagrid', DataGrid);

    //CoreDataGridTable
    export class DataGridTable extends HTMLElement {

        private createHeadElement() {
            let head = <DataGridSection>document.createElement("core-datagridsection");
            this.shadowRoot.appendChild(head);

            this.head = head;
        }

        private createBodyElement() {
            let body = <DataGridSection>document.createElement("core-datagridsection");
            this.shadowRoot.appendChild(body);

            this.body = body;
        }

        constructor() {
            super();

            this.attachShadow({ mode: "open" });

            this.createHeadElement();
            this.createBodyElement();
        }

        head: DataGridSection;
        body: DataGridSection;
    }
    customElements.define('core-datagridtable', DataGridTable);

    //CoreDataGridBody
    export class DataGridSection extends Primitives.ElementContainer {
    }
    customElements.define('core-datagridsection', DataGridSection);

    //CoreDataGridRow
    export class DataGridRow extends Primitives.ElementContainer {
    }
    customElements.define('core-datagridrow', DataGridRow);

    //CoreDataGridCell
    export class DataGridCell extends Primitives.ElementContainer {
        constructor() {
            super();
        }
        
        selected: boolean;
    }
    customElements.define('core-datagridcell', DataGridCell);

}