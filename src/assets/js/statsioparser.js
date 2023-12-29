
function includeExample(value, lang) {
    var txt = document.getElementById("statiotext");
    if (value == true) {
        txt.value = lang.sampleoutput;
    } else {
        txt.value = "";
    }
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

function toggleCheckmark(checkmarkSpan, cookieKey) {
    if($.cookies.get(cookieKey) === true) {
        $.cookies.set(cookieKey, "false");
        checkmarkSpan.style.display = 'none';
    } else {
        $.cookies.set(cookieKey, "true");
        checkmarkSpan.style.display = '';
    }
}

var rowEnum = {
    None: 0,
    IO: 1,
    ExectuionTime: 2,
    CompileTime: 3,
    RowsAffected: 4,
    Error: 5
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

function statsTimeInfo(cpu, elapsed) {
    this.cpu = parseInt(cpu);
    this.elapsed = parseInt(elapsed);
}

function statsTimeInfoTotal() {
    this.cpu = 0;
    this.elapsed = 0;
}

function determineLang(strRow){
    var lang = 1;

    if (strRow.substring(0,7) === 'Table \'') { lang = 1; } // English
    else if (strRow.substring(0, 7) === 'Tabla \'') { lang = 2; } // Spanish
    else if ($.trim(strRow.substring(0, 6)) === 'Tiempo') { lang = 2; } // Spanish
    else if ($.trim(strRow.substring(0, 7)) === 'Tiempos') { lang = 2; } // Spanish

    return lang;
}

function determineLangFilename (langType) {
    var filename;
    switch(langType) {
        case 'en': // English
            filename = 'assets/data/languagetext-en.json'
            break;
        case 'es': // Spanish
            filename = 'assets/data/languagetext-es.json'
            break;
        default :
            filename = 'assets/data/languagetext-en.json'
            break;
    }
    return filename;
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

function determineRowType(strRow, langText) {
    var rowType = rowEnum.None;

    if (strRow.substring(0, 7) === langText.table) {
        rowType = rowEnum.IO;
    } else if ($.trim(strRow) === langText.executiontime) {
        rowType = rowEnum.ExectuionTime;
    } else if ($.trim(strRow) === langText.compiletime) {
        rowType = rowEnum.CompileTime;
    } else if (strRow.indexOf(langText.rowsaffected) > -1) {
        rowType = rowEnum.RowsAffected;
    } else if (strRow.substring(0,3) === langText.errormsg) {
        rowType = rowEnum.Error;
    }

    return rowType;
}

function processTimeRegEx(preText, postText) {
    var re = new RegExp("(.*" + preText + "+)(.*?)(\\s+" + postText + ".*)");

    return re
}

function processTime(line, cputime, elapsedtime, milliseconds) {
    var section = line.split(',');

    var re = processTimeRegEx(cputime, milliseconds);
    var re2 = processTimeRegEx(elapsedtime, milliseconds);

    return new statsTimeInfo(section[0].replace(re, "$2"), section[1].replace(re2, "$2"))
}

function processIOTableRow(line, tableResult, langText) {
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

function parseOutput(txt, lang) {
    //var txt = document.getElementById("statiotext").value;
    var lines = txt.split('\n');
    var tableIOResult = new Array();
    var executionTotal = new statsTimeInfoTotal();
    var compileTotal = new statsTimeInfoTotal();
    var tableCount = 0;
    var inTable = false;
    var isExecution = false;
    var isCompile = false;
    var isError = false;
    var formattedOutput = '';

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        if (isExecution === false && isCompile === false && isError === false) {
            var rowType = determineRowType(line, lang);
        }

        switch (rowType) {
            case rowEnum.IO:
                if (inTable === true) {
                    processIOTableRow(line, tableIOResult, lang);
                } else {
                    tableCount += 1;
                    inTable = true;
                    processIOTableRow(line, tableIOResult, lang);
                }
                break;
            case rowEnum.ExectuionTime:
                if (isExecution === true) {
                    var et = processTime(line, lang.cputime, lang.elapsedtime, lang.milliseconds);
                    formattedOutput += outputTimeTable(et, lang.executiontime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel)
                    executionTotal.cpu += et.cpu;
                    executionTotal.elapsed += et.elapsed
                } else {
                    //formattedOutput += '<span>' + line + '<br /></span>';
                }
                isExecution = !isExecution;
                break;
            case rowEnum.CompileTime:
                if (isCompile === true) {
                    var ct = processTime(line, lang.cputime, lang.elapsedtime, lang.milliseconds);
                    formattedOutput += outputTimeTable(ct, lang.compiletime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel)
                    compileTotal.cpu += ct.cpu;
                    compileTotal.elapsed += ct.elapsed
                } else {
                    //formattedOutput += '<span>' + line + '<br /></span>';
                }
                isCompile = !isCompile;
                break;
            case rowEnum.RowsAffected:
                var re = new RegExp("\\d+");
                var affectedText = lang.headerrowsaffected;
                var numRows;
                if ((numRows = re.exec(line)) !== null) {
                    if (numRows[0] === 1) { 
                        affectedText = lang.headerrowaffected;
                    }           
                    formattedOutput += '<div class="strong-text">' + numeral(numRows[0]).format('0,0') + affectedText + '</div>';
                }
                break;
            case rowEnum.Error:
                isError = (isError === false ? true : false);
                formattedOutput += '<div class="error-text">' + line + '</div>'
                break;
            default:
                if (inTable === true) {
                    inTable = false;
                    formattedOutput += outputIOTable(tableIOResult, statsIOCalcTotals(tableIOResult), tableCount, lang);
                    tableIOResult = new Array();
                }
                formattedOutput += '<span>' + line + '<br /></span>';
        }

    }

    // if last row a table then call formatOutput
    if (inTable == true) {
        formattedOutput += outputIOTable(tableIOResult, statsIOCalcTotals(tableIOResult), tableCount, lang);
    }

    formattedOutput += '<h4>Totals:</h4>'
    formattedOutput += outputTimeTableTotals(executionTotal, compileTotal, lang.compiletime, lang.executiontime, lang.milliseconds, lang.elapsedlabel, lang.cpulabel);

    return {output: formattedOutput, tableCount: tableCount}
}

function parseText(lang) {

    var formattedOutput = parseOutput( document.getElementById("statiotext").value, lang);

    document.getElementById("result").innerHTML = formattedOutput.output;
    document.getElementById("clearButton").innerHTML  = 'Clear Results';

    //Apply datatables plugin
    for (var counter = 1; counter <= formattedOutput.tableCount; counter++) {
        if($.cookies.get("tableScrollbar") == true) {
        $('#resultTable' + counter).dataTable({
            "sDom": "t",
            "bFilter": false,
            "bPaginate": false,
            "sScrollY": "200px",
            "bScrollCollapse": false,
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
        } else {
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

function formatms (milliseconds) {
    return moment.utc(milliseconds).format("HH:mm:ss.SSS")
}

function outputTimeTable(timeValues, langTitle, langDuration, elapsedLabel, cpuLabel) {
    var result = '<div style="padding-top:10px"><table class="table table-striped table-hover table-condensed table-nonfluid"">';
    result += '<thead><tr>';
    result += '<th class="th-column td-column-timetype"></th>';
    //result += '<th class="th-column td-column-right"> ' + cpuLabel + ' (' + langDuration + ')</th>';
    //result += '<th class="th-column td-column-right"> ' + elapsedLabel + ' (' + langDuration + ')</th>';
    result += '<th class="th-column td-column-right"> ' + cpuLabel + '</th>';
    result += '<th class="th-column td-column-right"> ' + elapsedLabel + '</th>';
    result += '</tr></thead>';
    result += '<tbody>';
    result += '<tr>';
    result += '<td class="td-column-timetype">' + langTitle + '</td>';;
    //result += '<td class="td-column-right">' + numeral(timeValues.cpu).format('0,0') + '</td>';
    //result += '<td class="td-column-right">' + numeral(timeValues.elapsed).format('0,0') + '</td>';
    result += '<td class="td-column-right">' + formatms(timeValues.cpu) + '</td>';
    result += '<td class="td-column-right">' + formatms(timeValues.elapsed) + '</td>';
    result += '</tr></tbody></table></div>';

    return result;
}

function outputTimeTableTotals(executionValues, compileValues, langCompileTitle, langExecutionTitle, langDuration, elapsedLabel, cpuLabel) {
    var cpuTotal = parseInt(executionValues.cpu) + parseInt(compileValues.cpu)
    var elapsedTotal = parseInt(executionValues.elapsed) + parseInt(compileValues.elapsed)

    var result = '<div style="padding-top:10px"><table class="table table-striped table-hover table-condensed table-nonfluid">';
    result += '<thead><tr>';
    result += '<th class="th-column td-column-timetype"></th>';
    //result += '<th class="th-column td-column-right"> ' + cpuLabel + ' (' + langDuration + ')</th>';
    //result += '<th class="th-column td-column-right"> ' + elapsedLabel + ' (' + langDuration + ')</th>';
    result += '<th class="th-column td-column-right"> ' + cpuLabel + '</th>';
    result += '<th class="th-column td-column-right"> ' + elapsedLabel + '</th>';
    result += '</tr></thead>';
    result += '<tbody>';
    result += '<tr>';
    result += '<td class="td-column-timetype">' + langCompileTitle + '</td>';
    //result += '<td class="td-column-right">' + numeral(compileValues.cpu).format('0,0') + '</td>';
    //result += '<td class="td-column-right">' + numeral(compileValues.elapsed).format('0,0') + '</td>';
    result += '<td class="td-column-right">' + formatms(compileValues.cpu) + '</td>';
    result += '<td class="td-column-right">' + formatms(compileValues.elapsed) + '</td>';
    result += '</tr><tr>';
    result += '<td class="td-column-timetype">' + langExecutionTitle + '</td>';
    //result += '<td class="td-column-right">' + numeral(executionValues.cpu).format('0,0') + '</td>';
    //result += '<td class="td-column-right">' + numeral(executionValues.elapsed).format('0,0') + '</td>';
    result += '<td class="td-column-right">' + formatms(executionValues.cpu) + '</td>';
    result += '<td class="td-column-right">' + formatms(executionValues.elapsed) + '</td>';
    result += '</tr></tbody>';
    result += '<tfoot><tr>';
    result += '<td class="td-total td-column-timetype">Total</td>';
    //result += '<td class="td-total td-column-right">' + numeral(cpuTotal).format('0,0') + '</td>';
    //result += '<td class="td-total td-column-right">' + numeral(elapsedTotal).format('0,0') + '</td>';
    result += '<td class="td-total td-column-right">' + formatms(cpuTotal) + '</td>';
    result += '<td class="td-total td-column-right">' + formatms(elapsedTotal) + '</td>';
    result += '</tr></tfoot></table><div>';

    return result;
}

 function outputIOTable(statInfo, statTotal, tableNumber, langObj) {
    var result = '<table id="resultTable' + tableNumber +'" class="table table-striped table-hover table-condensed" style="table-layout:fixed">';
    result += '<thead><tr>';
    result += '<th class="th-column column-small">' + langObj.headerrownum + '</th>';
    result += '<th class="th-column">' + langObj.headertable + '</th>';
    result += '<th class="th-column column-large">' + langObj.headerscan + '</th>';
    result += '<th class="th-column column-large">' + langObj.headerlogical + '</th>';
    result += '<th class="th-column column-large">' + langObj.headerphysical + '</th>';
    result += '<th class="th-column column-large">' + langObj.headerreadahead + '</th>';
    result += '<th class="th-column column-medium">' + langObj.headerloblogical + '</th>';
    result += '<th class="th-column column-medium">' + langObj.headerlobphysical + '</th>';
    result += '<th class="th-column column-medium">' + langObj.headerlobreadahead + '</th>';
    result += '<th class="th-column column-xlarge">' + langObj.headerperlogicalread + '</th>';
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
    result += '<td class="footer-column column-small"></td>';
    result += '<td class="footer-column">Total</td>';
    result += '<td class="footer-column column-large">' + numeral(statTotal.scan).format('0,0') + '</td>';
    result += '<td class="footer-column column-large">' + numeral(statTotal.logical).format('0,0') + '</td>';
    result += '<td class="footer-column column-large">' + numeral(statTotal.physical).format('0,0') + '</td>';
    result += '<td class="footer-column column-large">' + numeral(statTotal.readahead).format('0,0') + '</td>';
    result += '<td class="footer-column column-medium">' + numeral(statTotal.loblogical).format('0,0') + '</td>';
    result += '<td class="footer-column column-medium">' + numeral(statTotal.lobphysical).format('0,0') + '</td>';
    result += '<td class="footer-column column-medium">' + numeral(statTotal.lobreadahead).format('0,0') + '</td>';
    result += '<td class="footer-column column-xlarge">&nbsp;</td>';
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

function versionNumber() {
    document.getElementById("versionNumber").innerHTML = '0.4.4';
}

