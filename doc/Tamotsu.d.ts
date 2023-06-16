/**
 * Tamotsu(保つ) is an object-spreadsheet mapping library like ActiveRecord for google apps script.
 *
 * @see {@link https://github.com/itmammoth/Tamotsu}
 * @see {@link https://github.com/hiyo3/Tamotsu/tree/dev}
 *
 * @example
 * ```js
 * // Initialize first
 * Tamotsu.initialize();
 *
 * // Define a table class
 * const Agent = Tamotsu.Table.define({ sheetName: 'Agents' });
 * const newAgent = new Agent();
 * newAgent['First Name'] = 'Adam';
 * newAgent.save();
 *
 * // You can define a new Tamotsu.Model type
 * // so your editor suggests record properties.
 * // NOTE prop names must match the column names in the spreadsheet.
 *
 * var Agent = Object.assign(function Agent(){}, {prototype: {id: '', firstName: '', lastName: ''}})
 * // or `class Agent { id; firstName; lastName; }`
 * // MyAgent's type can be set as {Tamotsu.ITable<Agent>}
 * var MyAgent = Tamotsu.Table.define({sheetName: 'Agents', idColumn: 'id' })
 *
 * /// record's type is {Tamotsu.IModel<Agent>}
 * var record = new MyAgent();
 * ```
 */
declare namespace Tamotsu {
  /**
   * Register the given function as a callback on initialized
   *
   * @param {(spreadsheet:GoogleAppsScript.Spreadsheet.Spreadsheet)=>void} callback A function that is to be added to the callback list.
   */
  export function onInitialized(
    callback: (spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) => void
  ): void;

  /**
   * Initializes Tamotsu with the given objects
   *
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [spreadsheet] Spreadsheet object you will handle.
   *   When not given, `SpreadsheetApp.getActive()` is used.
   */
  export function initialize(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ): void;

  export namespace Table {
    /**
     * Generate a new `Tamotsu.Table` class object
     *
     * @template {Object|Tamotsu.InstanceProperties} T
     * @param {Tamotsu.ClassProperties} classProps
     * @param {T} instanceProps
     * @return {Tamotsu.ITable<T>} A new Table object
     */
    export function define<T>(
      classProps: Tamotsu.ClassProperties,
      instanceProps: T
    ): Tamotsu.ITable<T>;
  }

  export type ClassProperties = {
    sheetName: string;
    idColumn: string;
    autoIncrement?: boolean;
    rowShift?: number;
    columnShift?: number;
    readBlank?: boolean;
  };

  export type InstanceProperties = {
    [propName: string]: any;
    validate?: (on: 'create' | 'update') => void;
  };

  export type ITable<T extends Object|Tamotsu.InstanceProperties>  = {
    rowShift: number;
    columnShift: number;
    idColumn: string;
    sheet: () => GoogleAppsScript.Spreadsheet.Spreadsheet;
    baseRange: () => GoogleAppsScript.Spreadsheet.Range;
    lastRange: () => GoogleAppsScript.Spreadsheet.Range;
    first: () => Tamotsu.IModel<T> | null;
    last: () => Tamotsu.IModel<T> | null;
    find: (id: any) => Tamotsu.IModel<T>;
    all: () => Tamotsu.IModel<T>[];
    pluck: (columnName: keyof T) => [];
    sum: (columnName: keyof T) => number;
    max: (columnName: keyof T) => number;
    min: (columnName: keyof T) => number;
    where: (
      predicate: T | ((record: Tamotsu.IModel<T>) => boolean)
    ) => Tamotsu.ITableRelation<T>;
    order: (
      comparator:
        | string
        | ((a: Tamotsu.IModel<T>, b: Tamotsu.IModel<T>) => number)
    ) => Tamotsu.ITableRelation<T>;
    columns: () => string[];
    columnIndexOf: (columnName: keyof T) => number;
    columnABCFor: (columnName: keyof T) => string;
    dataRange: () => GoogleAppsScript.Spreadsheet.Range;
    rangeByRow: (row_: number) => GoogleAppsScript.Spreadsheet.Range;
    objectFrom: (values: []) => T;
    valuesFrom: (record: Tamotsu.IModel<T>) => [];
    allValues: () => [];
    create: (
      recordOrAttributes: T | Tamotsu.IModel<T>
    ) => false | Tamotsu.IModel<T>;
    batchCreate: (
      recordOrAttributesArr: T[] | Tamotsu.IModel<T>[]
    ) => false | Tamotsu.IModel<T>[];
    update: (recordOrAttributes: T | Tamotsu.IModel<T>) => boolean;
    createOrUpdate: (
      recordOrAttributes: T | Tamotsu.IModel<T>
    ) => boolean | Tamotsu.IModel<T>;
    destroy: (record: Tamotsu.IModel<T>) => void;
    withNextId: (callback: (nextId: number) => void) => void;
    idValues: () => [];
    idColumnIndex: () => number;

    new (attributes?: T): Tamotsu.IModel<T>;
  }


  export type ITableRelation<T extends Object|Tamotsu.InstanceProperties> = {
    where: (
      predicate: T | ((record: Tamotsu.IModel<T>) => boolean)
    ) => Tamotsu.ITableRelation<T>;
    all: () => Tamotsu.IModel<T>[];
    order: (
      comparator:
        | string
        | ((a: Tamotsu.IModel<T>, b: Tamotsu.IModel<T>) => number)
    ) => Tamotsu.ITableRelation<T>;
    first: () => Tamotsu.IModel<T> | null;
    last: () => Tamotsu.IModel<T> | null;
    pluck: (columnName: keyof T) => [];
    sum: (columnName: keyof T) => number;
    max: (columnName: keyof T) => number;
    min: (columnName: keyof T) => number;
  }

  export type IModel<T extends Object|Tamotsu.InstanceProperties> = T & {
    errors: {[P in keyof T]: string};
    save: () => boolean | Tamotsu.IModel<T>;
    updateAttributes: (attributes: T) => boolean | Tamotsu.IModel<T>;
    destroy: () => void;
    validate: (on: 'create' | 'update') => void;
    isValid: () => boolean;
    isNewRecord: () => boolean;
    getAttributes: () => T;
    setAttributes: (attributes: T) => void;
  }
}