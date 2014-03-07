function includeExample(value) {
    var txt = document.getElementById("statiotext");
    if (value == true) {
        txt.value = "Table 'sysobjrdb'. Scan count 0, logical reads 200, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysschobjs'. Scan count 0, logical reads 2000, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'Worktable'. Scan count 0, logical reads 0, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysobjrdb'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'spt_values'. Scan count 1, logical reads 3, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysschobjs'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'Worktable'. Scan count 0, logical reads 0, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolpars'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolrdb'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolpars'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolpars'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolpars'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolrdb'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syscolpars'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysschobjs'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysclsobjs'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysidxstats'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'Worktable'. Scan count 0, logical reads 8, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysidxstats'. Scan count 1, logical reads 12, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'Worktable'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysclsobjs'. Scan count 0, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'Worktable'. Scan count 0, logical reads 0, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'syssingleobjrefs'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nNo foreign keys reference table 'Person', or you do not have permissions on referencing tables.\nTable 'sysobjvalues'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nTable 'sysmultiobjrefs'. Scan count 1, logical reads 2, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.\nNo views with schema binding reference table 'Person'.";
    } else {
        txt.value = "";
    }
}

function statsIOInfo(rownumber, langText, table, scan, logical, physical, readahead, loblogical, lobphysical, lobreadahead) {
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

function statsIOInfoTotal() {
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

function determineLang(strRow){
    var lang = 0;

    if (strRow.substring(0,7) == 'Table \'') { lang = 1; } // English
    else if (strRow.substring(0,7) == 'Tabla \'') { lang = 2; } // Spanish

    return lang;
}

function createLangText(langValue, langObj) {

    switch(langValue) {
        case 1: // English
            langObj.langValue = 1;
            langObj.table = 'Table \'';
            langObj.scan = 'Scan count ';
            langObj.logical = 'logical reads ';
            langObj.physical = 'physical reads ';
            langObj.readahead = 'read-ahead reads ';
            langObj.loblogical = 'lob logical reads ';
            langObj.lobphysical = 'lob physical reads ';
            langObj.lobreadahead = 'lob read-ahead reads ';
            langObj.headerrownum = 'Row Num';
            langObj.headertable = 'Table';
            langObj.headerscan = 'Scan Count';
            langObj.headerlogical = 'Logical Reads';
            langObj.headerphysical = 'Physical Reads';
            langObj.headerreadahead = 'Read-Ahead Reads';
            langObj.headerloblogical = 'LOB Logical Reads';
            langObj.headerlobphysical = 'LOB Physical Reads';
            langObj.headerlobreadahead = 'LOB Read-Ahead Reads';
            langObj.headerperlogicalread = '% Logical Reads of Total Reads';
            break;
        case 2: // Spanish
            langObj.langValue =  2;
            langObj.table = 'Tabla \'';
            langObj.scan = 'Recuento de exámenes ';
            langObj.logical = 'lecturas lógicas ';
            langObj.physical = 'lecturas físicas ';
            langObj.readahead = 'lecturas anticipadas ';
            langObj.loblogical = 'lecturas lógicas de LOB ';
            langObj.lobphysical = 'lecturas físicas de LOB ';
            langObj.headerrownum = 'Fila Número';
            langObj.headertable = 'Tabla';
            langObj.headerscan = 'Recuento de exámenes';
            langObj.headerlogical = 'Lecturas lógicas';
            langObj.headerphysical = 'Lecturas físicas';
            langObj.headerreadahead = 'Lecturas anticipadas';
            langObj.headerloblogical = 'Lecturas lógicas de LOB';
            langObj.headerlobphysical = 'Lecturas físicas de LOB';
            langObj.headerlobreadahead = 'Lecturas anticipadas de LOB';
            langObj.headerperlogicalread = '% Lecturas lógicas del Total de Lecturas';
            langObj.lobreadahead = 'lecturas anticipadas de LOB ';
            break;
    }
    //return langObj;
}

function infoReplace(strValue, searchValue, newvValue) {
    var returnValue = 0;
    if (strValue != undefined) {
        returnValue = parseInt(strValue.replace(searchValue, newvValue));
        if (isNaN(returnValue)) {
            returnValue = 0;
        }
    }
    return returnValue;
}

function determineTable(strRow, langText) {
    var isTable = false;

    if (langText.length == undefined) { 
        lang = determineLang(strRow); 
        createLangText(lang, langText);
    }

    if (strRow.substring(0,7) == langText.table) {
        isTable = true;
    }
    return isTable;
}

function processTableRow(line, tableResult, langText) {
    var section = line.split('\.');
    var tableName = getSubStr(section[0], '\'')
    var tableData = section[1];

    // If not a statistics IO statement then end table (if necessary) and write line ending in <br />
    // If prev line was not a statistics IO statement then start a table. 
    if (tableData != undefined) {
        if (tableData == '') {
            var statLineInfo = new statsIOInfo(tableResult.length + 1, langText, line);
            statLineInfo.nostats = true;
            tableResult.push(statLineInfo);
        }
        var stat = tableData.split(/[,]+/);
        var statInfo = new statsIOInfo(tableResult.length + 1, langText, tableName, stat[0], stat[1], stat[2], stat[3], stat[4], stat[5], stat[6]);
        tableResult.push(statInfo);
    } else {
        if (line.length > 0) {
            var statLineInfo = new statsIOInfo(tableResult.length + 1, langText, line);
            statLineInfo.nostats = true;
            tableResult.push(statLineInfo);
        }
    }
}

function parseText() {
    var txt = document.getElementById("statiotext").value;
    var lines = txt.split('\n');
    var tableResult = new Array();
    var tableCount = 0;
    var inTable = false;
    var formattedOutput = '';
    var langText = new Object();

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        var isRowTable = determineTable(line, langText);
        if (isRowTable == true){
            if (inTable == true) {
                processTableRow(line, tableResult, langText);
            } else {
                tableCount += 1;
                inTable = true;
                processTableRow(line, tableResult, langText);
            }
        } else {
            if (inTable == true) {
                inTable = false;
                formattedOutput += outputTable(tableResult, statsIOCalcTotals(tableResult), tableCount, langText);
                tableResult = new Array();
            } 
            formattedOutput += '<span>' + line + '<br /></span>';
        }

    }

    // if last row a table then call formatOutput
    if (inTable == true) {
        formattedOutput += outputTable(tableResult, statsIOCalcTotals(tableResult), tableCount, langText);
    }

    document.getElementById("result").innerHTML = formattedOutput;
    document.getElementById("clearButton").innerHTML  = 'Clear Results';

    //Apply datatables plugin
    for (var counter = 1; counter <= tableCount; counter++) {
        $('#resultTable' + counter).dataTable({
            "sDom": "t",
            "bFilter": false,
            "bPaginate": false,
            "aoColumns": [
                { "sType": "formatted-num", "sClass": "td-column-right" },
                null,
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" },
                { "sType": "formatted-num", "sClass": "td-column-right" }
            ]
        });
    }
}

function statsIOCalcTotals(statInfos) {
    var statTotal = new statsIOInfoTotal();

    for (var i = 0; i < statInfos.length; i++) {
        statTotal.scan += statInfos[i].scan;
        statTotal.logical += statInfos[i].logical;
        statTotal.physical += statInfos[i].physical;
        statTotal.readahead += statInfos[i].readahead;
        statTotal.loblogical += statInfos[i].loblogical;
        statTotal.lobphysical += statInfos[i].lobphysical;
        statTotal.lobreadahead += statInfos[i].lobreadahead;
    }
    calcPercent(statInfos, statTotal);
    return statTotal;
}

function calcPercent(statInfos, statTotal) {
    for (var i = 0; i < statInfos.length; i++) {
        statInfos[i].percentread = ((statInfos[i].logical / statTotal.logical) * 100).toFixed(3);
        //statInfos[i].percentread += statInfos[i].percentread.toString() + '%';
    }
}

 function outputTable(statInfo, statTotal, tableNumber, langObj) {
    var result = '<table id="resultTable' + tableNumber +'" class="table table-striped table-hover table-condensed" style="table-layout:fixed">';
    result += '<thead><tr>';
    result += '<th width="30" class="th-column">' + langObj.headerrownum + '</th>';
    result += '<th class="th-column">' + langObj.headertable + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerscan + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerlogical + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerphysical + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerreadahead + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerloblogical + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerlobphysical + '</th>';
    result += '<th width="50" class="th-column">' + langObj.headerlobreadahead + '</th>';
    result += '<th width="75" class="th-column">' + langObj.headerperlogicalread + '</th>';
    result += '</tr></thead>';
    result += '<tbody>';
    for (var i = 0; i < statInfo.length; i++) {
        result += '<tr>';

        result += '<td>' + statInfo[i].rownumber + '</td>';
        result += '<td>' + statInfo[i].table + '</td>';
        if (statInfo[i].nostats) {
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
            result += '<td></td>';
        } else {
            result += '<td>' + numeral(statInfo[i].scan).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].logical).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].physical).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].readahead).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].loblogical).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].lobphysical).format('0,0') + '</td>';
            result += '<td>' + numeral(statInfo[i].lobreadahead).format('0,0') + '</td>';
            result += '<td>' + statInfo[i].percentread + '</td>';
        }
        result += '</tr>';
    }
    result += '</tbody>';
    result += '<tfoot><tr>';
    result += '<td class="footer-column"></td>';
    result += '<td class="footer-column">Total</td>';
    result += '<td class="footer-column">' + numeral(statTotal.scan).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.logical).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.physical).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.readahead).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.loblogical).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.lobphysical).format('0,0') + '</td>';
    result += '<td class="footer-column">' + numeral(statTotal.lobreadahead).format('0,0') + '</td>';
    result += '<td class="footer-column">&nbsp;</td>';
    result += '</tr></tfoot>';

    result += '</table>'

    return result;
}

function getSubStr(str, delim) {
    var a = str.indexOf(delim);

    if (a == -1)
        return '';

    var b = str.indexOf(delim, a + 1);

    if (b == -1)
        return '';

    return str.substr(a + 1, b - a - 1);
}

function clearResult() {
    if (document.getElementById("result").innerHTML != '') {
        document.getElementById("result").innerHTML = '';
    } else {
       document.getElementById("statiotext").value = '';
       document.getElementById("exampleCheck").checked = false;
    }
    document.getElementById("clearButton").innerHTML = 'Clear Text';
}

