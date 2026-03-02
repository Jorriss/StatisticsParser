// Parser module for handling statistics parsing and data processing

// Constants
const rowEnum = {
    None: 0,
    IO: 1,
    ExecutionTime: 2,
    CompileTime: 3,
    RowsAffected: 4,
    Error: 5,
    IOTotal: 6,
    ExecutionTimeTotal: 7,
    CompileTimeTotal: 8,
    Info: 9,
    CompletionTime: 10
};

const columnIOEnum = {
    NotFound: 0,
    Table: 1,
    Scan: 2,
    Logical: 3,
    Physical: 4,
    PageServer: 5,
    ReadAhead: 6,
    PageServerReadAhead: 7,
    LobLogical: 8,
    LobPhysical: 9,
    LobPageServer: 10,
    LobReadAhead: 11,
    LobPageServerReadAhead: 12,
    PercentRead: 13,
    SegmentReads: 14,
    SegmentSkipped: 15
}

// Classes
class StatsIOInfo {
    constructor(rownumber, linenumber) {
        this.rowtype = rowEnum.IO;
        this.rownumber = rownumber;
        this.linenumber = linenumber;
        this.table = '';
        this.nostats = false;
        this.scan = 0;
        this.logical = 0;
        this.physical = 0;
        this.pageserver = 0;
        this.readahead = 0;
        this.pageserverreadahead = 0;
        this.loblogical = 0;
        this.lobphysical = 0;
        this.lobpageserver = 0;
        this.lobreadahead = 0;
        this.lobpageserverreadahead = 0;
        this.segmentreads = 0;
        this.segmentskipped = 0;
        this.percentread = 0.0;
    }
}

class StatsIOInfoTotal {
    constructor() {
        this.rowtype = rowEnum.IOTotal;
        this.rownumber = 0;
        this.table = '';
        this.scan = 0;
        this.logical = 0;
        this.physical = 0;
        this.pageserver = 0;
        this.readahead = 0;
        this.pageserverreadahead = 0;
        this.loblogical = 0;
        this.lobphysical = 0;
        this.lobpageserver = 0;
        this.lobreadahead = 0;
        this.lobpageserverreadahead = 0;
        this.segmentreads = 0;
        this.segmentskipped = 0;
        this.percentread = 0.0;
    }
}

class StatsTimeInfo {
    constructor(linenumber, cpu, elapsed, rowtype) {
        this.rowtype = rowtype;
        this.linenumber = linenumber;
        this.summary = false;
        this.cpu = parseInt(cpu);
        this.elapsed = parseInt(elapsed);
    }
}

class StatsTimeInfoTotal {
    constructor(rowtype) {
        this.rowtype = rowtype;
        this.cpu = 0;
        this.elapsed = 0;
    }
}

class RowsAffectedInfo {
    constructor(linenumber, rowsaffected, label) {
        this.rowtype = rowEnum.RowsAffected;
        this.linenumber = linenumber;
        this.rowsaffected = rowsaffected;
        this.label = label;
    }
}

class ErrorInfo {
    constructor(linenumber, text) {
        this.rowtype = rowEnum.Error;
        this.linenumber = linenumber;
        this.text = text;
    }
}

class TextInfo {
    constructor(linenumber, text) {
        this.rowtype = rowEnum.Info;
        this.linenumber = linenumber;
        this.text = text;
    }
}

class CompletionTimeInfo {
    constructor(linenumber, label, completiontime) {
        this.rowtype = rowEnum.CompletionTime;
        this.linenumber = linenumber;
        this.label = label;
        this.completiontime = completiontime;
    }
}

// Utility functions
function infoReplace(strValue, searchValue, newValue) {
    let returnValue = 0;
    if (strValue != undefined) {
        returnValue = parseInt(strValue.replace(searchValue, newValue));
        if (isNaN(returnValue)) {
            returnValue = 0;
        }
    }
    return returnValue;
}

function processTimeRegEx(preText, postText) {
    return new RegExp("(.*" + preText + "+)(.*?)(\\s+" + postText + ".*)");
}

function getSubStr(str, delim) {
    const a = str.indexOf(delim);
    if (a == -1) return '';

    const b = str.indexOf(delim, a + 1);
    if (b == -1) return '';

    return str.substr(a + 1, b - a - 1);
}

// Data processing functions

