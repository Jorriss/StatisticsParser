# StatisticsIOParser Version History #

## Version 0.4.4 ##
July 13, 2014

- Added the ability for a Statistics IO output be passed through a URL parameter named data.

## Version 0.4.3 ##
June 18, 2014

- Fixed a bug that prevented the output table from being reset if there were more than one Statistics IO output.

## Version 0.4.2 ##
May 26, 2014

- Fixed a bug that prevented the a output table from being written.

## Version 0.4.1 ##
April 29, 2014

- Now parses SQL Server errors and displays them in red.

## Version 0.4.0 ##
April 27, 2014

- Rebranded site to StatisticsParser.com
- Created a favion.

## Version 0.3.3 ##
April 27, 2014

- Added an option to make tables scrollable.
- Upgraded project to Bootstrap 3

## Version 0.3.2 ##
April 25, 2014

- Fixed an error that bootstrap was throwing upon load.
- Fixed an issue where site wouldn't parse in IE 8.
- Moved language data into JSON files.
- Applied formatting to Rows Affected text.
- Created new sample query based on StackOverflow database.

## Version 0.3.1 ##
April 14, 2014

- Output from Statistics Time are now formatted in hh:mm:ss.000 format.
- Version number now a js funciton.

## Version 0.3.0 ##
April 9, 2014

- Output from Statistics Time are now formatted and totaled.

## Version 0.2.4 ##
March 7, 2014

- Numbers in the table are now formatted.

## Version 0.2.3 ##
February 11, 2014

- Added a clear button. If there is a result displayed the clear button will clear the result. If there is no result displayed the clear button will clear the text area.
- Changed the Parse button color to blue. Because blue. 

## Version 0.2.2 ##
January 28, 2014

- Corrected the table headers for Spanish Statistics IO output. 

## Version 0.2.1 ##
January 27, 2014

- Statistics IO output in Spanish will be parsed. 

## Version 0.2.0 ##
January 26, 2014

- Information that isn't Statistics IO output will not be placed in a data table it will be written as text. 
- If more than one output from Statistics IO is intended to be parsed a table will be created for each output.

## Version 0.1.0 ##
May 14, 2013

- Initial version. 
- This version will take Statistics IO output from a SQL Server query and parse it. 
- All output will be put in the output table.