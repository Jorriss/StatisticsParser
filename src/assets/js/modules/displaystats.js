// Import dependencies
import { DateTime, Duration } from 'luxon';
import DataTable from 'datatables.net-dt';
import { parseData, rowEnum } from './parser.js';

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

function displayIOTableColumns(lang) {
    return [
        { 
            data: 'rownumber',
            title: lang.headerrownum,
            className: 'th-column column-small',
            orderable: true
        },
        { 
            data: 'table',
            title: lang.headertable,
            className: 'th-column',
            orderable: true
        },
        { 
            data: 'scan',
            title: lang.headerscan,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'logical',
            title: lang.headerlogical,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'physical',
            title: lang.headerphysical,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'readahead',
            title: lang.headerreadahead,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'loblogical',
            title: lang.headerloblogical,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'lobphysical',
            title: lang.headerlobphysical,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'lobreadahead',
            title: lang.headerlobreadahead,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue),
            orderable: true
        },
        { 
            data: 'percentread',
            title: lang.headerperlogicalread,
            className: 'th-column column-xlarge td-column-right',
            render: (data) => data + '%',
            orderable: true
        }
    ];
}

function displayIOTable(rowdata, columns, lang) {
    let data = rowdata.data;
    let total = rowdata.total;
    let tableId = rowdata.tableid;

    if (columns === undefined) {
        columns = displayIOTableColumns(lang);
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
    const footerCells = [
        { text: '', className: 'footer-column column-small' },
        { text: 'Total', className: 'footer-column' },
        { text: formatNumber(total.scan, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.logical, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.physical, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.readahead, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.loblogical, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: formatNumber(total.lobphysical, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: formatNumber(total.lobreadahead, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: '\u00A0', className: 'footer-column column-xlarge' }
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

function displayIOTotalTableColumns(lang) {
    return [
        { 
            data: 'table',
            title: lang.headertable,
            className: 'th-column'
        },
        { 
            data: 'scan',
            title: lang.headerscan,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'logical',
            title: lang.headerlogical,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'physical',
            title: lang.headerphysical,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'readahead',
            title: lang.headerreadahead,
            className: 'th-column column-large td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'loblogical',
            title: lang.headerloblogical,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'lobphysical',
            title: lang.headerlobphysical,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'lobreadahead',
            title: lang.headerlobreadahead,
            className: 'th-column column-medium td-column-right',
            render: (data) => formatNumber(data, lang.langvalue)
        },
        { 
            data: 'percentread',
            title: lang.headerperlogicalread,
            className: 'th-column column-xlarge td-column-right',
            render: (data) => data + '%'
        }
    ];
}

function displayIOTotalTable(rowdata, columns, lang) {
    let data = rowdata.data;
    let total = rowdata.total;
    let tableId = rowdata.tableid;

    if (columns === undefined) {
        columns = displayIOTableColumns(lang);
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
    const footerCells = [
        { text: 'Total', className: 'footer-column' },
        { text: formatNumber(total.scan, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.logical, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.physical, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.readahead, lang.langvalue), className: 'footer-column column-large td-column-right' },
        { text: formatNumber(total.loblogical, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: formatNumber(total.lobphysical, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: formatNumber(total.lobreadahead, lang.langvalue), className: 'footer-column column-medium td-column-right' },
        { text: '\u00A0', className: 'footer-column column-xlarge' }
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
    let columns = displayIOTableColumns(lang);

    for (let i = 0; i < parsedData.data.length; i++) {
        let rowData = parsedData.data[i];

        switch (rowData.rowtype) {
            case rowEnum.IO:
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

    outputElement.appendChild(displayTotalsHeader(lang));

    if (parsedData.tablecount > 0) { 
        let totalsColumns = displayIOTotalTableColumns(lang);
        outputElement.appendChild(displayIOTotalTable(parsedData.total.iototal, totalsColumns, lang));
        outputElement.appendChild(document.createElement('br'));
        createDataTable(parsedData.total.iototal.tableid, parsedData.total.iototal.data, totalsColumns, showScrollbar);
    }
    outputElement.appendChild(displayTimeTotalTable(parsedData.total.executiontotal, parsedData.total.compiletotal, lang));
} 