/**
 * Tamotsu(保つ) is an object-spreadsheet mapping library like ActiveRecord for google apps script.
 *
 * @see {@link https://github.com/itmammoth/Tamotsu}
 * @see {@link https://github.com/hiyo3/Tamotsu/tree/dev}
 *
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
 * /// @typedef {Object} Agent
 * /// @property {string} id
 * /// @property {string} firstName
 * /// @property {string} firstName
 *
 * /// @type {Tamotsu.ITable<Agent>}
 * var MyAgent = Tamotsu.Table.define({sheetName: 'Agents', idColumn: 'id' })
 *
 * /// @type {Tamotsu.IModel<Agent>}
 * var record = new MyAgent();
 * ```
 */
var Tamotsu = Tamotsu || {};

/**
 * Register the given function as a callback on initialized
 *
 * @param {(spreadsheet:GoogleAppsScript.Spreadsheet.Spreadsheet)=>void} callback A function that is to be added to the callback list.
 */
Tamotsu.onInitialized = Tamotsu.onInitialized || function (callback) { };

  /**
   * Initializes Tamotsu with the given objects
   *
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [spreadsheet] Spreadsheet object you will handle.
   *   When not given, `SpreadsheetApp.getActive()` is used.
   */
Tamotsu.initialize = Tamotsu.initialize || function (spreadsheet) { };

Tamotsu.Table = Tamotsu.Table || {};
/**
 * Generate a new `Tamotsu.Table` class object
 *
 * @template {Tamotsu.InstanceProperties} Type
 * @param {Tamotsu.ClassProperties} classProperties
 * @param {Type} instanceProperties
 * @return {Tamotsu.ITable<Type>} A new Table object
 */
Tamotsu.Table.define = Tamotsu.Table.define || function (classProperties, instanceProperties) { };

/**
 * @typedef {Object} Tamotsu.ClassProperties
 * @property {string} sheetName (required) Sheet name
 * @property {string} idColumn (required) ID column's name
 * @property {boolean} [autoIncrement=true] `true` when omitted
 * @property {number} [rowShift=0] `0` when omitted
 * @property {number} [columnShift=0] `0` when omitted
 * @property {boolean} [readBlank=false] `false` when omitted
 */
/**
 * @typedef {{[propName:string]: *, validate?:(on:'create'|'update')=>void}} Tamotsu.InstanceProperties
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {Object} Tamotsu._ITable
 * @property {number} rowShift
 * @property {number} columnShift
 * @property {string} idColumn
 * @property {()=>GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} baseRange
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} lastRange
 * @property {()=>Tamotsu.IModel<A>?} first
 * @property {()=>Tamotsu.IModel<A>?} last
 * @property {(id:string|number)=>Tamotsu.IModel<A>} find
 * @property {()=>Tamotsu.IModel<A>[]} all
 * @property {(column:string)=>[]} pluck
 * @property {(column:string)=>number} sum
 * @property {(column:string)=>number} max
 * @property {(column:string)=>number} min
 * @property {(predicate:A|((record:Tamotsu.IModel<A>)=>boolean))=>Tamotsu.ITableRelation<A>} where
 * @property {(comparator:string|((a:Tamotsu.IModel<A>, b:Tamotsu.IModel<A>)=>number))=>Tamotsu.ITableRelation<A>} order
 * @property {()=>string[]} columns
 * @property {(column:string)=>number} columnIndexOf
 * @property {(column:string)=>string} columnABCFor
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} dataRange
 * @property {(row_:number)=>GoogleAppsScript.Spreadsheet.Range} rangeByRow
 * @property {(values:[])=>A} objectFrom
 * @property {(record:Tamotsu.IModel<A>)=>[]} valuesFrom
 * @property {()=>[]} allValues
 * @property {(recordOrAttributes:A|Tamotsu.IModel<A>)=>false|Tamotsu.IModel<A>} create
 * @property {(recordOrAttributesArr:A[]|Tamotsu.IModel<A>[])=>false|Tamotsu.IModel<A>[]} batchCreate
 * @property {(recordOrAttributes:A|Tamotsu.IModel<A>)=>boolean} update
 * @property {(recordOrAttributes:A|Tamotsu.IModel<A>)=>boolean|Tamotsu.IModel<A>} createOrUpdate
 * @property {(record:Tamotsu.IModel<A>)=>void} destroy
 * @property {(callback:(nextId:number)=>void)=>void} withNextId
 * @property {()=>[]} idValues
 * @property {()=>number} idColumnIndex
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {new(attr:A)=>Tamotsu.IModel<A>} Tamotsu._IModelGen
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {Tamotsu._IModelGen<A> & Tamotsu._ITable<A>} Tamotsu.ITable
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {Object} Tamotsu.ITableRelation
 * @property {(predicate:A|((record:Tamotsu.IModel<A>)=>boolean))=>Tamotsu.ITableRelation<A>} where
 * @property {()=>Tamotsu.IModel<A>[]} all
 * @property {(comparator:string|((a:Tamotsu.IModel<A>, b:Tamotsu.IModel<A>)=>number))=>Tamotsu.ITableRelation<A>} order
 * @property {()=>Tamotsu.IModel<A>?} first
 * @property {()=>Tamotsu.IModel<A>?} last
 * @property {(column:string)=>[]} pluck
 * @property {(column:string)=>number} sum
 * @property {(column:string)=>number} max
 * @property {(column:string)=>number} min
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {Object} Tamotsu._IModel
 * @property {A} errors Stores errors after `validate()`
 * @property {()=>boolean|Tamotsu.IModel<A>} save
 * @property {(attributes:A)=>boolean|Tamotsu.IModel<A>} updateAttributes
 * @property {()=>void} destroy
 * @property {(on:'create'|'update')=>void} validate Test validity with current attributes; NOTE you need to assign it, see `Tamotsu.Table.define()` and `Tamotsu.InstanceProperties`.
 * @property {()=>boolean} isValid
 * @property {()=>boolean} isNewRecord
 * @property {()=>A} getAttributes
 * @property {(attributes:A)=>void} setAttributes
 */
/**
 * @template {{[propName:string]:*}} A Attributes
 * @typedef {A & Tamotsu._IModel<A>} Tamotsu.IModel
 */
