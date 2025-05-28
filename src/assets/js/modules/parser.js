// Parser module for handling statistics parsing and data processing

// Constants
export const rowEnum = {
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

// Classes
class StatsIOInfo {
    constructor(rownumber, langText, table, scan, logical, physical, readahead, loblogical, lobphysical, lobreadahead) {
        this.rowtype = rowEnum.IO;
        this.rownumber = rownumber;
        this.table = table;
        this.nostats = false;
        this.scan = infoReplace(scan, langText.scan, '');
        this.logical = infoReplace(logical, langText.logical, '');
        this.physical = infoReplace(physical, langText.physical, '');
        this.readahead = infoReplace(readahead, langText.readahead, '');
        this.loblogical = infoReplace(loblogical, langText.loblogical, '');
        this.lobphysical = infoReplace(lobphysical, langText.lobphysical, '');
        this.lobreadahead = infoReplace(lobreadahead, langText.lobreadahead, '');
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
        this.readahead = 0;
        this.loblogical = 0;
        this.lobphysical = 0;
        this.lobreadahead = 0;
        this.percentread = 0.0;
    }
}

class StatsTimeInfo {
    constructor(cpu, elapsed, rowtype) {
        this.rowtype = rowtype;
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
    constructor(rowsaffected, label) {
        this.rowtype = rowEnum.RowsAffected;
        this.rowsaffected = rowsaffected;
        this.label = label;
    }
}

class ErrorInfo {
    constructor(text) {
        this.rowtype = rowEnum.Error;
        this.text = text;
    }
}

class TextInfo {
    constructor(text) {
        this.rowtype = rowEnum.Info;
        this.text = text;
    }
}

class CompletionTimeInfo {
    constructor(label, completiontime) {
        this.rowtype = rowEnum.CompletionTime;
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
function getIOTableData(line, lang) {
    const section = line.split('.');
    const tableName = getSubStr(section[0], '\'');
    const tableData = section[1];
    
    if (tableData == undefined) return null;
    
    const stat = tableData.split(/[,]+/);
    return new StatsIOInfo(0, lang, tableName, stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6]);
}

function getTimeData(line, cputime, elapsedtime, milliseconds, rowtype) {
    const section = line.split(',');
    const re = processTimeRegEx(cputime, milliseconds);
    const re2 = processTimeRegEx(elapsedtime, milliseconds);
    
    return new StatsTimeInfo(
        section[0].replace(re, "$2"),
        section[1].replace(re2, "$2"),
        rowtype
    );
}

function getRowsAffectedData(line, lang) {
    const re = new RegExp("\\d+");
    let affectedText = lang.headerrowsaffected;
    const numRows = re.exec(line);
    
    if (numRows === null) return null;
    
    if (numRows[0] === '1') {
        affectedText = lang.headerrowaffected;
    }
    return new RowsAffectedInfo(numRows[0], affectedText);
}

function getErrorData(line) {
    return new ErrorInfo(line);
}

function getTextInfo(line) {
    return new TextInfo(line);
}

function getCompletionTimeData(line, lang) {
    const label = lang.completiontimelabel;
    const completiontime = line.substring(label.length, line.length);
    return new CompletionTimeInfo(label, completiontime);
}

// Computation functions
function statsIOComputeTotal(statInfos) {
    const initial = new StatsIOInfoTotal();
    return statInfos.reduce((total, stat) => ({
        scan: total.scan + stat.scan,
        logical: total.logical + stat.logical,
        physical: total.physical + stat.physical,
        readahead: total.readahead + stat.readahead,
        loblogical: total.loblogical + stat.loblogical,
        lobphysical: total.lobphysical + stat.lobphysical,
        lobreadahead: total.lobreadahead + stat.lobreadahead,
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

function determineRowType(strRow, lang) {
    if (strRow.substring(0, lang.table.length) === lang.table) {
        return rowEnum.IO;
    } else if (strRow.trim() === lang.executiontime) {
        return rowEnum.ExecutionTime;
    } else if (strRow.trim() === lang.compiletime) {
        return rowEnum.CompileTime;
    } else if (strRow.indexOf(lang.rowsaffected) > -1) {
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
        readahead: statTotal.readahead + statInfo.readahead,
        loblogical: statTotal.loblogical + statInfo.loblogical,
        lobphysical: statTotal.lobphysical + statInfo.lobphysical,
        lobreadahead: statTotal.lobreadahead + statInfo.lobreadahead,
    };
}

/**
 * Parses the input text and returns structured data
 * @param {string} text - The text to parse
 * @param {Object} lang - Language object for text
 * @returns {Object} Parsed data object
 */
export function parseData(text, lang) {
    const lines = text.split('\n');
    let tableCount = 0;
    const executionTotal = new StatsTimeInfoTotal(rowEnum.ExecutionTimeTotal);
    const compileTotal = new StatsTimeInfoTotal(rowEnum.CompileTimeTotal);
    let tableIOGrandTotal = [];
    let prevRowType = rowEnum.None;
    const parsedData = { data: [] };
    let currentGroupObj = null;
    let rowNumber = 0;
    let rowData = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const rowType = determineRowType(line, lang);

        if (prevRowType === rowEnum.IO && rowType !== rowEnum.IO) {
            const tableTotal = statsIOComputeTotal(currentGroupObj.data);
            const tablePercent = statsIOComputePercentLogicalRead(currentGroupObj.data, tableTotal);
            currentGroupObj.total = tableTotal;
            currentGroupObj.data = tablePercent;
        }

        switch (rowType) {
            case rowEnum.IO:
                rowData = getIOTableData(line, lang);
                if (prevRowType !== rowEnum.IO) {
                    tableCount += 1;
                    rowNumber = 0;
                    currentGroupObj = {
                        rowtype: rowEnum.IO,
                        tableid: `resultTable_${tableCount}`,
                        data: [],
                        total: []
                    };
                    parsedData.data.push(currentGroupObj);
                }
                rowNumber += 1;
                rowData.rownumber = rowNumber;
                currentGroupObj.data.push(rowData);
                tableIOGrandTotal = statsIOProcessGrandTotal(tableIOGrandTotal, rowData);
                break;

            case rowEnum.ExecutionTime:
                i += 1;
                rowData = getTimeData(lines[i], lang.cputime, lang.elapsedtime, lang.milliseconds, rowEnum.ExecutionTime);
                if (rowData !== null) {
                    parsedData.data.push(rowData);
                    executionTotal.cpu += rowData.cpu;
                    executionTotal.elapsed += rowData.elapsed;
                }
                break;

            case rowEnum.CompileTime:
                i += 1;
                rowData = getTimeData(lines[i], lang.cputime, lang.elapsedtime, lang.milliseconds, rowEnum.CompileTime);
                if (rowData !== null) {
                    parsedData.data.push(rowData);
                    compileTotal.cpu += rowData.cpu;
                    compileTotal.elapsed += rowData.elapsed;
                }
                break;

            case rowEnum.RowsAffected:
                rowData = getRowsAffectedData(line, lang);
                if (rowData !== null) {
                    parsedData.data.push(rowData);
                }
                break;

            case rowEnum.Error:
                rowData = getErrorData(line);
                parsedData.data.push(rowData);
                i += 1;
                rowData = getErrorData(lines[i]);
                parsedData.data.push(rowData);
                break;

            case rowEnum.CompletionTime:
                rowData = getCompletionTimeData(line, lang);
                parsedData.data.push(rowData);
                break;

            default:
                rowData = getTextInfo(line);
                parsedData.data.push(rowData);
        }
        
        prevRowType = rowType;

        if (i === lines.length - 1 && rowType === rowEnum.IO) {
            const tableTotal = statsIOComputeTotal(currentGroupObj.data);
            const tablePercent = statsIOComputePercentLogicalRead(currentGroupObj.data, tableTotal);
            currentGroupObj.total = tableTotal;
            currentGroupObj.data = tablePercent;
        }
    }

    const tableIOGrandTotalTotalLine = statsIOComputeTotal(tableIOGrandTotal);
    tableIOGrandTotal = statsIOGrandTotalComputePercentLogicalRead(tableIOGrandTotal, tableIOGrandTotalTotalLine);

    parsedData.tablecount = tableCount;
    parsedData.total = {
        executiontotal: executionTotal,
        compiletotal: compileTotal,
        iototal: {
            data: tableIOGrandTotal,
            total: tableIOGrandTotalTotalLine,
            tableid: 'resultTableTotal'
        }
    };

    return parsedData;
}