function getIOColumnEnum(columnname, lang) {
    const columnName = columnname.trim().toLowerCase();

    if (lang.table.includes(columnName)) {
        return columnIOEnum.Table;
    }

    if (lang.scan.includes(columnName)) {
        return columnIOEnum.Scan;
    }

    if (lang.logical.includes(columnName)) {
        return columnIOEnum.Logical;
    }

    if (lang.physical.includes(columnName)) {
        return columnIOEnum.Physical;
    }

    if (lang.readahead.includes(columnName)) {
        return columnIOEnum.ReadAhead;
    }

    if (lang.pageserver.includes(columnName)) {
        return columnIOEnum.PageServer;
    }

    if (lang.pageserverreadahead.includes(columnName)) {
        return columnIOEnum.PageServerReadAhead;
    }

    if (lang.loblogical.includes(columnName)) {
        return columnIOEnum.LobLogical;
    }

    if (lang.lobphysical.includes(columnName)) {
        return columnIOEnum.LobPhysical;
    }

    if (lang.lobreadahead.includes(columnName)) {
        return columnIOEnum.LobReadAhead;
    }

    if (lang.lobpageserver.includes(columnName)) {
        return columnIOEnum.LobPageServer;
    }

    if (lang.lobpageserverreadahead.includes(columnName)) {
        return columnIOEnum.LobPageServerReadAhead;
    }

    if (lang.segmentreads.includes(columnName)) {
        return columnIOEnum.SegmentReads;
    }

    if (lang.segmentskipped.includes(columnName)) {
        return columnIOEnum.SegmentSkipped;
    }

    return columnIOEnum.NotFound;
}

function parseIOStatLine(line, lang) {
    // Match pattern: Table 'TableName'. Rest of stats...
    const tableMatch = line.match(new RegExp(`${lang.table}\\s+['"]([^']+)['"]`));
    const tableName = tableMatch ? tableMatch[1] : '';
    const statsText = line.substring(line.indexOf('.') + 1).trim();

    return {
        table: tableName,
        statstext: statsText
    }
}

function mergeIOColumns(tablecolumns, linecolumns) {
    // Create a new array with the values from tablecolumns
    const mergedColumns = [...tablecolumns];
    // Add items from linecolumns that are not already in tablecolumns
    for (const col of linecolumns) {
        if (!mergedColumns.includes(col)) {
            mergedColumns.push(col);
        }
    }
    return mergedColumns;
}

function determineIOColumns(line, lang) {
    const statLine = parseIOStatLine(line, lang);

    const result = statLine.statstext
    .replace(/\.$/, '') // Remove trailing period
    .split(', ')
    .map(segment => {
      const match = segment.match(/(.+?) (\d+)$/);
      if (match) {
        return {
          column: getIOColumnEnum(match[1], lang),
          value: parseInt(match[2], 10)
        };
      }
      return {
        column: columnIOEnum.NotFound,
        value: 0
      };
    });

    return {
        columns: [columnIOEnum.Table, ...result.map(r => r.column)],
        values: [statLine.table, ...result.map(r => r.value)]
    };
}

function deterineIOValues(line, lang) {
    const statLine = parseIOStatLine(line, lang);

    const result = statLine.statstext
    .replace(/\.$/, '') // Remove trailing period
    .split(', ')
    .map(segment => {
      const match = segment.match(/(.+?) (\d+)$/);
      if (match) {
        return {
            value: parseInt(match[2], 10)
        };
      }
      return {
        value: 0
      };
    });

    return [statLine.table, ...result.map(r => r.value), 0]
}

