/**
 * Test Tamotsu.gs
 */
function testTamotsuModule() {
  // Sheets for tests
  const values = [
    ['#', 'Name', 'Note'],
    [1, 'Taro Yamada', 'N/A'],
    [2, 'Hanako Yamada', ''],
    [null, null, null],
    [4, 'Shiro Sato', 'Follows empty row']
  ];
  const testSs1 = SpreadsheetApp.create('Test Tamotsu Module 1');
  testSs1.getSheets()[0].setName('User1').getRange(1, 1, values.length, values[0].length).setValues(values);
  const testSs2 = SpreadsheetApp.create('Test Tamotsu Module 2');
  testSs2.getSheets()[0].setName('User2').getRange(2, 2, values.length, values[0].length).setValues(values);

  try {
    // GasT Initialization. (only if not initialized yet.)
    // https://github.com/huan/gast
    if (typeof GasTap === 'undefined') {
      const url =
      'https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js';
      eval(UrlFetchApp.fetch(url).getContentText());
    }

    const testRunner = new GasTap();

    testRunner('loading', (t) => {
      t.equal(typeof Tamotsu, 'object', 'Tamotsu is defined');
      t.equal(typeof Tamotsu.initialize, 'function', 'Tamotsu.initialize is defined');
      t.equal(typeof Tamotsu.onInitialized, 'function', 'Tamotsu.onInitialized is defined');
      t.equal(typeof Tamotsu.Table, 'undefined', 'Tamotsu.Table is not defined');
    });

    testRunner('Tamotsu.initialize(ss)', (t) => {
      Tamotsu.initialize(testSs1);
      t.equal(typeof Tamotsu.Table, 'function', 'Tamotsu.Table is defined');
      t.equal(typeof Tamotsu.Table.define, 'function', 'Tamotsu.Table.define is defined');
    });

    testRunner('Tamotsu.initialize(ss) with callback', (t) => {
      let status = 'not ready';
      Tamotsu.onInitialized(function(ss) {
        status = 'ready with ' + ss.getId();
      });
      Tamotsu.initialize(testSs1);
      t.equal(status, 'ready with ' + testSs1.getId(), 'onInitialized callback is called');
    });

    testRunner('Table.define() with more than one spreadsheets', (t) => {
      Tamotsu.initialize(testSs1);
      const table1 = Tamotsu.Table.define({sheetName: 'User1'});

      Tamotsu.initialize(testSs2);
      const table2 = Tamotsu.Table.define({sheetName: 'User2'});

      t.equal(table1.sheet().getParent().getId(), testSs1.getId(), 'Table object keeps correct sheet object');
      t.equal(table2.sheet().getParent().getId(), testSs2.getId(), 'Table object keeps correct sheet object');
    });

    testRunner('Table.dataRange() by readBlank', (t) => {
      Tamotsu.initialize(testSs1);
      const table1 = Tamotsu.Table.define({sheetName: 'User1'});
      const table1_readBlank = Tamotsu.Table.define({sheetName: 'User1', readBlank: true});

      Tamotsu.initialize(testSs2);
      const table2 = Tamotsu.Table.define({sheetName: 'User2', rowShift: 1, columnShift: 1});
      const table2_readBlank = Tamotsu.Table.define({sheetName: 'User2', rowShift: 1, columnShift: 1, readBlank: true});

      t.equal(table1.dataRange().getA1Notation(), 'A1:C3', 'Table object reads correct data range');
      t.equal(table1_readBlank.dataRange().getA1Notation(), 'A1:C5', 'Table object reads correct data range');
      t.equal(table2.dataRange().getA1Notation(), 'B2:D4', 'Table object reads correct data range');
      t.equal(table2_readBlank.dataRange().getA1Notation(), 'B2:D6', 'Table object reads correct data range');
    });

    testRunner('Table.all() and Relation_.all()', (t) => {
      Tamotsu.initialize(testSs1);
      const table1 = Tamotsu.Table.define({sheetName: 'User1'});
      const table1_readBlank = Tamotsu.Table.define({sheetName: 'User1', readBlank: true});

      Tamotsu.initialize(testSs2);
      const table2 = Tamotsu.Table.define({sheetName: 'User2', rowShift: 1, columnShift: 1});
      const table2_readBlank = Tamotsu.Table.define({sheetName: 'User2', rowShift: 1, columnShift: 1, readBlank: true});
      
      const row_ = (record) => record.row_;
      const any = (record) => true;
      t.equal(table1.all().map(row_).join(', '), table1.where(any).all().map(row_).join(', '), 'Row objects refer to the same range');
      t.equal(table1_readBlank.all().map(row_).join(', '), table1_readBlank.where(any).all().map(row_).join(', '), 'Row objects refer to the same range');
      t.equal(table2.all().map(row_).join(', '), table2.where(any).all().map(row_).join(', '), 'Row objects refer to the same range');
      t.equal(table2_readBlank.all().map(row_).join(', '), table2_readBlank.where(any).all().map(row_).join(', '), 'Row objects refer to the same range');
    })

    testRunner.finish();
  } catch (error) {
    console.error(error);
  }

  DriveApp.getFileById(testSs1.getId()).setTrashed(true);
  DriveApp.getFileById(testSs2.getId()).setTrashed(true);
}
