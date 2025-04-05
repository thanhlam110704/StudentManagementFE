import React  from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AgGridTable = ({ rowData, columnDefs, onSortChange, onFilterChange, sortModel, ...props }) => {
  const onSortChanged = (event) => {
      onSortChange(event)
  }

  const onFilterChanged = (event) => {
      const filterModel = event.api.getFilterModel();
      onFilterChange(filterModel);
  };

  return (
      <div className="ag-theme-alpine">
          <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              domLayout="autoHeight"
              suppressPaginationPanel={true}
              onFilterChanged={onFilterChanged}
              onSortChanged={onSortChanged}
              sortModel={sortModel}
              {...props}
          />
      </div>
  );
};

export default AgGridTable;