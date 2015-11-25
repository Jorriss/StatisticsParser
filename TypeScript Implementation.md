# StatisticsParser to TypeScript

This is a play-by-play of how Steve Ognibene ([@nycdotnet](https://twitter.com/nycdotnet/)) converted StatisticsParser to TypeScript.

## Prerequisites
1. Prior to starting, I installed [Atom](https://atom.io/) and the [atom-typescript](https://atom.io/packages/atom-typescript) plugin (via the Packages tab under File... Settings).  There are many other editors that support TypeScript, but I like Atom best for getting started.
2. This is completely optional, but if you like the look of Visual Studio, install [Redmond-UI](https://atom.io/themes/redmond-ui) and [Redmond-Syntax](https://atom.io/themes/redmond-syntax).
3. I also installed [Node.js](https://nodejs.org/) - the latest on 4.x or 5.x is fine - to allow the use of standard TypeScript command-line tools.

I performed these tasks on Windows, but these tools are all open source and run great on Windows, Mac, and Linux.

## Initial convert
1. Fork StatisticsParser on GitHub and clone it locally.  Open a command line to the local folder and run `atom .`  This opens a new instance of Atom to the root of the StatisticsParser folder.
2. Under `src/assets/js/`, rename `statsioparser.js` to `statsioparser.ts`.
3. The Atom-TypeScript tab will show on the bottom.  You should have one error - "No project file found. Please use the 'Create tsconfig.json' command".  Let's do that.
4. Press CTRL+SHIFT+P and type tsconfig in the command palate.  Click "TypeScript: Create Tsconfig.json Project File".
5. Open and save your `statsioparser.ts` file.  This should create a `statsioparser.js` file again.  Congratulations - you have a working TypeScript implementation.
6. I checked-in this code with the comment "Finished initial convert".

## Fixing Initial errors
1. After the initial convert (which I performed using all the latest TypeScript stuff in November 25, 2015), TypeScript reported 35 errors.  TypeScript doesn't distinguish errors from warnings, though, so despite these 35 errors, it emitted the JavaScript properly and everything should still work.  Don't worry about the count - this isn't so bad.
