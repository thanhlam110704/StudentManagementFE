import type { GridApi } from "ag-grid-community";
import _ from 'lodash';

export interface SortModel {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

export interface FilterModel {
    field: string;
    value: string;
    operator: string;
}

export const getFilterModel = (gridApi: GridApi): Array<FilterModel> => {
    const filterModel = gridApi.getFilterModel();

    const filters: FilterModel[] = _.flatMap(filterModel, (filterValue, field): FilterModel[] => {
        if (filterValue.filterType === 'date') {
            const dateFilters: FilterModel[] = [];

            if (filterValue.dateFrom) {
                dateFilters.push({
                    field,
                    value: filterValue.dateFrom,
                    operator: filterValue.type === 'inRange' ? 'greaterThanOrEqual' : filterValue.type 
                });
            }
    
            // Handle 'dateTo' filter
            if (filterValue.dateTo) {
                dateFilters.push({
                    field,
                    value: filterValue.dateTo,
                    operator: filterValue.type === 'inRange' ? 'lessThanOrEqual' : 'lessThanOrEqual' 
                });
            }
    
            return dateFilters;
        }
        else if (filterValue.filterType === 'number' && filterValue.type === 'inRange') {
            const numberFilters: FilterModel[] = [];

            if (filterValue.filter !== undefined && filterValue.filter !== null) {
                numberFilters.push({
                    field,
                    value: filterValue.filter.toString(),
                    operator: 'greaterThanOrEqual'
                });
            }
            if (filterValue.filterTo !== undefined && filterValue.filterTo !== null) {
                numberFilters.push({
                    field,
                    value: filterValue.filterTo.toString(),
                    operator: 'lessThanOrEqual'
                });
            }

            return numberFilters;
        }
        else {
            return [{
                field,
                value: filterValue.filter,
                operator: filterValue.type
            }];
        }
    });

    const validFilters: FilterModel[] = _.filter(filters, filter =>
        !_.isNil(filter.value) && filter.value !== ''
    );

    return validFilters;
};
