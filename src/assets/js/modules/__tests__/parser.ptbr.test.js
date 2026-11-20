import { describe, it, expect } from 'vitest'
import { parseData, rowEnum } from '../parser.js'
import langPtBr from '../../../../public/data/languagetext-pt-br.json'

describe('Parser Module - Português (Brasil)', () => {
    const result = parseData(langPtBr.sampleoutput, langPtBr)
    const byType = type => result.data.filter(row => row.rowtype === type)

    it('should parse the IO tables from the pt-BR sample output', () => {
        const ioGroups = byType(rowEnum.IO)
        expect(ioGroups).toHaveLength(2)

        expect(ioGroups[0].data.map(row => row.table))
            .toEqual(['PostTypes', 'Users', 'Comments', 'Posts', 'Worktable'])
        expect(ioGroups[0].total.scan).toBe(999188)
        expect(ioGroups[0].total.logical).toBe(17776387)
        expect(ioGroups[0].total.physical).toBe(9588)
        expect(ioGroups[0].total.readahead).toBe(1552457)

        expect(ioGroups[1].data.map(row => row.table)).toEqual(['Votes', 'Posts', 'Users'])
        expect(ioGroups[1].total.logical).toBe(457119)
        expect(ioGroups[1].total.loblogical).toBe(823463)
    })

    it('should recognise every pt-BR IO column', () => {
        const ioGroups = byType(rowEnum.IO)
        // NotFound (0) must never appear in the detected columns
        ioGroups.forEach(group => expect(group.columns).not.toContain(0))
    })

    it('should parse a line built from the real sys.messages 3615 template (language_id 1046)', () => {
        const line = "Tabela 'Pedidos'. Contagem de verificações 1, leituras lógicas 2, leituras físicas 3, " +
            "leituras de servidor de páginas 4, leituras antecipadas 5, leituras antecipadas de servidor de páginas 6, " +
            "leituras lógicas de LOB 7, leituras físicas de LOB 8, leituras de servidor de páginas LOB 9, " +
            "leituras antecipadas de LOB 10, leituras antecipadas do servidor de páginas LOB 11."
        const group = parseData(line, langPtBr).data[0]
        expect(group.columns).not.toContain(0)
        const { table, scan, logical, physical, pageserver, readahead, pageserverreadahead,
            loblogical, lobphysical, lobpageserver, lobreadahead, lobpageserverreadahead } = group.data[0]
        expect([table, scan, logical, physical, pageserver, readahead, pageserverreadahead,
            loblogical, lobphysical, lobpageserver, lobreadahead, lobpageserverreadahead])
            .toEqual(['Pedidos', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    })

    it('should parse compile and execution times', () => {
        expect(byType(rowEnum.CompileTime).map(r => [r.cpu, r.elapsed]))
            .toEqual([[108, 108], [16, 19]])
        expect(byType(rowEnum.ExecutionTime).map(r => [r.cpu, r.elapsed]))
            .toEqual([[156527, 284906], [17207, 38163]])
    })

    it('should parse rows affected, errors and completion time', () => {
        expect(byType(rowEnum.RowsAffected).map(r => r.rowsaffected))
            .toEqual(['13431682', '233033'])
        expect(byType(rowEnum.Error)[0].text).toBe('Msg 207, Nível 16, Estado 1, Linha 1')
        expect(byType(rowEnum.CompletionTime)[0].completiontime)
            .toBe('2025-05-27T10:32:37.8122685-03:00')
        expect(byType(rowEnum.RowsAffected)[0].label).toBe(' linhas afetadas')
    })

    it('should parse real pt-BR engine output with an English SSMS client', () => {
        const io = (t, s, l, p, r) => `Tabela '${t}'. Contagem de verificações ${s}, leituras lógicas ${l}, ` +
            `leituras físicas ${p}, leituras de servidor de páginas 0, leituras antecipadas ${r}, ` +
            'leituras antecipadas de servidor de páginas 0, leituras lógicas de LOB 0, leituras físicas de LOB 0, ' +
            'leituras de servidor de páginas LOB 0, leituras antecipadas de LOB 0, leituras antecipadas do servidor de páginas LOB 0.'
        const input = [
            'Tempo de análise e compilação do SQL Server: ',
            '   Tempo de CPU = 47 ms, tempo decorrido = 51 ms.',
            '',
            '(250009 rows affected)',
            io('Lancamentos', 9, 24366, 0, 0),
            io('Worktable', 0, 0, 0, 3449),
            io('Workfile', 120, 3256, 215, 3041),
            io('Produtos', 9, 929, 0, 0),
            '',
            ' Tempos de Execução do SQL Server:',
            ' Tempo de CPU = 9455 ms, tempo decorrido = 58181 ms.',
            '',
            'Completion time: 2026-11-20T14:31:56.6919224+00:00'
        ].join('\r\n')

        const parsed = parseData(input, langPtBr)
        const rows = type => parsed.data.filter(row => row.rowtype === type)

        const io_ = rows(rowEnum.IO)[0]
        expect(io_.columns).not.toContain(0)
        expect(io_.total.logical).toBe(28551)
        expect(io_.total.readahead).toBe(6490)
        expect(rows(rowEnum.CompileTime).map(r => [r.cpu, r.elapsed])).toEqual([[47, 51]])
        expect(rows(rowEnum.ExecutionTime).map(r => [r.cpu, r.elapsed])).toEqual([[9455, 58181]])
        expect(rows(rowEnum.RowsAffected)[0].rowsaffected).toBe('250009')
        expect(rows(rowEnum.CompletionTime)[0].completiontime).toBe('2026-11-20T14:31:56.6919224+00:00')
    })

    it('should match the older "linha(s) afetada(s)" and single-row formats', () => {
        const older = parseData('(5 linha(s) afetada(s))\r\n(1 linha afetada)\r\n', langPtBr)
        const rows = older.data.filter(row => row.rowtype === rowEnum.RowsAffected)
        expect(rows.map(r => [r.rowsaffected, r.label]))
            .toEqual([['5', ' linhas afetadas'], ['1', ' linha afetada']])
    })
})