function loadStatsIOInfo(linenumber, rownumber, columns, values, lang) {
    const stat = new StatsIOInfo(rownumber, linenumber);

    for (let i = 0; i < columns.length; i++) {
        if (i < 0 || i >= values.length) {
            // Index Out Of Range
            return stat;
        }

        const column = columns[i];
        const value = values[i];
            
        switch (column) {
            case columnIOEnum.Table:
                stat.table = value;
                break;
            case columnIOEnum.Scan:
                stat.scan = value;
                break;
            case columnIOEnum.Logical:
                stat.logical = value;
                break;
            case columnIOEnum.Physical:
                stat.physical = value;
                break;
            case columnIOEnum.PageServer:
                stat.pageserver = value;
                break;
            case columnIOEnum.ReadAhead:
                stat.readahead = value;
                break;
            case columnIOEnum.PageServerReadAhead:
                stat.pageserverreadahead = value;
                break;
            case columnIOEnum.LobLogical:
                stat.loblogical = value;
                break;
            case columnIOEnum.LobPhysical:
                stat.lobphysical = value;
                break;
            case columnIOEnum.LobReadAhead:
                stat.lobreadahead = value;
                break;
            case columnIOEnum.LobPageServer:
                stat.lobpageserver = value;
                break;
            case columnIOEnum.LobPageServerReadAhead:
                stat.lobpageserverreadahead = value;
                break;
            case columnIOEnum.PercentRead:
                stat.percentread = value;
                break;
            case columnIOEnum.SegmentReads:
                stat.segmentreads = value;
                break;
            case columnIOEnum.SegmentSkipped:
                stat.segmentskipped = value;
                break;
        }
    }

    return stat;
}

function getStatsIOInfo(linenumber, rownumber, line, columns, lang) {
    const values = deterineIOValues(line, lang);
    return loadStatsIOInfo(linenumber, rownumber, columns, values, lang);
}

function getTimeData(linenumber, line, cputime, elapsedtime, milliseconds, rowtype) {
    const section = line.split(',');
    const re = processTimeRegEx(cputime, milliseconds);
    const re2 = processTimeRegEx(elapsedtime, milliseconds);
    
    return new StatsTimeInfo(
        linenumber,
        section[0].replace(re, "$2"),
        section[1].replace(re2, "$2"),
        rowtype
    );
}

function getRowsAffectedData(linenumber, line, lang) {
    const re = new RegExp("\\d+");
    let affectedText = lang.headerrowsaffected;
    const numRows = re.exec(line);
    
    if (numRows === null) return null;
    
    if (numRows[0] === '1') {
        affectedText = lang.headerrowaffected;
    }
    return new RowsAffectedInfo(linenumber, numRows[0], affectedText);
}

function getErrorData(linenumber, line) {
    return new ErrorInfo(linenumber, line);
}

function getTextInfo(linenumber, line) {
    return new TextInfo(linenumber, line);
}

function getCompletionTimeData(linenumber, line, lang) {
    const label = lang.completiontimelabel;
    const completiontime = line.substring(label.length, line.length);
    return new CompletionTimeInfo(linenumber, label, completiontime);
}

// Computation functions
function statsIOComputeTotal(statInfos) {
    const initial = new StatsIOInfoTotal();
    return statInfos.reduce((total, stat) => ({
        scan: total.scan + stat.scan,
        logical: total.logical + stat.logical,
        physical: total.physical + stat.physical,
        pageserver: total.pageserver + stat.pageserver,
        readahead: total.readahead + stat.readahead,
        pageserverreadahead: total.pageserverreadahead + stat.pageserverreadahead,
        loblogical: total.loblogical + stat.loblogical,
        lobphysical: total.lobphysical + stat.lobphysical,
        lobpageserver: total.lobpageserver + stat.lobpageserver,
        lobreadahead: total.lobreadahead + stat.lobreadahead,
        lobpageserverreadahead: total.lobpageserverreadahead + stat.lobpageserverreadahead,
        segmentreads: total.segmentreads + stat.segmentreads,
        segmentskipped: total.segmentskipped + stat.segmentskipped,
    }), initial);
}

function statsIOComputePercentLogicalRead(statInfos, statTotal) {
    return statInfos.map(stat => ({
        ...stat,
        percentread: statTotal.logical > 0
            ? ((stat.logical / statTotal.logical) * 100).toFixed(3)
            : '0.000'
    }));
}

function statsIOGrandTotalComputePercentLogicalRead(statInfos, statTotal) {
    return [...statInfos]
        .sort((a, b) => a.table.localeCompare(b.table))
        .map(stat => ({
            ...stat,
            percentread: statTotal.logical > 0
                ? ((stat.logical / statTotal.logical) * 100).toFixed(3)
                : '0.000'
        }));
}

function determineSummaryRow(timedata, executionTotal, compileTotal) {

    if (timedata.cpu === 0 && timedata.elapsed === 0) {
        return false;
    }

    const cpuTotal = executionTotal.cpu + compileTotal.cpu;
    const elapsedTotal = executionTotal.elapsed + compileTotal.elapsed;

    const elapsedmin = Math.max(0, elapsedTotal - 5);

    if (timedata.elapsed >= elapsedmin && timedata.elapsed <= elapsedTotal + 5) {
        if (cpuTotal == timedata.cpu) {
            return true;
        } 
    }
    return false;
}

