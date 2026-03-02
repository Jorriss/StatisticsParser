import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { displayParsedData } from '../displaystats.js';
import { rowEnum, columnIOEnum } from '../parser.js';
import DataTable from 'datatables.net-dt';

// Mock DataTable - must use function (not arrow) for constructor
vi.mock('datatables.net-dt', () => {
    const mockDestroy = vi.fn();
    const mockDataTable = vi.fn().mockImplementation(function() {
        return { destroy: mockDestroy };
    });

    mockDataTable.render = {
        number: vi.fn().mockImplementation((thousand, decimal) => {
            return (data) => {
                if (data === null || data === undefined) return '';
                return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
            };
        })
    };

    return {
        default: mockDataTable
    };
});

describe('displayParsedData', () => {
    let mockDocument;
    let mockElements;
    let mockLang;

    beforeEach(() => {
        // Create mock language object
        mockLang = {
            langvalue: 'en',
            headerrownum: 'Row',
            headertable: 'Table',
            headerscan: 'Scan',
            headerlogical: 'Logical',
            headerphysical: 'Physical',
            headerpageserver: 'Page Server',
            headerreadahead: 'Read Ahead',
            headerpageserverreadahead: 'Page Server Read Ahead',
            headerloblogical: 'LOB Logical',
            headerlobphysical: 'LOB Physical',
            headerlobpageserver: 'LOB Page Server',
            headerlobreadahead: 'LOB Read Ahead',
            headerlobpageserverreadahead: 'LOB Page Server Read Ahead',
            headerperlogicalread: '% Logical Read',
            totals: 'Totals',
            executiontime: 'Execution Time',
            cpulabel: 'CPU',
            elapsedlabel: 'Elapsed',
            compiletime: 'Compile Time',
            numberformat: {
                thousand: ',',
                decimal: '.'
            }
        };

        // Create mock elements
        mockElements = {
            result: {
                appendChild: vi.fn()
            }
        };

        // Setup document mock
        mockDocument = {
            getElementById: vi.fn((id) => mockElements[id]),
            createElement: vi.fn((tag) => ({
                id: '',
                className: '',
                textContent: '',
                appendChild: vi.fn(),
                append: vi.fn(),
                querySelector: vi.fn()
            }))
        };

        // Replace globals
        global.document = mockDocument;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should handle example data with multiple tables and statistics', () => {
        const parsedData = getExampleData();

        displayParsedData(parsedData, false, mockLang);

        // Verify DataTable was called for each table
        expect(DataTable).toHaveBeenCalledTimes(2); // One for IO table and one for total table

        // Verify document manipulation
        expect(mockDocument.createElement).toHaveBeenCalledWith('table');
        expect(mockElements.result.appendChild).toHaveBeenCalled();

        // Verify DataTable configuration
        expect(DataTable).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                data: expect.any(Array),
                columns: expect.any(Array),
                dom: 't',
                ordering: true,
                searching: false,
                paging: false
            })
        );
    });

    it('should handle IO data', () => {
        const parsedData = {
            data: [{
                rowtype: rowEnum.IO,
                data: [{ table: 'Test', scan: 100 }],
                total: { scan: 100 },
                columns: [columnIOEnum.Table, columnIOEnum.Scan],
                tableid: 'test-table'
            }],
            tablecount: 1,
            total: {
                iototal: {
                    data: [{ table: 'Total', scan: 100 }],
                    total: { scan: 100 },
                    columns: [columnIOEnum.Table, columnIOEnum.Scan],
                    tableid: 'total-table'
                },
                executiontotal: { cpu: 1000, elapsed: 2000 },
                compiletotal: { cpu: 500, elapsed: 1000 }
            }
        };

        displayParsedData(parsedData, false, mockLang);
        expect(mockElements.result.appendChild).toHaveBeenCalled();
        expect(DataTable).toHaveBeenCalled();
    });

    it('should handle multiple row types', () => {
        const parsedData = {
            data: [
                { rowtype: rowEnum.Info, text: 'Test Info' },
                { rowtype: rowEnum.Error, text: 'Test Error' },
                { rowtype: rowEnum.ExecutionTime, cpu: 1000, elapsed: 2000 },
                { rowtype: rowEnum.RowsAffected, rowsaffected: 1000, label: ' rows' },
                { rowtype: rowEnum.CompletionTime, label: 'Completed', completiontime: '2024-03-20T14:30:45.123456+00:00' }
            ],
            tablecount: 0,
            total: {
                executiontotal: { cpu: 1000, elapsed: 2000 },
                compiletotal: { cpu: 500, elapsed: 1000 }
            }
        };

        displayParsedData(parsedData, false, mockLang);
        expect(mockElements.result.appendChild).toHaveBeenCalled();
    });

    it('should handle empty data array', () => {
        const parsedData = {
            data: [],
            tablecount: 0,
            total: {
                executiontotal: { cpu: 0, elapsed: 0 },
                compiletotal: { cpu: 0, elapsed: 0 }
            }
        };

        displayParsedData(parsedData, false, mockLang);
        expect(mockElements.result.appendChild).toHaveBeenCalled();
    });

    it('should handle scrollbar option', () => {
        const parsedData = {
            data: [{
                rowtype: rowEnum.IO,
                data: [{ table: 'Test', scan: 100 }],
                total: { scan: 100 },
                columns: [columnIOEnum.Table, columnIOEnum.Scan],
                tableid: 'test-table'
            }],
            tablecount: 1,
            total: {
                iototal: {
                    data: [{ table: 'Total', scan: 100 }],
                    total: { scan: 100 },
                    columns: [columnIOEnum.Table, columnIOEnum.Scan],
                    tableid: 'total-table'
                },
                executiontotal: { cpu: 1000, elapsed: 2000 },
                compiletotal: { cpu: 500, elapsed: 1000 }
            }
        };

        displayParsedData(parsedData, true, mockLang);
        expect(DataTable).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                scrollY: '200px',
                scrollCollapse: true
            })
        );
    });

    it('should handle missing total data', () => {
        const parsedData = {
            data: [{
                rowtype: rowEnum.IO,
                data: [{ table: 'Test', scan: 100 }],
                total: { scan: 100 },
                columns: [columnIOEnum.Table, columnIOEnum.Scan],
                tableid: 'test-table'
            }],
            tablecount: 1,
            total: {
                iototal: {
                    data: [{ table: 'Total', scan: 100 }],
                    total: { scan: 100 },
                    columns: [columnIOEnum.Table, columnIOEnum.Scan],
                    tableid: 'total-table'
                }
            }
        };

        displayParsedData(parsedData, false, mockLang);
        expect(mockElements.result.appendChild).toHaveBeenCalled();
    });

    // Helper function to get example data
    function getExampleData() {
        return {
            "data": [
                {
                    "rowtype": rowEnum.ExecutionTime,
                    "linenumber": 1,
                    "summary": false,
                    "cpu": 108,
                    "elapsed": 108
                },
                {
                    "rowtype": rowEnum.Info,
                    "linenumber": 2,
                    "text": "\r"
                },
                {
                    "rowtype": rowEnum.RowsAffected,
                    "linenumber": 3,
                    "rowsaffected": "13431682",
                    "label": " rows affected"
                },
                {
                    "rowtype": rowEnum.IO,
                    "tableid": "resultTable_0",
                    "columns": [
                        columnIOEnum.Table,
                        columnIOEnum.Scan,
                        columnIOEnum.Logical,
                        columnIOEnum.Physical,
                        columnIOEnum.ReadAhead,
                        columnIOEnum.PageServerReadAhead,
                        columnIOEnum.LobLogical,
                        columnIOEnum.LobPhysical,
                        columnIOEnum.PercentRead
                    ],
                    "data": [
                        {
                            "rowtype": 1,
                            "rownumber": 1,
                            "linenumber": 4,
                            "table": "PostTypes",
                            "nostats": false,
                            "scan": 1,
                            "logical": 2,
                            "physical": 1,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 0,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 0,
                            "percentread": "0.000"
                        },
                        {
                            "rowtype": 1,
                            "rownumber": 2,
                            "linenumber": 5,
                            "table": "Users",
                            "nostats": false,
                            "scan": 5,
                            "logical": 42015,
                            "physical": 1,
                            "pageserver": 0,
                            "readahead": 41306,
                            "pageserverreadahead": 0,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 0,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 0,
                            "percentread": "0.235"
                        }
                    ],
                    "total": {
                        "scan": 6,
                        "logical": 42017,
                        "physical": 2,
                        "pageserver": 0,
                        "readahead": 41306,
                        "pageserverreadahead": 0,
                        "loblogical": 0,
                        "lobphysical": 0,
                        "lobpageserver": 0,
                        "lobreadahead": 0,
                        "lobpageserverreadahead": 0
                    }
                },
                {
                    "rowtype": rowEnum.Info,
                    "linenumber": 11,
                    "text": "\r"
                },
                {
                    "rowtype": rowEnum.CompileTime,
                    "linenumber": 13,
                    "summary": false,
                    "cpu": 156527,
                    "elapsed": 284906
                },
                {
                    "rowtype": rowEnum.ExecutionTime,
                    "linenumber": 15,
                    "summary": false,
                    "cpu": 16,
                    "elapsed": 19
                },
                {
                    "rowtype": rowEnum.Info,
                    "linenumber": 16,
                    "text": "\r"
                },
                {
                    "rowtype": rowEnum.RowsAffected,
                    "linenumber": 17,
                    "rowsaffected": "233033",
                    "label": " rows affected"
                },
                {
                    "rowtype": rowEnum.Error,
                    "linenumber": 25,
                    "text": "Msg 207, Level 16, State 1, Line 1\r"
                },
                {
                    "rowtype": rowEnum.Error,
                    "linenumber": 26,
                    "text": "Invalid column name 'scores'.\r"
                },
                {
                    "rowtype": rowEnum.CompletionTime,
                    "linenumber": 33,
                    "label": "Completion time: ",
                    "completiontime": "2025-05-27T10:32:37.8122685-04:00\r"
                }
            ],
            "tablecount": 2,
            "total": {
                "executiontotal": {
                    "rowtype": 7,
                    "cpu": 173734,
                    "elapsed": 323069
                },
                "compiletotal": {
                    "rowtype": 8,
                    "cpu": 124,
                    "elapsed": 127
                },
                "iototal": {
                    "columns": [
                        columnIOEnum.Table,
                        columnIOEnum.Scan,
                        columnIOEnum.Logical,
                        columnIOEnum.Physical,
                        columnIOEnum.ReadAhead,
                        columnIOEnum.PageServerReadAhead,
                        columnIOEnum.LobLogical,
                        columnIOEnum.LobPhysical,
                        columnIOEnum.PercentRead
                    ],
                    "data": [
                        {
                            "rowtype": 1,
                            "rownumber": 1,
                            "linenumber": 4,
                            "table": "PostTypes",
                            "nostats": false,
                            "scan": 1,
                            "logical": 2,
                            "physical": 1,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 0,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 0,
                            "percentread": "0.000"
                        },
                        {
                            "rowtype": 1,
                            "rownumber": 2,
                            "linenumber": 5,
                            "table": "Users",
                            "nostats": false,
                            "scan": 6,
                            "logical": 83420,
                            "physical": 4,
                            "pageserver": 0,
                            "readahead": 82707,
                            "pageserverreadahead": 0,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 0,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 0,
                            "percentread": "0.456"
                        }
                    ],
                    "total": {
                        "scan": 7,
                        "logical": 83422,
                        "physical": 5,
                        "pageserver": 0,
                        "readahead": 82707,
                        "pageserverreadahead": 0,
                        "loblogical": 0,
                        "lobphysical": 0,
                        "lobpageserver": 0,
                        "lobreadahead": 0,
                        "lobpageserverreadahead": 0
                    },
                    "tableid": "resultTableTotal"
                }
            }
        }
    }
}) 