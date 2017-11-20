Core.Modules.modifyModule("Core.UserInterface", function () {

    //CoreDataGrid
    var CoreDataGrid_prototype = Object.create(HTMLElement.prototype);
    CoreDataGrid_prototype.bodyElement = null;

    CoreDataGrid_prototype.createdCallback = function () {
        this.shadowRoot = this.createShadowRoot();

        //The table element
        this.table = new Core.UserInterface.CoreDataGridTable();
        this.shadowRoot.appendChild(this.table);

        Object.defineProperty(this, "head", {
            get: function () {
                return this.table.head;
            }
        });

        Object.defineProperty(this, "body", {
            get: function () {
                return this.table.body;
            }
        });
    }

    this.CoreDataGrid = Core.UserInterface.register("core-datagrid", CoreDataGrid_prototype);

    //CoreDataGridTable
    var CoreDataGridTable_prototype = Object.create(HTMLElement.prototype);

    CoreDataGridTable_prototype.createdCallback = function () {
        this.setAttribute("cellspacing", 0);

        //The head element
        this.head = new Core.UserInterface.CoreDataGridHead();
        this.appendChild(this.head);

        //The body element
        this.body = new Core.UserInterface.CoreDataGridBody();
        this.appendChild(this.body);
    }

    this.CoreDataGridTable = Core.UserInterface.register("core-datagridtable", CoreDataGridTable_prototype, "table");

    //CoreDataGridBody
    var CoreDataGridBody_prototype = Object.create(HTMLElement.prototype);

    CoreDataGridBody_prototype.createdCallback = function () {
        //The array which contains all the rows of this Data Grid
        this.rows = [];
    }

    CoreDataGridBody_prototype.addRow = function (row) {
        this.appendChild(row);
        this.rows.push(row);
    }

    //use this to read information from an array
    CoreDataGridBody_prototype.readFromArray = function (array) {
        //acquire row info from the array
        for (var i = 0; i < array.length; i++) {
            //create each row
            var row = new Core.UserInterface.CoreDataGridRow();
            row.readFromArray(array[i]);
            //append each row
            this.addRow(row);
        }
    }

    this.CoreDataGridBody = Core.UserInterface.register("core-datagridbody", CoreDataGridBody_prototype, "tbody");

    //CoreDataGridHead 
    var CoreDataGridHead_prototype = Core.ObjectManipulator.inherit(CoreDataGridBody_prototype);

    CoreDataGridHead_prototype.createdCallback = function () {
        this._base.createdCallback.call(this);
    }

    this.CoreDataGridHead = Core.UserInterface.register("core-datagridhead", CoreDataGridHead_prototype, "thead");

    //CoreDataGridRow
    var CoreDataGridRow_prototype = Object.create(HTMLElement.prototype);

    CoreDataGridRow_prototype.createdCallback = function () {
        this.cells = [];
    }

    CoreDataGridRow_prototype.addCell = function (cell) {
        this.appendChild(cell);
        this.cells.push(cell);
    }

    CoreDataGridRow_prototype.readFromArray = function (array) {
        //acquire cell info from the array
        for (var i = 0; i < array.length; i++) {
            //create each cell
            var cell = new Core.UserInterface.CoreDataGridCell(),
                cellObj = array[i];

            if (Core.TypeChecking.isObject(cellObj)) {
                cell.elements = cellObj.elements;
                cell.span = cellObj.span;
            }
            else
                cell.textContent = String(array[i]);

            this.addCell(cell);
        }
    }

    this.CoreDataGridRow = Core.UserInterface.register("core-datagridrow", CoreDataGridRow_prototype, "tr");

    //CoreDataGridCell
    var CoreDataGridCell_prototype = Object.create(Core.UserInterface.Primitives.CoreElementContainer.prototype);

    CoreDataGridCell_prototype.selected = false;

    this.CoreDataGridCell = Core.UserInterface.register("core-datagridcell", CoreDataGridCell_prototype, "td");

}, ["Core.UserInterface.Primitives"]);