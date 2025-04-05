import _ from 'lodash';

export const getFilterModel = (gridApi) => {
    const filterModel = gridApi.getFilterModel();

    const filters = _.flatMap(filterModel, (filterValue, field) => {
        if (filterValue.filterType === 'date') {
            const dateFilters = [];

            if (filterValue.dateFrom) {
                dateFilters.push({
                    field,
                    value: filterValue.dateFrom,
                    operator: filterValue.type === 'inRange' ? 'greaterThanOrEqual' : filterValue.type
                });
            }
            if (filterValue.dateTo) {
                dateFilters.push({
                    field,
                    value: filterValue.dateTo,
                    operator: filterValue.type === 'inRange' ? 'lessThanOrEqual' : 'lessThanOrEqual'
                });
            }

            return dateFilters;
        } else if (filterValue.filterType === 'number') {
            const numberFilters = [];

            if (filterValue.filter !== undefined && filterValue.filter !== null) {
                numberFilters.push({
                    field,
                    value: filterValue.filter.toString(),
                    operator: filterValue.type
                });
            }
            if (filterValue.type === 'inRange') {
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
            }

            return numberFilters;
        } else {
            return {
                field,
                value: filterValue.filter,
                operator: filterValue.type
            };
        }
    });

    const validFilters = _.filter(filters, filter =>
        !_.isNil(filter.value) && filter.value !== ''
    );

    return validFilters;
};
