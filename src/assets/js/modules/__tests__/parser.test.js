import { describe, it, expect } from 'vitest'
import { parseData, rowEnum, __test__ } from '../parser.js'
import langEn from '../../../../public/data/languagetext-en.json'
import langEs from '../../../../public/data/languagetext-es.json'
import langIt from '../../../../public/data/languagetext-it.json'

describe('Parser Module', () => {
    describe('parseData', () => {
        it('should handle multiple tables', () => {
            const data = getTestData_MultipleTables_Simple();
            const lang = getLanguageFile('en');

            const result = parseData(data.input, lang)
            expect(data.expected).toEqual(result)
        })

        it('should parse execution time correctly', () => {
            const data = getTestData_ExecutionTime_Simple()
            const result = parseData(data.input, getLanguageFile('en'))

            expect(data.expected).toEqual(result)
        })

        it('should parse the sample output correctly for each language', () => {
            const languages = ['es'] // ['en', 'es', 'it']
            const expecteddata = getTestData_SampleOutput();

            languages.forEach(lang => {
                const result = parseData(getLanguageFile(lang).sampleoutput, getLanguageFile(lang))

                let expected = null;
                switch (lang) {
                    case 'en':
                        expected = expecteddata.english.expected;
                        break;
                    case 'es':
                        expected = expecteddata.spanish.expected;
                        break;
                    case 'it':
                        expected = expecteddata.italian.expected;
                        break;
                }

                if (expected === null) {
                    throw new Error(`Unsupported language: ${lang}`);
                }
                console.log(expected);
                console.log(result);
                expect(expected).toEqual(result)
            })
        })

        it('should parse page server columns correctly', () => {
            const data = getTestData_PageServerColumns()
            const result = parseData(data.input, getLanguageFile('en'))

            expect(data.expected).toEqual(result)
        })

        it('should parse page server columns correctly for each language', () => {
            const languages = ['en', 'es', 'it']
            const expecteddata = getTestData_PageServerColumns_Simple()

            languages.forEach(lang => {

                let expected = null;
                let input = null;
                switch (lang) {
                    case 'en':
                        input = expecteddata.english.input;
                        expected = expecteddata.english.expected;
                        break;
                    case 'es':
                        input = expecteddata.spanish.input;
                        expected = expecteddata.spanish.expected;
                        break;
                    case 'it':
                        input = expecteddata.italian.input;
                        expected = expecteddata.italian.expected;
                        break;
                }

                const result = parseData(input, getLanguageFile(lang))

                if (expected === null) {
                    throw new Error(`Unsupported language: ${lang}`);
                }
                expect(expected).toEqual(result)
            })
        })

        it('should parse English data correctly', () => {
            const data = getTestData_PageServerColumns_Simple().english;
            const lang = getLanguageFile('en');
            const result = parseData(data.input, lang);
            expect(data.expected).toEqual(result);
        });

        it('should parse Spanish data correctly', () => {
            const data = getTestData_PageServerColumns_Simple().spanish;
            const lang = getLanguageFile('es');
            const result = parseData(data.input, lang);
            expect(data.expected).toEqual(result);
        });

        it('should parse Italian data correctly', () => {
            const data = getTestData_PageServerColumns_Simple().italian;
            const lang = getLanguageFile('it');
            const result = parseData(data.input, lang);
            expect(data.expected).toEqual(result);
        });

        it('should parse a simple columnstore output correctly', () => {
            const data = getTestData_ColumnstoreOutput_Simple();
            const lang = getLanguageFile('en');
            const result = parseData(data.input, lang);
            expect(data.expected).toEqual(result);
        });

        it('should parse columnstore output correctly', () => {
            const data = getTestData_ColumnstoreOutput();
            const lang = getLanguageFile('en');
            const result = parseData(data.input, lang);
            expect(data.expected).toEqual(result);
        })
    })

    // Helper functions

    function getLanguageFile(language) {
        switch (language.toLowerCase()) {
            case 'en':
                return langEn;
            case 'es':
                return langEs;
            case 'it':
                return langIt;
            default:
                return langEn;
        }
    };

    // Test data
    function getTestData_PageServerColumns_Simple() {
        return {
            english: {
                input: `Table 'ListofNumber'. Scan count 1, logical reads 2, physical reads 0, page server reads 23, read-ahead reads 0, page server read-ahead reads 32, lob logical reads 0, lob physical reads 0, lob page server reads 45, lob read-ahead reads 0, lob page server read-ahead reads 56.`,
                expected: {
                    data: [
                        {
                            rowtype: 1,
                            tableid: 'resultTable_0',
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 2,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 32,
                                    loblogical: 0,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 2,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 32,
                                loblogical: 0,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            }
                        }
                    ],
                    tablecount: 1,
                    total: {
                        executiontotal: { rowtype: 7, cpu: 0, elapsed: 0 },
                        compiletotal: { rowtype: 8, cpu: 0, elapsed: 0 },
                        iototal: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 2,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 32,
                                    loblogical: 0,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 2,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 32,
                                loblogical: 0,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            },
                            tableid: 'resultTableTotal'
                        }
                    }
                }
            },
            spanish: {
                input: `Tabla "ListofNumber". Número de examen 1, lecturas lógicas 1929, lecturas físicas 0, lecturas de servidor de páginas 23, lecturas anticipadas 0, lecturas anticipadas de servidor de páginas 23, lecturas lógicas de línea de negocio 12981, lecturas físicas de línea de negocio 0, lecturas de servidor de páginas de línea de negocio 45, lecturas anticipadas de línea de negocio 0, lecturas anticipadas de servidor de páginas de línea de negocio 56.`,
                // input: `Tabla 'ListofNumber'. Recuento de exploraciones 1, lecturas lógicas 1929, lecturas físicas 0, lecturas del servidor de páginas 23, lecturas anticipación 0, lecturas de anticipación del servidor de páginas 23, lecturas lógicas de LOB 12981, lecturas físicas de LOB 0, lecturas del servidor de páginas de LOB 45, lecturas de anticipación de LOB 0, lecturas de anticipación del servidor de páginas de LOB 56.`,
                expected: {
                    data: [
                        {
                            rowtype: 1,
                            tableid: 'resultTable_0',
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 1929,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 23,
                                    loblogical: 12981,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 1929,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 23,
                                loblogical: 12981,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            }
                        }
                    ],
                    tablecount: 1,
                    total: {
                        executiontotal: { rowtype: 7, cpu: 0, elapsed: 0 },
                        compiletotal: { rowtype: 8, cpu: 0, elapsed: 0 },
                        iototal: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 1929,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 23,
                                    loblogical: 12981,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 1929,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 23,
                                loblogical: 12981,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            },
                            tableid: 'resultTableTotal'
                        }
                    }
                }
            },
            italian: {
                input: `Tabella 'ListofNumber'. Conteggio analisi 1, letture logiche 2, letture fisiche 0, letture server di pagine 23, letture read-ahead 0, letture read-ahead server di pagine 32, letture logiche LOB 0, letture fisiche LOB 0, letture LOB server di pagine 45, letture LOB read-ahead 0, letture read-ahead LOB server di pagine 56.`,
                expected: {
                    data: [
                        {
                            rowtype: 1,
                            tableid: 'resultTable_0',
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 2,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 32,
                                    loblogical: 0,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 2,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 32,
                                loblogical: 0,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            }
                        }
                    ],
                    tablecount: 1,
                    total: {
                        executiontotal: { rowtype: 7, cpu: 0, elapsed: 0 },
                        compiletotal: { rowtype: 8, cpu: 0, elapsed: 0 },
                        iototal: {
                            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                            data: [
                                {
                                    rowtype: 1,
                                    rownumber: 1,
                                    linenumber: 0,
                                    table: 'ListofNumber',
                                    nostats: false,
                                    scan: 1,
                                    logical: 2,
                                    physical: 0,
                                    pageserver: 23,
                                    readahead: 0,
                                    pageserverreadahead: 32,
                                    loblogical: 0,
                                    lobphysical: 0,
                                    lobpageserver: 45,
                                    lobreadahead: 0,
                                    lobpageserverreadahead: 56,
                                    segmentreads: 0,
                                    segmentskipped: 0,
                                    percentread: '100.000'
                                }
                            ],
                            total: {
                                scan: 1,
                                logical: 2,
                                physical: 0,
                                pageserver: 23,
                                readahead: 0,
                                pageserverreadahead: 32,
                                loblogical: 0,
                                lobphysical: 0,
                                lobpageserver: 45,
                                lobreadahead: 0,
                                lobpageserverreadahead: 56,
                                segmentreads: 0,
                                segmentskipped: 0
                            },
                            tableid: 'resultTableTotal'
                        }
                    }
                }
            }
        };
    };

    function getTestData_PageServerColumns() {
        return {
            input: `SQL Server Execution Times:
   CPU time = 0 ms,  elapsed time = 0 ms. 
SQL Server parse and compile time: 
   CPU time = 21 ms, elapsed time = 21 ms.

 SQL Server Execution Times:
   CPU time = 0 ms,  elapsed time = 0 ms.
Table 'Worktable'. Scan count 0, logical reads 0, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'product_loadtable'. Scan count 1, logical reads 942, physical reads 0, page server reads 16, read-ahead reads 0, page server read-ahead reads 20, lob logical reads 0, lob physical reads 0, lob page server reads 24, lob read-ahead reads 0, lob page server read-ahead reads 28.
Table 'Workfile'. Scan count 0, logical reads 0, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'product_option'. Scan count 2, logical reads 26, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'product_description'. Scan count 157, logical reads 628, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'barsizes'. Scan count 0, logical reads 314, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'product_detail'. Scan count 1, logical reads 17, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'product'. Scan count 1588, logical reads 6299, physical reads 0, page server reads 32, read-ahead reads 0, page server read-ahead reads 36, lob logical reads 0, lob physical reads 0, lob page server reads 40, lob read-ahead reads 0, lob page server read-ahead reads 44.
Table 'inventory'. Scan count 1, logical reads 24, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.
Table 'option_value'. Scan count 1, logical reads 3, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.

 SQL Server Execution Times:
   CPU time = 0 ms,  elapsed time = 41 ms.

 SQL Server Execution Times:
   CPU time = 31 ms,  elapsed time = 62 ms.

 SQL Server Execution Times:
   CPU time = 0 ms,  elapsed time = 0 ms.

Completion time: 2023-04-21T09:49:57.7878903-04:00`,
            expected: {
                "data": [
                    {
                        "rowtype": 2,
                        "linenumber": 1,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 3,
                        "linenumber": 3,
                        "summary": false,
                        "cpu": 21,
                        "elapsed": 21
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 4,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 6,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 1,
                        "tableid": "resultTable_0",
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 7,
                                "table": "Worktable",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 2,
                                "linenumber": 8,
                                "table": "product_loadtable",
                                "nostats": false,
                                "scan": 1,
                                "logical": 942,
                                "physical": 0,
                                "pageserver": 16,
                                "readahead": 0,
                                "pageserverreadahead": 20,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 24,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 28,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "11.414"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 3,
                                "linenumber": 9,
                                "table": "Workfile",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 4,
                                "linenumber": 10,
                                "table": "product_option",
                                "nostats": false,
                                "scan": 2,
                                "logical": 26,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.315"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 5,
                                "linenumber": 11,
                                "table": "product_description",
                                "nostats": false,
                                "scan": 157,
                                "logical": 628,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "7.609"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 6,
                                "linenumber": 12,
                                "table": "barsizes",
                                "nostats": false,
                                "scan": 0,
                                "logical": 314,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "3.805"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 7,
                                "linenumber": 13,
                                "table": "product_detail",
                                "nostats": false,
                                "scan": 1,
                                "logical": 17,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.206"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 8,
                                "linenumber": 14,
                                "table": "product",
                                "nostats": false,
                                "scan": 1588,
                                "logical": 6299,
                                "physical": 0,
                                "pageserver": 32,
                                "readahead": 0,
                                "pageserverreadahead": 36,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 40,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 44,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "76.324"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 9,
                                "linenumber": 15,
                                "table": "inventory",
                                "nostats": false,
                                "scan": 1,
                                "logical": 24,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.291"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 10,
                                "linenumber": 16,
                                "table": "option_value",
                                "nostats": false,
                                "scan": 1,
                                "logical": 3,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.036"
                            }
                        ],
                        "total": {
                            "scan": 1751,
                            "logical": 8253,
                            "physical": 0,
                            "pageserver": 48,
                            "readahead": 0,
                            "pageserverreadahead": 56,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 64,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 72,
                            "segmentreads": 0,
                            "segmentskipped": 0
                        }
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 17,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 19,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 41
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 20,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 22,
                        "summary": false,
                        "cpu": 31,
                        "elapsed": 62
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 23,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 25,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 26,
                        "text": ""
                    },
                    {
                        "rowtype": 10,
                        "linenumber": 27,
                        "label": "Completion time: ",
                        "completiontime": "2023-04-21T09:49:57.7878903-04:00"
                    }
                ],
                "tablecount": 10,
                "total": {
                    "executiontotal": {
                        "rowtype": 7,
                        "cpu": 31,
                        "elapsed": 103
                    },
                    "compiletotal": {
                        "rowtype": 8,
                        "cpu": 21,
                        "elapsed": 21
                    },
                    "iototal": {
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 6,
                                "linenumber": 12,
                                "table": "barsizes",
                                "nostats": false,
                                "scan": 0,
                                "logical": 314,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "3.805"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 9,
                                "linenumber": 15,
                                "table": "inventory",
                                "nostats": false,
                                "scan": 1,
                                "logical": 24,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.291"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 10,
                                "linenumber": 16,
                                "table": "option_value",
                                "nostats": false,
                                "scan": 1,
                                "logical": 3,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.036"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 8,
                                "linenumber": 14,
                                "table": "product",
                                "nostats": false,
                                "scan": 1588,
                                "logical": 6299,
                                "physical": 0,
                                "pageserver": 32,
                                "readahead": 0,
                                "pageserverreadahead": 36,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 40,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 44,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "76.324"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 5,
                                "linenumber": 11,
                                "table": "product_description",
                                "nostats": false,
                                "scan": 157,
                                "logical": 628,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "7.609"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 7,
                                "linenumber": 13,
                                "table": "product_detail",
                                "nostats": false,
                                "scan": 1,
                                "logical": 17,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.206"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 2,
                                "linenumber": 8,
                                "table": "product_loadtable",
                                "nostats": false,
                                "scan": 1,
                                "logical": 942,
                                "physical": 0,
                                "pageserver": 16,
                                "readahead": 0,
                                "pageserverreadahead": 20,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 24,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 28,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "11.414"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 4,
                                "linenumber": 10,
                                "table": "product_option",
                                "nostats": false,
                                "scan": 2,
                                "logical": 26,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.315"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 3,
                                "linenumber": 9,
                                "table": "Workfile",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 7,
                                "table": "Worktable",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            }
                        ],
                        "total": {
                            "scan": 1751,
                            "logical": 8253,
                            "physical": 0,
                            "pageserver": 48,
                            "readahead": 0,
                            "pageserverreadahead": 56,
                            "loblogical": 0,
                            "lobphysical": 0,
                            "lobpageserver": 64,
                            "lobreadahead": 0,
                            "lobpageserverreadahead": 72,
                            "segmentreads": 0,
                            "segmentskipped": 0
                        },
                        "tableid": "resultTableTotal"
                    }
                }
            }
        }
    }

    function getTestData_ExecutionTime_Simple() {
        return {
            input: `SQL Server Execution Times:
   CPU time = 256 ms,  elapsed time = 512 ms.`,
            expected: {
                data: [
                    {
                        rowtype: 2,
                        linenumber: 1,
                        summary: false,
                        cpu: 256,
                        elapsed: 512
                    }
                ],
                tablecount: 0,
                total: {
                    executiontotal: { rowtype: 7, cpu: 256, elapsed: 512 },
                    compiletotal: { rowtype: 8, cpu: 0, elapsed: 0 },
                    iototal: {
                        columns: [],
                        data: [],
                        total: {
                            rowtype: 6,
                            rownumber: 0,
                            table: '',
                            scan: 0,
                            logical: 0,
                            physical: 0,
                            pageserver: 0,
                            readahead: 0,
                            pageserverreadahead: 0,
                            loblogical: 0,
                            lobphysical: 0,
                            lobpageserver: 0,
                            lobreadahead: 0,
                            lobpageserverreadahead: 0,
                            segmentreads: 0,
                            segmentskipped: 0,
                            percentread: 0
                        },
                        tableid: 'resultTableTotal'
                    }
                }
            }
        }
    };

    function getTestData_MultipleTables_Simple() {
        return {
            input: `Table 'Customer'. Scan count 1, logical reads 2, physical reads 3, read-ahead reads 4, page server reads 5, page server read-ahead reads 6, lob logical reads 7, lob physical reads 8, lob read-ahead reads 9, lob page server reads 10, lob page server read-ahead reads 11.
Table 'Orders'. Scan count 1, logical reads 12, physical reads 13, read-ahead reads 14, page server reads 15, page server read-ahead reads 16, lob logical reads 17, lob physical reads 18, lob read-ahead reads 19, lob page server reads 20, lob page server read-ahead reads 21.`,
            expected:
            {
                data: [
                    {
                        rowtype: 1,
                        tableid: 'resultTable_0',
                        columns: [1, 2, 3, 4, 6, 5, 7, 8, 9, 11, 10, 12, 13],
                        data: [
                            {
                                rowtype: 1,
                                rownumber: 1,
                                linenumber: 0,
                                table: 'Customer',
                                nostats: false,
                                scan: 1,
                                logical: 2,
                                physical: 3,
                                pageserver: 5,
                                readahead: 4,
                                pageserverreadahead: 6,
                                loblogical: 7,
                                lobphysical: 8,
                                lobpageserver: 10,
                                lobreadahead: 9,
                                lobpageserverreadahead: 11,
                                segmentreads: 0,
                                segmentskipped: 0,
                                percentread: '14.286'
                            },
                            {
                                rowtype: 1,
                                rownumber: 2,
                                linenumber: 1,
                                table: 'Orders',
                                nostats: false,
                                scan: 1,
                                logical: 12,
                                physical: 13,
                                pageserver: 15,
                                readahead: 14,
                                pageserverreadahead: 16,
                                loblogical: 17,
                                lobphysical: 18,
                                lobpageserver: 20,
                                lobreadahead: 19,
                                lobpageserverreadahead: 21,
                                segmentreads: 0,
                                segmentskipped: 0,
                                percentread: '85.714'
                            }
                        ],
                        total: {
                            scan: 2,
                            logical: 14,
                            physical: 16,
                            pageserver: 20,
                            readahead: 18,
                            pageserverreadahead: 22,
                            loblogical: 24,
                            lobphysical: 26,
                            lobpageserver: 30,
                            lobreadahead: 28,
                            lobpageserverreadahead: 32,
                            segmentreads: 0,
                            segmentskipped: 0
                        }
                    }
                ],
                tablecount: 2,
                total: {
                    executiontotal: { rowtype: 7, cpu: 0, elapsed: 0 },
                    compiletotal: { rowtype: 8, cpu: 0, elapsed: 0 },
                    iototal: {
                        columns: [1, 2, 3, 4, 6, 5, 7, 8, 9, 11, 10, 12, 13],
                        data: [
                            {
                                rowtype: 1,
                                rownumber: 1,
                                linenumber: 0,
                                table: 'Customer',
                                nostats: false,
                                scan: 1,
                                logical: 2,
                                physical: 3,
                                pageserver: 5,
                                readahead: 4,
                                pageserverreadahead: 6,
                                loblogical: 7,
                                lobphysical: 8,
                                lobpageserver: 10,
                                lobreadahead: 9,
                                lobpageserverreadahead: 11,
                                segmentreads: 0,
                                segmentskipped: 0,
                                percentread: '14.286'
                            },
                            {
                                rowtype: 1,
                                rownumber: 2,
                                linenumber: 1,
                                table: 'Orders',
                                nostats: false,
                                scan: 1,
                                logical: 12,
                                physical: 13,
                                pageserver: 15,
                                readahead: 14,
                                pageserverreadahead: 16,
                                loblogical: 17,
                                lobphysical: 18,
                                lobpageserver: 20,
                                lobreadahead: 19,
                                lobpageserverreadahead: 21,
                                segmentreads: 0,
                                segmentskipped: 0,
                                percentread: '85.714'
                            }
                        ],
                        total: {
                            scan: 2,
                            logical: 14,
                            physical: 16,
                            pageserver: 20,
                            readahead: 18,
                            pageserverreadahead: 22,
                            loblogical: 24,
                            lobphysical: 26,
                            lobpageserver: 30,
                            lobreadahead: 28,
                            lobpageserverreadahead: 32,
                            segmentreads: 0,
                            segmentskipped: 0
                        },
                        tableid: 'resultTableTotal'
                    }
                }
            }
        }
    };

    function getTestData_SampleOutput() {
        return {
            english: {
                expected: {
                    "data": [
                        {
                            "rowtype": 3,
                            "linenumber": 1,
                            "summary": false,
                            "cpu": 108,
                            "elapsed": 108
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 2,
                            "text": ""
                        },
                        {
                            "rowtype": 4,
                            "linenumber": 3,
                            "rowsaffected": "13431682",
                            "label": " rows affected"
                        },
                        {
                            "rowtype": 1,
                            "tableid": "resultTable_0",
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.235"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "Comments",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 1089402,
                                    "physical": 248,
                                    "pageserver": 0,
                                    "readahead": 1108174,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "6.102"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "PostTags",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 77500,
                                    "physical": 348,
                                    "pageserver": 0,
                                    "readahead": 82219,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.434"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 397944,
                                    "physical": 9338,
                                    "pageserver": 0,
                                    "readahead": 402977,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "2.229"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 999172,
                                    "logical": 16247024,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "91.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 10,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                }
                            ],
                            "total": {
                                "scan": 999193,
                                "logical": 17853887,
                                "physical": 9936,
                                "pageserver": 0,
                                "readahead": 1634676,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            }
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 11,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 13,
                            "summary": false,
                            "cpu": 156527,
                            "elapsed": 284906
                        },
                        {
                            "rowtype": 3,
                            "linenumber": 15,
                            "summary": false,
                            "cpu": 16,
                            "elapsed": 19
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 16,
                            "text": ""
                        },
                        {
                            "rowtype": 4,
                            "linenumber": 17,
                            "rowsaffected": "233033",
                            "label": " rows affected"
                        },
                        {
                            "rowtype": 1,
                            "tableid": "resultTable_7",
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 1,
                                    "linenumber": 18,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 2,
                                    "linenumber": 19,
                                    "table": "Votes",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 250128,
                                    "physical": 10,
                                    "pageserver": 0,
                                    "readahead": 250104,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "54.718"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 20,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 165586,
                                    "physical": 18,
                                    "pageserver": 0,
                                    "readahead": 49191,
                                    "pageserverreadahead": 0,
                                    "loblogical": 823463,
                                    "lobphysical": 42854,
                                    "lobpageserver": 0,
                                    "lobreadahead": 3272,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "36.224"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 21,
                                    "table": "Users",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 41405,
                                    "physical": 3,
                                    "pageserver": 0,
                                    "readahead": 41401,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "9.058"
                                }
                            ],
                            "total": {
                                "scan": 3,
                                "logical": 457119,
                                "physical": 31,
                                "pageserver": 0,
                                "readahead": 340696,
                                "pageserverreadahead": 0,
                                "loblogical": 823463,
                                "lobphysical": 42854,
                                "lobpageserver": 0,
                                "lobreadahead": 3272,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            }
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 22,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 24,
                            "summary": false,
                            "cpu": 17207,
                            "elapsed": 38163
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 25,
                            "text": "Msg 207, Level 16, State 1, Line 1"
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 26,
                            "text": "Invalid column name 'scores'."
                        },
                        {
                            "rowtype": 3,
                            "linenumber": 28,
                            "summary": false,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 29,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 31,
                            "summary": false,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 32,
                            "text": ""
                        },
                        {
                            "rowtype": 10,
                            "linenumber": 33,
                            "label": "Completion time: ",
                            "completiontime": "2025-05-27T10:32:37.8122685-04:00"
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 34,
                            "text": ""
                        }
                    ],
                    "tablecount": 11,
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
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "Comments",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 1089402,
                                    "physical": 248,
                                    "pageserver": 0,
                                    "readahead": 1108174,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "5.949"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 6,
                                    "logical": 563530,
                                    "physical": 9356,
                                    "pageserver": 0,
                                    "readahead": 452168,
                                    "pageserverreadahead": 0,
                                    "loblogical": 823463,
                                    "lobphysical": 42854,
                                    "lobpageserver": 0,
                                    "lobreadahead": 3272,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "3.078"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "PostTags",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 77500,
                                    "physical": 348,
                                    "pageserver": 0,
                                    "readahead": 82219,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.423"
                                },
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.456"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 19,
                                    "table": "Votes",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 250128,
                                    "physical": 10,
                                    "pageserver": 0,
                                    "readahead": 250104,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.366"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 999172,
                                    "logical": 16247024,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "88.728"
                                }
                            ],
                            "total": {
                                "scan": 999196,
                                "logical": 18311006,
                                "physical": 9967,
                                "pageserver": 0,
                                "readahead": 1975372,
                                "pageserverreadahead": 0,
                                "loblogical": 823463,
                                "lobphysical": 42854,
                                "lobpageserver": 0,
                                "lobreadahead": 3272,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            },
                            "tableid": "resultTableTotal"
                        }
                    }
                }
            },
            spanish: {
                expected: {
                    "data": [
                        {
                            "rowtype": 3,
                            "linenumber": 1,
                            "summary": false,
                            "cpu": 135,
                            "elapsed": 135
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 2,
                            "text": ""
                        },
                        {
                            "rowtype": 4,
                            "linenumber": 3,
                            "rowsaffected": "13431682",
                            "label": " filas afectadas"
                        },
                        {
                            "rowtype": 1,
                            "tableid": "resultTable_0",
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
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
                                    "readahead": 41305,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.235"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "Comments",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 1089147,
                                    "physical": 19,
                                    "pageserver": 0,
                                    "readahead": 1088411,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "6.101"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "PostTags",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 77870,
                                    "physical": 3,
                                    "pageserver": 0,
                                    "readahead": 76763,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.436"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 396629,
                                    "physical": 26,
                                    "pageserver": 0,
                                    "readahead": 394952,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "2.222"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 999172,
                                    "logical": 16247024,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "91.006"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 10,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                }
                            ],
                            "total": {
                                "scan": 999193,
                                "logical": 17852687,
                                "physical": 50,
                                "pageserver": 0,
                                "readahead": 1601431,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            }
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 11,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 13,
                            "summary": false,
                            "cpu": 164456,
                            "elapsed": 293219
                        },
                        {
                            "rowtype": 3,
                            "linenumber": 15,
                            "summary": false,
                            "cpu": 24,
                            "elapsed": 24
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 16,
                            "text": ""
                        },
                        {
                            "rowtype": 4,
                            "linenumber": 17,
                            "rowsaffected": "233033",
                            "label": " filas afectadas"
                        },
                        {
                            "rowtype": 1,
                            "tableid": "resultTable_7",
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 1,
                                    "linenumber": 18,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 2,
                                    "linenumber": 19,
                                    "table": "Votes",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 250128,
                                    "physical": 4,
                                    "pageserver": 0,
                                    "readahead": 250123,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "55.259"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 20,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 161111,
                                    "physical": 22,
                                    "pageserver": 0,
                                    "readahead": 53658,
                                    "pageserverreadahead": 0,
                                    "loblogical": 823412,
                                    "lobphysical": 42463,
                                    "lobpageserver": 0,
                                    "lobreadahead": 3272,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "35.593"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 21,
                                    "table": "Users",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 41405,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 41231,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "9.147"
                                }
                            ],
                            "total": {
                                "scan": 3,
                                "logical": 452644,
                                "physical": 26,
                                "pageserver": 0,
                                "readahead": 345012,
                                "pageserverreadahead": 0,
                                "loblogical": 823412,
                                "lobphysical": 42463,
                                "lobpageserver": 0,
                                "lobreadahead": 3272,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            }
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 22,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 24,
                            "summary": false,
                            "cpu": 17847,
                            "elapsed": 36306
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 25,
                            "text": "Msg 207, Level 16, State 1, Line 1"
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 26,
                            "text": "El nombre de columna 'scores' no es válido."
                        },
                        {
                            "rowtype": 3,
                            "linenumber": 28,
                            "summary": false,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 29,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 31,
                            "summary": false,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        {
                            "rowtype": 10,
                            "linenumber": 32,
                            "label": "Completion time: ",
                            "completiontime": "2025-05-27T10:32:37.8122685-04:00"
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 33,
                            "text": ""
                        }
                    ],
                    "tablecount": 11,
                    "total": {
                        "executiontotal": {
                            "rowtype": 7,
                            "cpu": 182303,
                            "elapsed": 329525
                        },
                        "compiletotal": {
                            "rowtype": 8,
                            "cpu": 159,
                            "elapsed": 159
                        },
                        "iototal": {
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                6,
                                8,
                                9,
                                11,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "Comments",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 1089147,
                                    "physical": 19,
                                    "pageserver": 0,
                                    "readahead": 1088411,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "5.950"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "Posts",
                                    "nostats": false,
                                    "scan": 6,
                                    "logical": 557740,
                                    "physical": 48,
                                    "pageserver": 0,
                                    "readahead": 448610,
                                    "pageserverreadahead": 0,
                                    "loblogical": 823412,
                                    "lobphysical": 42463,
                                    "lobpageserver": 0,
                                    "lobreadahead": 3272,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "3.047"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "PostTags",
                                    "nostats": false,
                                    "scan": 5,
                                    "logical": 77870,
                                    "physical": 3,
                                    "pageserver": 0,
                                    "readahead": 76763,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.425"
                                },
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
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
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
                                    "physical": 1,
                                    "pageserver": 0,
                                    "readahead": 82536,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.456"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 19,
                                    "table": "Votes",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 250128,
                                    "physical": 4,
                                    "pageserver": 0,
                                    "readahead": 250123,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.366"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 999172,
                                    "logical": 16247024,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "88.756"
                                }
                            ],
                            "total": {
                                "scan": 999196,
                                "logical": 18305331,
                                "physical": 76,
                                "pageserver": 0,
                                "readahead": 1946443,
                                "pageserverreadahead": 0,
                                "loblogical": 823412,
                                "lobphysical": 42463,
                                "lobpageserver": 0,
                                "lobreadahead": 3272,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            },
                            "tableid": "resultTableTotal"
                        }
                    }
                }
            },
            italian: {
                expected: {
                    "data": [
                        {
                            "rowtype": 3,
                            "linenumber": 1,
                            "summary": false,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 2,
                            "text": ""
                        },
                        {
                            "rowtype": 4,
                            "linenumber": 3,
                            "rowsaffected": "25499",
                            "label": " righe interessate"
                        },
                        {
                            "rowtype": 1,
                            "tableid": "resultTable_0",
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                0,
                                11,
                                12,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 1,
                                    "linenumber": 4,
                                    "table": "Workfile",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 2,
                                    "linenumber": 5,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 856,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "FATRIG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 13563,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "65.712"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "FATTES",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 3748,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "18.159"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "COMRIG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 170,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.824"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "CONTI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 224,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.085"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 10,
                                    "table": "TIPIDOC",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 8,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.039"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 8,
                                    "linenumber": 11,
                                    "table": "COMTES",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 1702,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "8.246"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 9,
                                    "linenumber": 12,
                                    "table": "CLIENTI",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 20,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.097"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 10,
                                    "linenumber": 13,
                                    "table": "PERSONE",
                                    "nostats": false,
                                    "scan": 4,
                                    "logical": 794,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "3.847"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 11,
                                    "linenumber": 14,
                                    "table": "ANAPAG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 5,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.024"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 12,
                                    "linenumber": 15,
                                    "table": "NAZIONI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 13,
                                    "linenumber": 16,
                                    "table": "AGENTI",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 4,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.019"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 14,
                                    "linenumber": 17,
                                    "table": "LOTSER",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 18,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.087"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 15,
                                    "linenumber": 18,
                                    "table": "ARTICO",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 370,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.793"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 16,
                                    "linenumber": 19,
                                    "table": "CLASSI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 17,
                                    "linenumber": 20,
                                    "table": "CATOMO",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 18,
                                    "linenumber": 21,
                                    "table": "GRUPPI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 19,
                                    "linenumber": 22,
                                    "table": "LINEEP",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 20,
                                    "linenumber": 23,
                                    "table": "MARCHE",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 4,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.019"
                                }
                            ],
                            "total": {
                                "scan": 24,
                                "logical": 20640,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 856,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            }
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 24,
                            "text": ""
                        },
                        {
                            "rowtype": 2,
                            "linenumber": 26,
                            "summary": false,
                            "cpu": 657,
                            "elapsed": 944
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 27,
                            "text": ""
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 28,
                            "text": "Messaggio 207, livello 16, stato 1, riga 1"
                        },
                        {
                            "rowtype": 5,
                            "linenumber": 29,
                            "text": "Il nome di colonna 'test' non è valido."
                        },
                        {
                            "rowtype": 9,
                            "linenumber": 30,
                            "text": ""
                        }
                    ],
                    "tablecount": 20,
                    "total": {
                        "executiontotal": {
                            "rowtype": 7,
                            "cpu": 657,
                            "elapsed": 944
                        },
                        "compiletotal": {
                            "rowtype": 8,
                            "cpu": 0,
                            "elapsed": 0
                        },
                        "iototal": {
                            "columns": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                0,
                                11,
                                12,
                                13
                            ],
                            "data": [
                                {
                                    "rowtype": 1,
                                    "rownumber": 13,
                                    "linenumber": 16,
                                    "table": "AGENTI",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 4,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.019"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 11,
                                    "linenumber": 14,
                                    "table": "ANAPAG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 5,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.024"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 15,
                                    "linenumber": 18,
                                    "table": "ARTICO",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 370,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.793"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 17,
                                    "linenumber": 20,
                                    "table": "CATOMO",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 16,
                                    "linenumber": 19,
                                    "table": "CLASSI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 9,
                                    "linenumber": 12,
                                    "table": "CLIENTI",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 20,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.097"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 5,
                                    "linenumber": 8,
                                    "table": "COMRIG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 170,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.824"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 8,
                                    "linenumber": 11,
                                    "table": "COMTES",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 1702,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "8.246"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 6,
                                    "linenumber": 9,
                                    "table": "CONTI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 224,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "1.085"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 3,
                                    "linenumber": 6,
                                    "table": "FATRIG",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 13563,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "65.712"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 4,
                                    "linenumber": 7,
                                    "table": "FATTES",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 3748,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "18.159"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 18,
                                    "linenumber": 21,
                                    "table": "GRUPPI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 19,
                                    "linenumber": 22,
                                    "table": "LINEEP",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 14,
                                    "linenumber": 17,
                                    "table": "LOTSER",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 18,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.087"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 20,
                                    "linenumber": 23,
                                    "table": "MARCHE",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 4,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.019"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 12,
                                    "linenumber": 15,
                                    "table": "NAZIONI",
                                    "nostats": false,
                                    "scan": 1,
                                    "logical": 2,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.010"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 10,
                                    "linenumber": 13,
                                    "table": "PERSONE",
                                    "nostats": false,
                                    "scan": 4,
                                    "logical": 794,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "3.847"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 7,
                                    "linenumber": 10,
                                    "table": "TIPIDOC",
                                    "nostats": false,
                                    "scan": 2,
                                    "logical": 8,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.039"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 1,
                                    "linenumber": 4,
                                    "table": "Workfile",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 0,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                },
                                {
                                    "rowtype": 1,
                                    "rownumber": 2,
                                    "linenumber": 5,
                                    "table": "Worktable",
                                    "nostats": false,
                                    "scan": 0,
                                    "logical": 0,
                                    "physical": 0,
                                    "pageserver": 0,
                                    "readahead": 856,
                                    "pageserverreadahead": 0,
                                    "loblogical": 0,
                                    "lobphysical": 0,
                                    "lobpageserver": 0,
                                    "lobreadahead": 0,
                                    "lobpageserverreadahead": 0,
                                    "segmentreads": 0,
                                    "segmentskipped": 0,
                                    "percentread": "0.000"
                                }
                            ],
                            "total": {
                                "scan": 24,
                                "logical": 20640,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 856,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0
                            },
                            "tableid": "resultTableTotal"
                        }
                    }
                }
            }
        }
    };

    function getTestData_ColumnstoreOutput_Simple() {
        return {
            input: `Table 'BKAmountsColumnStore'. Scan count 11, logical reads 8484, physical reads 0, read-ahead reads 0, lob logical reads 165597, lob physical reads 1, lob read-ahead reads 72296.\nTable 'BKAmountsColumnStore'. Segment reads 38, segment skipped 4091.\nTable 'TradesColumnStore'. Scan count 16, logical reads 22083, physical reads 0, read-ahead reads 0, lob logical reads 7603, lob physical reads 0, lob read-ahead reads 3907.\nTable 'TradesColumnStore'. Segment reads 10, segment skipped 1106.`,
            expected: {
                "data": [
                    {
                        "rowtype": 1,
                        "tableid": "resultTable_0",
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            6,
                            8,
                            9,
                            11,
                            14,
                            15,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 0,
                                "table": "BKAmountsColumnStore",
                                "nostats": false,
                                "scan": 11,
                                "logical": 8484,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 165597,
                                "lobphysical": 1,
                                "lobpageserver": 0,
                                "lobreadahead": 72296,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 38,
                                "segmentskipped": 4091,
                                "percentread": "27.755"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 3,
                                "linenumber": 2,
                                "table": "TradesColumnStore",
                                "nostats": false,
                                "scan": 16,
                                "logical": 22083,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 7603,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 3907,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 10,
                                "segmentskipped": 1106,
                                "percentread": "72.245"
                            }
                        ],
                        "total": {
                            "scan": 27,
                            "logical": 30567,
                            "physical": 0,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 173200,
                            "lobphysical": 1,
                            "lobpageserver": 0,
                            "lobreadahead": 76203,
                            "lobpageserverreadahead": 0,
                            "segmentreads": 48,
                            "segmentskipped": 5197
                        }
                    }
                ],
                "tablecount": 4,
                "total": {
                    "executiontotal": {
                        "rowtype": 7,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    "compiletotal": {
                        "rowtype": 8,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    "iototal": {
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            6,
                            8,
                            9,
                            11,
                            14,
                            15,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 0,
                                "table": "BKAmountsColumnStore",
                                "nostats": false,
                                "scan": 11,
                                "logical": 8484,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 165597,
                                "lobphysical": 1,
                                "lobpageserver": 0,
                                "lobreadahead": 72296,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 38,
                                "segmentskipped": 4091,
                                "percentread": "27.755"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 2,
                                "linenumber": 2,
                                "table": "TradesColumnStore",
                                "nostats": false,
                                "scan": 16,
                                "logical": 22083,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 7603,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 3907,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 10,
                                "segmentskipped": 1106,
                                "percentread": "72.245"
                            }
                        ],
                        "total": {
                            "scan": 27,
                            "logical": 30567,
                            "physical": 0,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 173200,
                            "lobphysical": 1,
                            "lobpageserver": 0,
                            "lobreadahead": 76203,
                            "lobpageserverreadahead": 0,
                            "segmentreads": 48,
                            "segmentskipped": 5197
                        },
                        "tableid": "resultTableTotal"
                    }
                }
            }
        }
    };

    function getTestData_ColumnstoreOutput() {
        return {
            input: `SQL Server parse and compile time:\r\nCPU time = 0 ms, elapsed time = 0 ms.\r\n\r\nSQL Server Execution Times:\r\nCPU time = 0 ms, elapsed time = 0 ms.\r\nSQL Server parse and compile time:\r\nCPU time = 0 ms, elapsed time = 8 ms.\r\n\r\nSQL Server Execution Times:\r\nCPU time = 0 ms, elapsed time = 0 ms.\r\n\r\n(528996 rows affected)\r\nTable 'Comments'. Scan count 32, logical reads 0, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 1448751, lob physical reads 9, lob page server reads 0, lob read-ahead reads 1355388, lob page server read-ahead reads 0.\r\nTable 'Comments'. Segment reads 404, segment skipped 0.\r\nTable 'Worktable'. Scan count 0, logical reads 0, physical reads 0, page server reads 0, read-ahead reads 0, page server read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob page server reads 0, lob read-ahead reads 0, lob page server read-ahead reads 0.\r\n\r\n(1 row affected)\r\n\r\nSQL Server Execution Times:\r\nCPU time = 254189 ms, elapsed time = 35970 ms.\r\nSQL Server parse and compile time:\r\nCPU time = 0 ms, elapsed time = 0 ms.\r\n\r\nSQL Server Execution Times:\r\nCPU time = 0 ms, elapsed time = 0 ms.\r\n\r\nCompletion time: 2021-10-11T16:26:16.4485011+01:00`,
            expected: {
                "data": [
                    {
                        "rowtype": 3,
                        "linenumber": 1,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 2,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 4,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 3,
                        "linenumber": 6,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 8
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 7,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 9,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 10,
                        "text": ""
                    },
                    {
                        "rowtype": 4,
                        "linenumber": 11,
                        "rowsaffected": "528996",
                        "label": " rows affected"
                    },
                    {
                        "rowtype": 1,
                        "tableid": "resultTable_0",
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            14,
                            15,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 12,
                                "table": "Comments",
                                "nostats": false,
                                "scan": 32,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 1448751,
                                "lobphysical": 9,
                                "lobpageserver": 0,
                                "lobreadahead": 1355388,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 404,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 3,
                                "linenumber": 14,
                                "table": "Worktable",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            }
                        ],
                        "total": {
                            "scan": 32,
                            "logical": 0,
                            "physical": 0,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 1448751,
                            "lobphysical": 9,
                            "lobpageserver": 0,
                            "lobreadahead": 1355388,
                            "lobpageserverreadahead": 0,
                            "segmentreads": 404,
                            "segmentskipped": 0
                        }
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 15,
                        "text": ""
                    },
                    {
                        "rowtype": 4,
                        "linenumber": 16,
                        "rowsaffected": "1",
                        "label": " row affected"
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 17,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 19,
                        "summary": false,
                        "cpu": 254189,
                        "elapsed": 35970
                    },
                    {
                        "rowtype": 3,
                        "linenumber": 21,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 22,
                        "text": ""
                    },
                    {
                        "rowtype": 2,
                        "linenumber": 24,
                        "summary": false,
                        "cpu": 0,
                        "elapsed": 0
                    },
                    {
                        "rowtype": 9,
                        "linenumber": 25,
                        "text": ""
                    },
                    {
                        "rowtype": 10,
                        "linenumber": 26,
                        "label": "Completion time: ",
                        "completiontime": "2021-10-11T16:26:16.4485011+01:00"
                    }
                ],
                "tablecount": 3,
                "total": {
                    "executiontotal": {
                        "rowtype": 7,
                        "cpu": 254189,
                        "elapsed": 35970
                    },
                    "compiletotal": {
                        "rowtype": 8,
                        "cpu": 0,
                        "elapsed": 8
                    },
                    "iototal": {
                        "columns": [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            14,
                            15,
                            13
                        ],
                        "data": [
                            {
                                "rowtype": 1,
                                "rownumber": 1,
                                "linenumber": 12,
                                "table": "Comments",
                                "nostats": false,
                                "scan": 32,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 1448751,
                                "lobphysical": 9,
                                "lobpageserver": 0,
                                "lobreadahead": 1355388,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 404,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            },
                            {
                                "rowtype": 1,
                                "rownumber": 2,
                                "linenumber": 14,
                                "table": "Worktable",
                                "nostats": false,
                                "scan": 0,
                                "logical": 0,
                                "physical": 0,
                                "pageserver": 0,
                                "readahead": 0,
                                "pageserverreadahead": 0,
                                "loblogical": 0,
                                "lobphysical": 0,
                                "lobpageserver": 0,
                                "lobreadahead": 0,
                                "lobpageserverreadahead": 0,
                                "segmentreads": 0,
                                "segmentskipped": 0,
                                "percentread": "0.000"
                            }
                        ],
                        "total": {
                            "scan": 32,
                            "logical": 0,
                            "physical": 0,
                            "pageserver": 0,
                            "readahead": 0,
                            "pageserverreadahead": 0,
                            "loblogical": 1448751,
                            "lobphysical": 9,
                            "lobpageserver": 0,
                            "lobreadahead": 1355388,
                            "lobpageserverreadahead": 0,
                            "segmentreads": 404,
                            "segmentskipped": 0
                        },
                        "tableid": "resultTableTotal"
                    }
                }
            }
        }
    }
})