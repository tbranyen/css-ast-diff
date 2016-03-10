# css-ast-diff

A tool for diffing CSS files by parsing them into Abstract Syntax Trees using [reworkcss/css](https://github.com/reworkcss/css), sorting them, and comparing the stringified output. Useful for finding functional changes in CSS built from a preprocessor such as [SASS](http://sass-lang.com/).

## Installation

Install `css-ast-diff` as a cli using npm:

```
npm i -g css-ast-diff
```

## Usage

Compare a file to the latest commit on HEAD of its git repository (i.e. `git diff HEAD`):

```
css-ast-diff build/style.css
```

Compare a file to the original file in the SVN working copy:

```
css-ast-diff --svn build/style.css
```

Compare two files:

```
css-ast-diff style-new.css style-old.css
```

## Examples

Comparing files with rules simply rearranged should yield no differences:

```css
* {
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  background: red;
  font-size: 18px;
}

```

```css
body {
  background: red;
  font-size: 18px;
}

* {
 -moz-box-sizing: border-box;
 box-sizing: border-box;
}
```


Files with duplicate selectors and media queries show a diff with duplicate rules merged [[src](https://github.com/cshaver/css-ast-diff/blob/master/test/duplicates/src.css)] [[diff](https://github.com/cshaver/css-ast-diff/blob/master/test/duplicates/diff.css)]:

`css-ast-diff test/duplicates/diff.css test/duplicates/src.css`

```diff
Index: file
===================================================================
--- file
+++ file
@@ -2,8 +2,13 @@
   body {
     background: green;
     font-size: 21px;
   }
+
+  div {
+    margin: 0 auto;
+    text-decoration: underline;
+  }
 }

 * {
   -moz-box-sizing: border-box;
@@ -11,10 +16,17 @@
 }

 body {
   background: red;
+  background: orange;
+  background: yellow;
+  background: green;
+  background: blue;
+  background: indigo;
+  background: violet;
   font-size: 18px;
 }

 p {
   color: purple !important;
+  color: pink;
 }
\ No newline at end of file
```
