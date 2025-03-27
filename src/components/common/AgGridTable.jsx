import React from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AgGridTable = ({ 
  rowData, 
  columnDefs, 
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  },
  pagination = true,
  paginationPageSize = 10,
  ...props 
}) => {
  return (
    <div className="ag-theme-alpine" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[10, 20, 50]}
        domLayout="autoHeight"
        {...props}
      />
    </div>
  );
};

export default AgGridTable;