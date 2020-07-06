const vscode = require('vscode');
const path = require("path");

const getFieldName = (editor) => {
    let fileBaseName = path.basename(editor.fileName);
    let field = fileBaseName.substring(0, fileBaseName.lastIndexOf("."));
    console.debug("Getting fieldname");
    return field;
};

const getTable = (editor) => {
    let table = "";

    let currentFileName = editor.fileName;
    // split the file path based on the current OS's separator, windows and unix like differ
    currentFileName = currentFileName.split(path.sep);

    if (currentFileName[currentFileName.length - 4].length > 0) {
        // here is usually the table name
        table = currentFileName[currentFileName.length - 3];
    }

    return table;
};

const getScope = (editor) => {
    let scopeName = "global";
    let currentFileName = editor.fileName ? editor.fileName : editor.document.uri.fsPath;
    // split the file path based on the current OS's separator, windows and unix like differ
    currentFileName = currentFileName.split(path.sep);

    if (currentFileName[currentFileName.length - 4].length > 0) {
        // select the scopename from the path, this might need reworking
        scopeName = currentFileName[currentFileName.length - 4];
    }

    return scopeName;
};

module.exports = {
    getFieldName: getFieldName,
    getTable: getTable,
    getScope: getScope
}