function determineRowsAffected(line, langrowsaffected) {
    let returnvalue = false;
    for (let i = 0; i < langrowsaffected.length; i++) {
        if (line.indexOf(langrowsaffected[i]) > -1) {
            returnvalue = true;
            break;
        }
    }
    return returnvalue;
}

function determineRowType(strRow, lang) {
    if (strRow.trim().substring(0, lang.table.length) === lang.table) {
        return rowEnum.IO;
    } else if (strRow.trim() === lang.executiontime) {
        return rowEnum.ExecutionTime;
    } else if (strRow.trim() === lang.compiletime) {
        return rowEnum.CompileTime;
    } else if (determineRowsAffected(strRow, lang.rowsaffected)) {
        return rowEnum.RowsAffected;
    } else if (strRow.substring(0, 3) === lang.errormsg) {
        return rowEnum.Error;
    } else if (strRow.substring(0, lang.completiontimelabel.length) === lang.completiontimelabel) {
        return rowEnum.CompletionTime;
    }
    return rowEnum.None;
}

function statsIOProcessGrandTotal(tableIOResultTotal, statInfo) {
    const rowToAdd = { ...statInfo, rownumber: tableIOResultTotal.length + 1 };
    const index = tableIOResultTotal.findIndex(row => row.table === rowToAdd.table);

    if (index !== -1) {
        return tableIOResultTotal.map((row, i) =>
            i === index ? statsIOComputeGrandTotal(row, rowToAdd) : row
        );
    }

    return [...tableIOResultTotal, rowToAdd];
}

function statsIOComputeGrandTotal(statTotal, statInfo) {
    return {
        ...statTotal,
        scan: statTotal.scan + statInfo.scan,
        logical: statTotal.logical + statInfo.logical,
        physical: statTotal.physical + statInfo.physical,
        pageserver: statTotal.pageserver + statInfo.pageserver,
        readahead: statTotal.readahead + statInfo.readahead,
        pageserverreadahead: statTotal.pageserverreadahead + statInfo.pageserverreadahead,
        loblogical: statTotal.loblogical + statInfo.loblogical,
        lobphysical: statTotal.lobphysical + statInfo.lobphysical,
        lobpageserver: statTotal.lobpageserver + statInfo.lobpageserver,
        lobreadahead: statTotal.lobreadahead + statInfo.lobreadahead,
        lobpageserverreadahead: statTotal.lobpageserverreadahead + statInfo.lobpageserverreadahead,
        segmentreads: statTotal.segmentreads + statInfo.segmentreads,
        segmentskipped: statTotal.segmentskipped + statInfo.segmentskipped,
    };
}

/**
 * Parses the input text and returns structured data
 * @param {string} text - The text to parse
 * @param {Object} lang - Language object for text
 * @returns {Object} Parsed data object
 */
