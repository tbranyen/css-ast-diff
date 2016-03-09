# css-ast-diff

A tool for diffing CSS files by parsing them into Abstract Syntax Trees using [reworkcss/css](https://github.com/reworkcss/css), sorting them, and comparing the stringified output. Useful for finding *functional* changes in CSS built from a preprocessor such as [SASS](http://sass-lang.com/).

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

Compare a file to the original file in the SVN working copy):

```
css-ast-diff --svn build/style.css
```

Compare two files:

```
css-ast-diff style-new.css style-old.css
```
