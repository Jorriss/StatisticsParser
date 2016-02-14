# Example Statistics IO Output

## Input statement

SQL Server parse and compile time:<br /> 
   CPU time = 108 ms, elapsed time = 108 ms.

(13431682 row(s) affected)<br />
Table 'PostTypes'. Scan count 1, logical reads 2, physical reads 1, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Users'. Scan count 5, logical reads 42015, physical reads 1, read-ahead reads 41306, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Comments'. Scan count 5, logical reads 1089402, physical reads 248, read-ahead reads 1108174, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'PostTags'. Scan count 5, logical reads 77500, physical reads 348, read-ahead reads 82219, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Posts'. Scan count 5, logical reads 397944, physical reads 9338, read-ahead reads 402977, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Worktable'. Scan count 999172, logical reads 16247024, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Worktable'. Scan count 0, logical reads 0, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.

 SQL Server Execution Times:<br />
   CPU time = 156527 ms,  elapsed time = 284906 ms.<br />
SQL Server parse and compile time:<br />
   CPU time = 16 ms, elapsed time = 19 ms.<br />

(233033 row(s) affected)<br />
Table 'Worktable'. Scan count 0, logical reads 0, physical reads 0, read-ahead reads 0, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Votes'. Scan count 1, logical reads 250128, physical reads 10, read-ahead reads 250104, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.<br />
Table 'Posts'. Scan count 1, logical reads 165586, physical reads 18, read-ahead reads 49191, lob logical reads 823463, lob physical reads 42854, lob read-ahead reads 3272.<br />
Table 'Users'. Scan count 1, logical reads 41405, physical reads 3, read-ahead reads 41401, lob logical reads 0, lob physical reads 0, lob read-ahead reads 0.

 SQL Server Execution Times:<br />
   CPU time = 17207 ms,  elapsed time = 38163 ms.<br />
Msg 207, Level 16, State 1, Line 1<br />
Invalid column name 'scores'.<br />
SQL Server parse and compile time:<br />
   CPU time = 0 ms, elapsed time = 0 ms.

 SQL Server Execution Times:<br />
   CPU time = 0 ms,  elapsed time = 0 ms.

## Output Statement

|                                    | CPU          | Elapsed      |
|------------------------------------|--------------|--------------|
| SQL Server parse and compile time: | 00:00:00.108 | 00:00:00.108 |

**13,431,682 rows affected**

| Row Num | Table     | Scan Count | Logical Reads | Physical Reads | Read-Ahead Reads | LOB Logical Reads | LOB Physical Reads | LOB Read-Ahead Reads | % Logical Reads of Total Reads |
|---------|-----------|-----------:|--------------:|---------------:|-----------------:|------------------:|-------------------:|----------------------|-------------------------------:|
|         | Total     | 999,193    | 17,853,887    | 9,936          | 1,634,676        | 0                 | 0                  | 0                    |                                |
|         | PostTypes | 1          | 2             | 1              | 0                | 0                 | 0                  | 0                    | 0.000                          |
|         | Users     | 5          | 42,015        | 1              | 41,306           | 0                 | 0                  | 0                    | 0.235                          |
|         | Comments  | 5          | 1,089,402     | 248            | 1,108,174        | 0                 | 0                  | 0                    | 6.102                          |
|         | PostTags  | 5          | 77,500        | 348            | 82,219           | 0                 | 0                  | 0                    | 0.434                          |
|         | Posts     | 5          | 397,944       | 9,338          | 402,977          | 0                 | 0                  | 0                    | 2.229                          |
|         | Worktable | 999,172    | 16,247,024    | 0              | 0                | 0                 | 0                  | 0                    | 91.000                         |
|         | Worktable | 0          | 0             | 0              | 0                | 0                 | 0                  | 0                    | 0.000                          |

|                             | CPU          | Elapsed      |
|-----------------------------|--------------|--------------|
| SQL Server Execution Times: | 00:02:36.527 | 00:04:44.906 |

|                                    | CPU          | Elapsed      |
|------------------------------------|--------------|--------------|
| SQL Server parse and compile time: | 00:00:00.016 | 00:00:00.019 |

**233,033 rows affected**

| Row Num | Table     | Scan Count | Logical Reads | Physical Reads | Read-Ahead Reads | LOB Logical Reads | LOB Physical Reads | LOB Read-Ahead Reads | % Logical Reads of Total Reads |
|---------|----------:|-----------:|--------------:|---------------:|-----------------:|------------------:|-------------------:|---------------------:|-------------------------------:|
|         | Total     | 3          | 457,119       | 31             | 340,696          | 823,463           | 42,854             | 3,272                |                                |
|         | Worktable | 0          | 0             | 0              | 0                | 0                 | 0                  | 0                    | 0.000                          |
|         | Votes     | 1          | 250,128       | 10             | 250,104          | 0                 | 0                  | 0                    | 54.718                         |
|         | Posts     | 1          | 165,586       | 18             | 49,191           | 823,463           | 42,854             | 3,272                | 36.224                         |
|         | Users     | 1          | 41,405        | 3              | 41,401           | 0                 | 0                  | 0                    | 9.058                          |

|                             | CPU          | Elapsed      |
|-----------------------------|--------------|--------------|
| SQL Server Execution Times: | 00:00:17.207 | 00:00:38.163 |

**Msg 207, Level 16, State 1, Line 1<br />
Invalid column name 'scores'.**

|                                    | CPU          | Elapsed      |
|------------------------------------|--------------|--------------|
| SQL Server parse and compile time: | 00:00:00.000 | 00:00:00.000 |

|                             | CPU          | Elapsed      |
|-----------------------------|--------------|--------------|
| SQL Server Execution Times: | 00:00:00.000 | 00:00:00.000 |

#### Totals:

| Table     | Scan Count | Logical Reads | Physical Reads | Read-Ahead Reads | LOB Logical Reads | LOB Physical Reads | LOB Read-Ahead Reads | % Logical Reads of Total Reads |
|-----------|-----------:|--------------:|---------------:|-----------------:|------------------:|-------------------:|---------------------:|-------------------------------:|
| Total     | 999,196    | 18,311,006    | 9,967          | 1,975,372        | 823,463           | 42,854             | 3,272                |                                |
| Comments  | 5          | 1,089,402     | 248            | 1,108,174        | 0                 | 0                  | 0                    | 5.949                          |
| Posts     | 6          | 563,530       | 9,356          | 452,168          | 823,463           | 42,854             | 3,272                | 3.078                          |
| PostTags  | 5          | 77,500        | 348            | 82,219           | 0                 | 0                  | 0                    | 0.423                          |
| PostTypes | 1          | 2             | 1              | 0                | 0                 | 0                  | 0                    | 0.000                          |
| Users     | 6          | 83,420        | 4              | 82,707           | 0                 | 0                  | 0                    | 0.456                          |
| Votes     | 1          | 250,128       | 10             | 250,104          | 0                 | 0                  | 0                    | 1.366                          |
| Worktable | 999,172    | 16,247,024    | 0              | 0                | 0                 | 0                  | 0                    | 88.728                         |

|                                    | CPU          | Elapsed      |
|------------------------------------|--------------|--------------|
| SQL Server parse and compile time: | 00:00:00.124 | 00:00:00.127 |
| SQL Server Execution Times:        | 00:02:53.734 | 00:05:23.069 |
| Total                              | 00:02:53.858 | 00:05:23.196 |