function parseData(text, lang) {
    const lines = text.split('\n').map(line => line.replace(/\r$/, ''));
    let tableCount = 0;
    const executionTotal = new StatsTimeInfoTotal(rowEnum.ExecutionTimeTotal);
    const compileTotal = new StatsTimeInfoTotal(rowEnum.CompileTimeTotal);
    let tableIOGrandTotal = [];
    let prevRowType = rowEnum.None;
    const parsedData = { data: [] };
    let currentGroupObj = null;
    let rowNumber = 0;
    let rowData = null;
    let ioColumns = [];
    let ioTotalColumns = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const rowType = determineRowType(line, lang);

        if (prevRowType === rowEnum.IO && rowType !== rowEnum.IO) {
            const tableTotal = statsIOComputeTotal(currentGroupObj.data);
            const tablePercent = statsIOComputePercentLogicalRead(currentGroupObj.data, tableTotal);
            currentGroupObj.total = tableTotal;
            currentGroupObj.data = tablePercent;

            ioColumns = [...ioColumns, columnIOEnum.PercentRead];
            currentGroupObj.columns = ioColumns;
            ioTotalColumns = mergeIOColumns(ioTotalColumns, ioColumns);
        }

        switch (rowType) {
            case rowEnum.IO:
                let values = null;
                
                if (prevRowType !== rowEnum.IO) {
                    rowNumber = 0;
                    ioColumns = [];
                    
                    currentGroupObj = {
                        rowtype: rowEnum.IO,
                        tableid: `resultTable_${tableCount}`,
                        columns: [],
                        data: [],
                        total: []
                    };
                    parsedData.data.push(currentGroupObj);
                }

                const lineData = determineIOColumns(line, lang);
                ioColumns = mergeIOColumns(ioColumns, lineData.columns);
                values = lineData.values;

                tableCount += 1;
                rowNumber += 1;
                rowData = loadStatsIOInfo(i, rowNumber, lineData.columns, values, lang);

                console.log(i);
                console.log(rowData)

                // If the row has segment reads or skipped, add the values to the last row in the current group
                if (rowData.segmentreads > 0 || rowData.segmentskipped > 0) {
                    currentGroupObj.data[currentGroupObj.data.length - 1].segmentreads = rowData.segmentreads;
                    currentGroupObj.data[currentGroupObj.data.length - 1].segmentskipped = rowData.segmentskipped;
                } else {
                    currentGroupObj.data.push(rowData);
                }

                tableIOGrandTotal = statsIOProcessGrandTotal(tableIOGrandTotal, rowData);

                break;

            case rowEnum.ExecutionTime:
                i += 1;
                rowData = getTimeData(i, lines[i], lang.cputime, lang.elapsedtime, lang.milliseconds, rowEnum.ExecutionTime);
                if (rowData !== null) {
                    const isSummary = determineSummaryRow(rowData, executionTotal, compileTotal);
                    rowData.summary = isSummary;

                    if (!isSummary) {
                        executionTotal.cpu += rowData.cpu;
                        executionTotal.elapsed += rowData.elapsed;
                    }
                    parsedData.data.push(rowData);
                }
                break;

            case rowEnum.CompileTime:
                i += 1;
                rowData = getTimeData(i, lines[i], lang.cputime, lang.elapsedtime, lang.milliseconds, rowEnum.CompileTime);
                if (rowData !== null) {
                    parsedData.data.push(rowData);
                    compileTotal.cpu += rowData.cpu;
                    compileTotal.elapsed += rowData.elapsed;
                }
                break;

            case rowEnum.RowsAffected:
                rowData = getRowsAffectedData(i, line, lang);
                if (rowData !== null) {
                    parsedData.data.push(rowData);
                }
                break;

            case rowEnum.Error:
                rowData = getErrorData(i, line);
                parsedData.data.push(rowData);
                i += 1;
                rowData = getErrorData(i, lines[i]);
                parsedData.data.push(rowData);
                break;

            case rowEnum.CompletionTime:
                rowData = getCompletionTimeData(i, line, lang);
                parsedData.data.push(rowData);
                break;

            default:
                rowData = getTextInfo(i, line);
                parsedData.data.push(rowData);
        }
        
        prevRowType = rowType;

        if (i === lines.length - 1 && rowType === rowEnum.IO) {
            const tableTotal = statsIOComputeTotal(currentGroupObj.data);
            const tablePercent = statsIOComputePercentLogicalRead(currentGroupObj.data, tableTotal);
            currentGroupObj.total = tableTotal;
            currentGroupObj.data = tablePercent;

            ioColumns = [...ioColumns, columnIOEnum.PercentRead];
            currentGroupObj.columns = ioColumns;
            ioTotalColumns = mergeIOColumns(ioTotalColumns, ioColumns);
        }
    }

    const tableIOGrandTotalTotalLine = statsIOComputeTotal(tableIOGrandTotal);
    tableIOGrandTotal = statsIOGrandTotalComputePercentLogicalRead(tableIOGrandTotal, tableIOGrandTotalTotalLine);

    parsedData.tablecount = tableCount;
    parsedData.total = {
        executiontotal: executionTotal,
        compiletotal: compileTotal,
        iototal: {
            columns: ioTotalColumns,
            data: tableIOGrandTotal,
            total: tableIOGrandTotalTotalLine,
            tableid: 'resultTableTotal'
        }
    };
    console.log(JSON.stringify(parsedData, null, 2));
    return parsedData;
}

export {
    parseData,
    rowEnum,
    columnIOEnum
}
