// Import dependencies
import { DateTime, Duration } from 'luxon';
import DataTable from 'datatables.net-dt';
import { rowEnum, columnIOEnum } from './parser.js';

// Display functionality
function formatNumber(value, langvalue = 'en') {
    return new Intl.NumberFormat(langvalue).format(value);
}

function formatMs(milliseconds) {
    try {
        return Duration.fromMillis(milliseconds)
            .toFormat("hh:mm:ss.SSS");
    } catch (error) {
        console.error('Error formatting duration:', error);
        return '00:00:00.000';
    }
}

function formatExtendedTimestamp(text, locale = 'en') {
    // Extract the fractional seconds and offset manually
    const match = text.match(/^(.+T\d{2}:\d{2}:\d{2})\.(\d+)([+-]\d{2}:\d{2})$/);

    if (match) {
        const [_, baseISO, fractional, offset] = match;

        // Rebuild a valid ISO string with only milliseconds for Luxon parsing
        const truncatedISO = `${baseISO}.${fractional.substring(0, 3)}${offset}`;
        const dt = DateTime.fromISO(truncatedISO).setLocale(locale);
    
        // Format date parts using Luxon with locale
        const datePart = dt.toLocaleString({
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    
        const timePart = dt.toFormat('HH:mm:ss');
    
        // Rebuild final string
        return `${datePart} ${timePart}.${fractional} ${offset}`;
        
    } else {
        return text;
    }
}

function createDataTable(tableid, data, columns, showScrollbar = false) {
    return new DataTable(`#${tableid}`, {
        data: data,
        columns: columns,
        dom: 't',
        ordering: true,
        searching: false,
        paging: false,
        scrollY: showScrollbar ? '200px' : false,
        scrollCollapse: showScrollbar ? true : false,
        order: [[0, 'asc']] // Default sort by row number
    });
}

function displayInfo(text) {
    let lineOutput = document.createElement('span');
    lineOutput.textContent = text;
    lineOutput.appendChild(document.createElement('br'));
    return lineOutput;
}

function displayIOTableColumns(columns, showRowNumber, lang) {
    let displayColumns = [];

    if (showRowNumber) {
        displayColumns.push(
            { 
                data: 'rownumber',
                title: lang.headerrownumber,
                className: 'th-column column-small',
                orderable: true
            }
        );
    }

    for (let i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case columnIOEnum.Table:
                displayColumns.push(
                    { 
                        data: 'table',
                        title: lang.headertable,
                        className: 'th-column',
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.Scan:
                displayColumns.push(
                    { 
                        data: 'scan',
                        title: lang.headerscan,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.Logical:
                displayColumns.push(
                    { 
                        data: 'logical',
                        title: lang.headerlogical,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.Physical:
                displayColumns.push(        
                    { 
                        data: 'physical',
                        title: lang.headerphysical,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.PageServer:
                displayColumns.push(
                    { 
                        data: 'pageserver',
                        title: lang.headerpageserver,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.ReadAhead:
                displayColumns.push(
                    { 
                        data: 'readahead',
                        title: lang.headerreadahead,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.PageServerReadAhead:
                displayColumns.push(
                    { 
                        data: 'pageserverreadahead',
                        title: lang.headerpageserverreadahead,
                        className: 'th-column column-large td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.LobLogical:
                displayColumns.push(
                    { 
                        data: 'loblogical',
                        title: lang.headerloblogical,
                        className: 'th-column column-medium td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break; 
            case columnIOEnum.LobPhysical:
                displayColumns.push(     
                    { 
                        data: 'lobphysical',
                        title: lang.headerlobphysical,
                        className: 'th-column column-medium td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.LobPageServer:
                displayColumns.push(     
                    { 
                        data: 'lobpageserver',
                        title: lang.headerlobpageserver,
                        className: 'th-column column-medium td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.LobReadAhead:
                displayColumns.push(
                    { 
                        data: 'lobreadahead',
                        title: lang.headerlobreadahead,
                        className: 'th-column column-medium td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.LobPageServerReadAhead:
                displayColumns.push(
                    { 
                        data: 'lobpageserverreadahead',
                        title: lang.headerlobpageserverreadahead,
                        className: 'th-column column-medium td-column-right',
                        render: (data) => formatNumber(data, lang.langvalue),
                        orderable: true
                    }
                );
                break;
            case columnIOEnum.PercentRead:
                displayColumns.push(
                    { 
                        data: 'percentread',
                        title: lang.headerperlogicalread,
                        className: 'th-column column-xlarge td-column-right',
                        render: (data) => data + '%',
                        orderable: true
                    }            
                );
                break;
            default:
                break;
        }
    }
    
    return displayColumns;
}

function displayIOTableFooter(total, columns, showRowNumber, lang) {
    const footerData = [];

    if (showRowNumber) {
        footerData.push({ text: '', className: 'footer-column column-small' });
    }

    for (let i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case columnIOEnum.Table:
                footerData.push({ text: 'Total', className: 'footer-column' });
                break;
            case columnIOEnum.Scan:
                footerData.push({ text: formatNumber(total.scan, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.Logical:
                footerData.push({ text: formatNumber(total.logical, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.Physical:
                footerData.push({ text: formatNumber(total.physical, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.PageServer:
                footerData.push({ text: formatNumber(total.pageserver, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.ReadAhead:
                footerData.push({ text: formatNumber(total.readahead, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.PageServerReadAhead:
                footerData.push({ text: formatNumber(total.pageserverreadahead, lang.langvalue), className: 'footer-column column-large td-column-right' });
                break;
            case columnIOEnum.LobLogical:
                footerData.push({ text: formatNumber(total.loblogical, lang.langvalue), className: 'footer-column column-medium td-column-right' });
                break;
            case columnIOEnum.LobPhysical:
                footerData.push({ text: formatNumber(total.lobphysical, lang.langvalue), className: 'footer-column column-medium td-column-right' });
                break;
            case columnIOEnum.LobReadAhead:
                footerData.push({ text: formatNumber(total.lobreadahead, lang.langvalue), className: 'footer-column column-medium td-column-right' });
                break;
            case columnIOEnum.LobPageServer:
                footerData.push({ text: formatNumber(total.lobpageserver, lang.langvalue), className: 'footer-column column-medium td-column-right' });
                break;
            case columnIOEnum.LobPageServerReadAhead:
                footerData.push({ text: formatNumber(total.lobpageserverreadahead, lang.langvalue), className: 'footer-column column-medium td-column-right' });
                break;
            case columnIOEnum.PercentRead:
                footerData.push({ text: '\u00A0', className: 'footer-column column-xlarge' });
                break;
            default:
                footerData.push({ text: '', className: 'footer-column column-small' });
                break;
        }
    }

    return footerData;
}

function displayIOTable(rowdata, columns, lang) {
    let data = rowdata.data;
    let total = rowdata.total;
    let tableId = rowdata.tableid;

    if (columns === undefined) {
        columns = displayIOTableColumns(rowdata.columns, true, lang);
    }
    
    // Create table element with header
    const table = document.createElement('table');
    table.id = tableId;
    table.className = 'table table-striped table-hover table-condensed';
    
    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add header cells
    columns.forEach(column => {
        const th = document.createElement('th');
        th.className = column.className || '';
        th.textContent = column.title;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create tbody
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    // Create tfoot for totals
    const tfoot = document.createElement('tfoot');
    const footerRow = document.createElement('tr');
    
    // Create and append footer cells
    const footerCells = displayIOTableFooter(total, rowdata.columns, true, lang);

    footerCells.forEach(cell => {
        const td = document.createElement('td');
        td.className = cell.className;
        td.textContent = cell.text;
        footerRow.appendChild(td);
    });

    tfoot.appendChild(footerRow);
    table.appendChild(tfoot);

    return table;
}

function displayTimeTable(data, lang) {
    const columns = [
        { 
            data: lang.executiontime,
            title: '',
            headerClassName: 'th-column td-column-timetype',
            className: 'td-column-timetype'
        },
        { 
            data: formatMs(data.cpu),
            title: lang.cpulabel,
            headerClassName: 'th-column td-column-right',
            className: 'td-column-right'
        },
        { 
            data: formatMs(data.elapsed),
            title: lang.elapsedlabel,
            headerClassName: 'th-column td-column-right',
            className: 'td-column-right'
        }
    ];
    
    // Create table element with header
    const table = document.createElement('table');
    table.className = 'table table-striped table-hover table-condensed table-nonfluid';
    
    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add header cells
    columns.forEach(column => {
        const th = document.createElement('th');
        th.className = column.headerClassName || '';
        th.textContent = column.title;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create tbody
    const tbody = document.createElement('tbody');
    const bodyRow = document.createElement('tr');

    columns.forEach(column => {
        const td = document.createElement('td');
        td.className = column.className || '';
        td.textContent = column.data;
        bodyRow.appendChild(td);
    });

    tbody.appendChild(bodyRow);
    table.appendChild(tbody);
    
    if (data.summary) {
        const tfoot = document.createElement('tfoot');
        const footerRow = document.createElement('tr');
    
        const td = document.createElement('td');
        td.className = 'footer-column';
        td.colSpan = 3;  // or 3 for time tables
        td.textContent = 'Summary row detectd. Row not added to total.';
        footerRow.appendChild(td);
    
        tfoot.appendChild(footerRow);
        table.appendChild(tfoot);    
    }
    
    return table;
}

function displayRowsAffected(data, lang) {
    let output = document.createElement('div');
    output.className = 'strong-text';
    output.textContent = formatNumber(data.rowsaffected, lang.langvalue) + data.label;
    return output;
}

function displayError(text) {
    let output = document.createElement('div');
    output.className = 'error-text';
    output.textContent = text;
    return output;
}

function displayTotalsHeader(lang) {
    let output = document.createElement('h4');
    output.textContent = lang.totals;
    return output;
}

function displayCompletionTime(data, lang) {
    let output = document.createElement('div');
    output.className = 'strong-text';
    output.textContent = data.label + ' ' + formatExtendedTimestamp(data.completiontime, lang.langvalue);
    return output;
}

function displayIOTotalTable(rowdata, columns, lang) {
    let total = rowdata.total;
    let tableId = rowdata.tableid;

    if (columns === undefined) {
        columns = displayIOTableColumns(rowdata.columns, false, lang);
    }
    
    // Create table element with header
    const table = document.createElement('table');
    table.id = tableId;
    table.className = 'table table-striped table-hover table-condensed';
    
    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add header cells
    columns.forEach(column => {
        const th = document.createElement('th');
        th.className = column.className || '';
        th.textContent = column.title;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create tbody
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    // Create tfoot for totals
    const tfoot = document.createElement('tfoot');
    const footerRow = document.createElement('tr');
    
    // Create and append footer cells
    const footerCells = displayIOTableFooter(total, rowdata.columns, false, lang);

    footerCells.forEach(cell => {
        const td = document.createElement('td');
        td.className = cell.className;
        td.textContent = cell.text;
        footerRow.appendChild(td);
    });

    tfoot.appendChild(footerRow);
    table.appendChild(tfoot);

    return table;
}

function displayTimeTotalTable(executiondata, compiledata, lang) {
    // Convert to Luxon Duration for calculations
    const cpuTotal = Duration.fromMillis(parseInt(compiledata.cpu))
        .plus(Duration.fromMillis(parseInt(executiondata.cpu)))
        .toMillis();
    
    const elapsedTotal = Duration.fromMillis(parseInt(compiledata.elapsed))
        .plus(Duration.fromMillis(parseInt(executiondata.elapsed)))
        .toMillis();

    const columns = [
        { 
            data: 'type',
            title: '',
            headerClassName: 'th-column td-column-timetype',
            className: 'td-column-timetype'
        },
        { 
            data: 'cpu',
            title: lang.cpulabel,
            headerClassName: 'th-column td-column-right',
            className: 'td-column-right'
        },
        { 
            data: 'elapsed',
            title: lang.elapsedlabel,
            headerClassName: 'th-column td-column-right',
            className: 'td-column-right'
        }
    ];

    const data = [
        {
            type: lang.compiletime,
            cpu: formatMs(compiledata.cpu),
            elapsed: formatMs(compiledata.elapsed)
        },
        {
            type: lang.executiontime,
            cpu: formatMs(executiondata.cpu),
            elapsed: formatMs(executiondata.elapsed)
        }
    ];
    
    // Create table element with header
    const table = document.createElement('table');
    table.className = 'table table-striped table-hover table-condensed table-nonfluid';
    
    // Create thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add header cells
    columns.forEach(column => {
        const th = document.createElement('th');
        th.className = column.headerClassName || '';
        th.textContent = column.title;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create tbody
    const tbody = document.createElement('tbody');
    
    // Add data rows
    data.forEach(rowData => {
        const bodyRow = document.createElement('tr');
        columns.forEach(column => {
            const td = document.createElement('td');
            td.className = column.className || '';
            td.textContent = rowData[column.data];
            bodyRow.appendChild(td);
        });
        tbody.appendChild(bodyRow);
    });
    
    table.appendChild(tbody);
    
    // Create tfoot for totals
    const tfoot = document.createElement('tfoot');
    const footerRow = document.createElement('tr');
    
    // Create and append footer cells
    const footerCells = [
        { text: 'Total', className: 'td-total td-column-timetype' },
        { text: formatMs(cpuTotal), className: 'td-total td-column-right' },
        { text: formatMs(elapsedTotal), className: 'td-total td-column-right' }
    ];

    footerCells.forEach(cell => {
        const td = document.createElement('td');
        td.className = cell.className;
        td.textContent = cell.text;
        footerRow.appendChild(td);
    });

    tfoot.appendChild(footerRow);
    table.appendChild(tfoot);
    
    return table;
}

export function displayParsedData(parsedData, showScrollbar, lang) {
    let outputElement = document.getElementById('result');

    for (let i = 0; i < parsedData.data.length; i++) {
        let rowData = parsedData.data[i];

        switch (rowData.rowtype) {
            case rowEnum.IO:
                let columns = displayIOTableColumns(rowData.columns, true, lang);
                let table = displayIOTable(rowData, columns, lang);
                outputElement.appendChild(table);
                createDataTable(rowData.tableid, rowData.data, columns, showScrollbar);
                break;
            case rowEnum.ExecutionTime:
                outputElement.appendChild(displayTimeTable(rowData, lang));
                break;
            case rowEnum.CompileTime:
                outputElement.appendChild(displayTimeTable(rowData, lang));
                break;
            case rowEnum.RowsAffected:
                outputElement.appendChild(displayRowsAffected(rowData, lang));
                break;
            case rowEnum.Error:
                outputElement.appendChild(displayError(rowData.text));
                break;
            case rowEnum.CompletionTime:
                outputElement.appendChild(displayCompletionTime(rowData, lang));
                break;
            case rowEnum.Info:
            default:
                let lineOutput = displayInfo(rowData.text);
                outputElement.appendChild(lineOutput);
        }
    }

    const tablebr = document.createElement('br');
    outputElement.appendChild(tablebr);
    outputElement.appendChild(displayTotalsHeader(lang));

    if (parsedData.tablecount > 0) { 
        let totalsColumns = displayIOTableColumns(parsedData.total.iototal.columns, false, lang);
        outputElement.appendChild(displayIOTotalTable(parsedData.total.iototal, totalsColumns, lang));
        outputElement.appendChild(document.createElement('br'));
        createDataTable(parsedData.total.iototal.tableid, parsedData.total.iototal.data, totalsColumns, showScrollbar);
    }
    outputElement.appendChild(displayTimeTotalTable(parsedData.total.executiontotal, parsedData.total.compiletotal, lang));
} 