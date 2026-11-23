import { describe, it, expect, beforeEach } from 'vitest';
import { displayParsedData } from '../displaystats.js';
import { rowEnum, columnIOEnum } from '../parser.js';
import langEn from '../../../../public/data/languagetext-en.json';
import langEs from '../../../../public/data/languagetext-es.json';
import langIt from '../../../../public/data/languagetext-it.json';

const languages = { en: langEn, es: langEs, it: langIt };

function getParsedData(summary) {
    return {
        data: [
            {
                rowtype: rowEnum.IO,
                data: [{ rownumber: 1, table: 'Worktable', scan: 1 }],
                total: { scan: 1 },
                columns: [columnIOEnum.Table, columnIOEnum.Scan],
                tableid: 'resultTable_0'
            },
            { rowtype: rowEnum.ExecutionTime, cpu: 10, elapsed: 20, summary: summary }
        ],
        tablecount: 1,
        total: {
            iototal: {
                data: [{ table: 'Worktable', scan: 1 }],
                total: { scan: 1 },
                columns: [columnIOEnum.Table, columnIOEnum.Scan],
                tableid: 'resultTableTotal'
            },
            executiontotal: { cpu: 10, elapsed: 20 },
            compiletotal: { cpu: 0, elapsed: 0 }
        }
    };
}

function getTexts(selector) {
    return [...document.querySelectorAll(selector)].map(td => td.textContent);
}

function getFooterTexts() {
    return getTexts('#result tfoot td');
}

// First non empty cell of each footer row. DataTables may copy a footer
// into its scroll container, so a table can show up more than once.
function getFooterLabels() {
    return [...document.querySelectorAll('#result tfoot tr')]
        .map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent).find(text => text !== ''));
}

describe('displayParsedData language text', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="result"></div>';
    });

    it('should have the display text keys in every language file', () => {
        Object.values(languages).forEach(lang => {
            expect(lang.total).toEqual(expect.any(String));
            expect(lang.summaryrownotadded).toEqual(expect.any(String));
        });
    });

    Object.entries(languages).forEach(([code, lang]) => {
        it(`should show the total and summary row text in ${code}`, () => {
            displayParsedData(getParsedData(true), false, lang);
            const labels = getFooterLabels();

            // IO table, IO totals table, time totals table and the summary row
            expect(new Set(labels)).toEqual(new Set([lang.total, lang.summaryrownotadded]));
            expect(labels.filter(text => text === lang.total).length).toBeGreaterThanOrEqual(3);
        });
    });

    it('should not show the summary row text when there is no summary row', () => {
        displayParsedData(getParsedData(false), false, langEs);

        expect(getFooterTexts()).not.toContain(langEs.summaryrownotadded);
    });

    it('should fall back to English when a language file does not have the keys', () => {
        const lang = { ...langEs };
        delete lang.total;
        delete lang.summaryrownotadded;

        displayParsedData(getParsedData(true), false, lang);
        const labels = getFooterLabels();

        expect(new Set(labels)).toEqual(new Set(['Total', 'Summary row detected. Row not added to total.']));
        expect(labels.filter(text => text === 'Total').length).toBeGreaterThanOrEqual(3);
        expect(getFooterTexts().join(' ')).not.toContain('undefined');
    });
});
