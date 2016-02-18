# StatisticsParser to TypeScript

This is a play-by-play of how Steve Ognibene ([@nycdotnet](https://twitter.com/nycdotnet/)) converted StatisticsParser to TypeScript.

## Prerequisites
1. Prior to starting, I installed [Atom](https://atom.io/) and the [atom-typescript](https://atom.io/packages/atom-typescript) plugin (via the Packages tab under File... Settings).  There are many other editors that support TypeScript, but I like Atom best for getting started.
2. This is completely optional, but if you like the look of Visual Studio, install [Redmond-UI](https://atom.io/themes/redmond-ui) and [Redmond-Syntax](https://atom.io/themes/redmond-syntax).
3. I also installed [Node.js](https://nodejs.org/) - the latest on 4.x or 5.x is fine - to allow the use of standard TypeScript command-line tools.

I performed these tasks on Windows, but these tools are all open source and run great on Windows, Mac, and Linux.

## Initial Convert
1. Fork StatisticsParser on GitHub and clone it locally.  Open a command line to the local folder and run `atom .`  This opens a new instance of Atom to the root of the StatisticsParser folder.
2. Under `src/assets/js/`, rename `statsioparser.js` to `statsioparser.ts`.
3. The Atom-TypeScript tab will show on the bottom.  You should have one error - "No project file found. Please use the 'Create tsconfig.json' command".  Let's do that.
4. Press CTRL+SHIFT+P and type tsconfig in the command palate.  Click "TypeScript: Create Tsconfig.json Project File".
5. Open and save your `statsioparser.ts` file.  This should create a `statsioparser.js` file again.  Congratulations - you have a working TypeScript implementation.
6. I checked-in this code with the comment "Finished initial convert".

After the initial convert (which I performed using all the latest TypeScript stuff in November 25, 2015), TypeScript reported 35 errors.  TypeScript doesn't distinguish errors from warnings, though, so despite these 35 errors, it emitted the JavaScript properly and everything should still work.  Don't worry about the count - this isn't so bad.  If you look at the changes in `statsioparser.js`, you'll see that the major differences after having gone through the TypeScript transpiler are changed whitespace, removal of comments (the default `tsconfig.json` in atom-typescript has `removeComments: true`), and adding semicolons where they were missing.  This is very important: **The code emitted by TypeScript looks almost exactly like the code you wrote**.

## Fixing Type Errors
TypeScript is sometimes cranky and getting it to compile existing JS code without complaining can sometimes take a bit of time.

I see a lot of `Cannot find name $` errors.  TypeScript warns when a variable is used (`$` in this case) without it being declared, which is a good thing.  The `$` is jQuery.  TypeScript supports using definition files to interact with libraries that are written in pure JavaScript.  They allow describing the API of the JavaScript-based library in TypeScript, but definition files don't actually emit any code - they're only used at develop and compile time so there is no runtime cost.  Many JS libraries have been described in TypeScript definition files by the [DefinitelyTyped project](http://definitelytyped.org/).  They expose their library with a Node.js command-line tool `tsd`.

1. Open your "Node.js" command-line.
2. If you don't already have tsd, run `npm install -g tsd`.  That will install `tsd` globally (so it will work from any path in a Node.js command-line).
3. Now that you have `tsd`, navigate to the StatisticsParser folder (same folder as the `Sample Query StackOverflow.sql`).
4. Run `tsd init`.  This will create `tsd.json`, a `typings` folder and a `tsd.d.ts` file.
5. Since we know we want jquery, let's search for that with tsd: `tsd query jquery`.  TSD will respond that it knows about jquery and it will show where it lives in the Definitely Typed repository.
6. Let's install that definition in our project: `tsd query jquery --action install --save`.  That will install the definition in the `typings` folder and add `jquery` to the `tsd.json` file.
7. One important thing that I didn't mention in the previous section is that it's most convenient for the `tsconfig.json` to live at the root of your project - so drag and drop tsconfig.json to the same folder as `tsd.json`.  This will adjust the compilation context to include the entire StatisticsParser folder structure.
8. Go back to atom and open `statsioparser.ts`.  You may have to click the refresh circle in the lower-right, but now TypeScript should be down to 32 errors.  - Why didn't it go a lot lower?  Well, now TypeScript knows about `$`, but it doesn't think that `$.cookies` or `$().dataTable` are valid.  Let's fix those next.

## Fixing Type Errors with DataTables (Somewhat Advanced)
DefinitelyTyped has great type definitions for many, but not all JavaScript libraries.  In this section I'll describe how I got some of the definitions working that were missing or not-quite-right.

1. I found that DefinitelyTyped did have a definition for [jQuery.Datatables](http://www.datatables.net/) by running `tsd query jquery.dataTables`, so I installed it via `tsd query jquery.dataTables --action install --save`.  However, this didn't fix any errors.  The reason is that StatisticsParser seems to be using an old syntax for jQuery.Datatables.  The syntax is supported in the definition but not fully exposed.  Let's fix that.
2. Note in the error list for `statsioparser.ts`, it mentions that property `dataTable` does not exist on `JQuery`.  Let's fix that.
3. Open `typings/jquery.dataTables/jquery.dataTables.d.ts`.  On line 14, add another property to JQuery for `dataTable`: `dataTable(param?: DataTables.Settings): DataTables.DataTable;`.  This changes the errors in `statsioparser.ts` to a type not assignable error.  This is because the lower-case `dataTable` seems to expect legacy parameters.  Thankfully, the legacy parameters are still defined in the definition in an interface called `SettingsLegacy`.  Change the type of `param` to `DataTables.SettingsLegacy`.  Also (unfortunately), it's necessary to mark all properties of SettingsLegacy as optional - because technically it is a property bag. For example, line 1661 should be changed to `ajax?: any;`.  Change all of the properties to optional.
4. Now the error is somewhat different (you may have to expand the twisty to see both lines of the error) - Object literal may only specify known properties, and bFilter does not exist in type SettingsLegacy.  This is true, but it does exist in `FeaturesLegacy`.  So let's update the `dataTable` param to accept a `DataTables.SettingsLegacy` unioned with a `DataTables.FeaturesLegacy`.   Change line 15 to `dataTable(param?: DataTables.SettingsLegacy | DataTables.FeaturesLegacy): DataTables.DataTable;`  You'll also have to mark the properties of `FeaturesLegacy` as optional.
5. One error is gone, but there is still another in `statsioparser.ts`: `sScrollY` does not exist.  Let's add `sScrollY` to the SettingsLegacy interface: `sScrollY?: string;`.  We get a similar error for `bScrollCollapse` - let's add that.  `bScrollCollapse?: boolean;`
6. Great - all of our DataTables errors are gone.  These could probably have all been in the actual definition on DefinitelyTyped, so it may be worth contributing these fixes back.

## Fixing Numeral and Cookies errors
I was unable to find definitions for Numeral or Cookies on DefinitelyTyped.  The easiest way to accept this and move on is to create a definition file for them and just stub their global objects as type `any`.  The paths and file names in this section are optional, but they will work with how `tsd` does it if the definitions are ever contributed back.

1. Create a new folder under typings called `jaaulde-jquery-cookies` with a file called `jaaulde-jquery-cookies.d.ts`.  This follows the convention to use the `npm` ID of the package as the definition folder name.  In `jaaulde-jquery-cookies.d.ts`, add this content:

```TypeScript
interface JQueryStatic {
    cookies?: any;
}
```

2. Create a new folder under typings called `numeral`.  In there, create a new file called `numeral.d.ts`.  Add the following content:
```TypeScript
declare var numeral: any;
```

It's possible to add more explicit typing info to these definitions, but this will get us compiling cleanly for now.  We should be down to 10 issues in `statsioparser.ts`.  I checked this in as "Fixed jQuery, DataTables, Numeral, and Cookies"

## Wrapping up the errors
An annoying thing about TypeScript is that it's unnecessarily cranky regarding manipulating the DOM.  Let's work through some of those errors first, and then clean up the rest of them.

1. In `statsioparser.ts`, hover the mouse pointer over `txt` on line 3.  You should see that TypeScript thinks `txt` is an `HTMLElement` - this is true, but this is the base interface for any HTML element.  It should be an `HTMLTextAreaElement`, but there is currently no way for TypeScript to know that so we have this crummy experience.  The fix is to cast the result of the `getElementById` call as `HTMLTextAreaElement`.   `var txt = <HTMLTextAreaElement>document.getElementById("statiotext");`  That fixes the issue and now TypeScript thinks `txt` is an `HTMLTextAreaElement` which it knows has a `value` property.
2. Line 264 has a slightly different problem.  Since we're getting the element and using the `value` property all on one line, we need to do our cast in parentheses which is really ugly.   `var formattedOutput = parseOutput( (<HTMLTextAreaElement>document.getElementById("statiotext")).value, lang);`
3. Fix lines 476 and 477 using the parentheses trick.

```TypeScript
(<HTMLTextAreaElement>document.getElementById("statiotext")).value = '';
(<HTMLInputElement>document.getElementById("exampleCheck")).checked = false;
```

4. Line 157 has two errors, though only one is valid.  Supplied parameters do not match any signature of the call target.  The issue is that this call to the `statsIOInfo` constructor has just three parameters, but `statsIOInfo` requires ten.  Click `statsIOInfo` and press F12 to go to definition.  Starting with the third parameter, mark the params as optional: `function statsIOInfo(rownumber, langText, table, scan?, logical?, physical?, readahead?, loblogical?, lobphysical?, lobreadahead?) {`.

5. Now we just have one more error - cannot find name 'Moment'.  Moment is a popular library that has definitions on DefinitelyTyped.  From inside the StatisticsParser folder, run `tsd query moment` and assuming it comes back OK (it should), run `tsd query moment --action install --save`.  To get this definition working completely, it's also necessary to run `tsd query moment-node --action install --save`  (it's broken-out into two files).

6. Click the refresh circle in the lower-right of the TypeScript bar to tell atom-typescript to rescan for TypeScript files, and everything should be compiling without error.

There's plenty more that can be done, but this is what was required to get StatisticsParser working with TypeScript using Atom and the atom-typescript plugin as of November 25, 2015.  For example, switching TypeScript to `noImplicitAny` mode reveals 69 more issues (mostly missing type annotations on method signatures), but this is an optional, stricter mode.  Also, it would be useful to build-out the definitions for `jaaulde-jquery-cookies` and `numeral` (or migrate to similar libraries that have TypeScript definitions like `numbro` and `jquery.cookie`).

I checked-in the code as "Finished conversion - all errors resolved".
