var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        //CoreDataGrid
        class DataGrid extends HTMLElement {
            constructor() {
                super();
                this.shadow = UserInterface.Utils.attachShadow(this);
                this.createTableElement();
            }
            createTableElement() {
                let tableElement = new DataGridContent();
                this.shadow.appendChild(tableElement);
                //The table element
                this.tableElement = tableElement;
            }
            get head() { return this.tableElement.head; }
            get body() { return this.tableElement.body; }
        }
        UserInterface.DataGrid = DataGrid;
        UserInterface.Utils.defineCustomElement('core-dataGrid', DataGrid);
        //CoreDataGridTable
        class DataGridContent extends HTMLElement {
            constructor() {
                super();
                this.createHeadElement();
                this.createBodyElement();
            }
            createHeadElement() {
                let head = new DataGridSection();
                this.appendChild(this.head);
                this.head = head;
            }
            createBodyElement() {
                let body = new DataGridSection();
                this.appendChild(this.body);
                this.body = body;
            }
        }
        UserInterface.DataGridContent = DataGridContent;
        UserInterface.Utils.defineCustomElement('core-dataGridTable', DataGridContent);
        //CoreDataGridBody
        class DataGridSection extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.Utils.defineCustomElement('core-dataGridSection', DataGridSection);
        //CoreDataGridRow
        class DataGridRow extends UserInterface.Primitives.ElementContainer {
        }
        UserInterface.DataGridRow = DataGridRow;
        UserInterface.Utils.defineCustomElement('core-datagridrow', DataGridRow, 'tr');
        //CoreDataGridCell
        class DataGridCell extends UserInterface.Primitives.ElementContainer {
            constructor() {
                super();
            }
        }
        UserInterface.DataGridCell = DataGridCell;
        UserInterface.Utils.defineCustomElement('core-datagridcell', DataGridCell, 'td');
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
