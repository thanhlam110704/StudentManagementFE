import { ITextFilterParams, IDateFilterParams, INumberFilterParams } from "ag-grid-community";

// TEXT FILTER
export const textFilterParams: ITextFilterParams = {
    filterOptions: ["contains", "equals", "startsWith", "endsWith"],
    buttons: ["apply", "reset"],
    trimInput: true,
    maxNumConditions: 1,
    debounceMs: 2000
};

// DATE FILTER
export const dateFilterParams: IDateFilterParams = {
    filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
    buttons: ["apply", "reset"],
    maxNumConditions: 1,
    debounceMs: 2000,
};

// NUMBER FILTER
export const numberFilterParams: INumberFilterParams = {
    filterOptions: ["equals", "greaterThan", "lessThan", "inRange"],
    buttons: ["apply", "reset"],
    maxNumConditions: 1,
    debounceMs: 2000
};
