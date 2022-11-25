/**
 * Tamotsu(保つ) is an object-spreadsheet mapping library like ActiveRecord for google apps script.
 *
 * https://github.com/itmammoth/Tamotsu
 *
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
 * /// @typedef {Tamotsu.Model & Agent} MyAgent
 *
 * var MyAgent = Tamotsu.Table.define({sheetName: 'Agents', idColumn: 'id' })
 * /// @type {MyAgent}
 * var record = new MyAgent();
 * record.firstName = 'your editor suggests props :)';
 * ```
 * @see {@link https://github.com/hiyo3/Tamotsu/tree/dev}
 */
var Tamotsu = Tamotsu || {};
/**
 * Register the given function as a callback on initialized
 * @param {(spreadsheet:GoogleAppsScript.Spreadsheet.Spreadsheet)=>{}} callback A function that is to be added to the callback list.
 */
Tamotsu.onInitialized = Tamotsu.onInitialized || function (callback) {};
/**
 * Initializes Tamotsu with the given objects
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [spreadsheet] Spreadsheet object you will handle.
 *   When not given, `SpreadsheetApp.getActive()` is used.
 */
Tamotsu.initialize = Tamotsu.initialize || function (spreadsheet) {};
Tamotsu.Table = Tamotsu.Table || {};
/**
 * Generate a new `Tamotsu.Table` class object
 * @param {Tamotsu.ClassProperties} classProperties
 * @param {Tamotsu.InstanceProperties} instanceProperties
 * @return {Tamotsu.Table}
 */
Tamotsu.Table.define = Tamotsu.Table.define ||
  function (classProperties, instanceProperties) { };

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
 * @typedef {Object} Tamotsu.InstanceProperties
 * @property {(on:['create'|'update'])=>void} validate (optional) Validation callback that resturns `true` when valid
 */
/**
 * @typedef {Object} Tamotsu.Table
 * @property {number} rowShift
 * @property {number} columnShift
 * @property {string} idColumn
 * @property {()=>GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} baseRange
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} lastRange
 * @property {()=>Tamotsu.Model} first
 * @property {()=>Tamotsu.Model} last
 * @property {(id:*)=>Tamotsu.Model?} find
 * @property {()=>Tamotsu.Model[]} all
 * @property {(column:string)=>[]} pluck
 * @property {(column:string)=>number} sum
 * @property {(column:string)=>number} max
 * @property {(column:string)=>number} min
 * @property {(predicate:(record:Tamotsu.Model)=>boolean|Object)=>Tamotsu.Table} where
 * @property {(comparator:string|(a, b)=>number)=>Tamotsu.Table} order
 * @property {()=>string[]} columns
 * @property {(column:string)=>number} columnIndexOf
 * @property {(column:string)=>string} columnABCFor
 * @property {()=>GoogleAppsScript.Spreadsheet.Range} dataRange
 * @property {(row_:number)=>GoogleAppsScript.Spreadsheet.Range} rangeByRow
 * @property {(values:[])=>Tamotsu.Model} objectFrom
 * @property {(record:Tamotsu.Model)=>[]} valuesFrom
 * @property {()=>[]} allValues
 * @property {(recordOrAttributes:Tamotsu.Model|Object)=>false|Tamotsu.Model} create
 * @property {(recordOrAttributesArr:Tamotsu.Model[]|Object[])=>false|Tamotsu.Model[]} batchCreate
 * @property {(recordOrAttributes:Tamotsu.Model|Object)=>boolean} update
 * @property {(recordOrAttributes:Tamotsu.Model|Object)=>boolean|Tamotsu.Model} createOrUpdate
 * @property {(record:Tamotsu.Model)=>void} destroy
 * @property {(callback:(nextId:number)=>void)=>void} withNextId
 * @property {()=>[]} idValues
 * @property {()=>number} idColumnIndex
 */
/**
 * @typedef {Object} Tamotsu.Model
 * @property {Object.<string, string>} errors Stores errors after `validate()`
 * @property {()=>boolean|Tamotsu.Model} save
 * @property {(attributes:Object)=>boolean|Tamotsu.Model} updateAttributes
 * @property {()=>void} destroy
 * @property {(on:['create'|'update'])=>void} validate Test validity with current attributes; NOTE you need to assign it, see `Tamotsu.Table.define()` and `Tamotsu.InstanceProperties`.
 * @property {()=>boolean} isValid
 * @property {()=>boolean} isNewRecord
 * @property {()=>Object} getAttributes
 * @property {(attributes:Object)=>void} setAttributes
 */
