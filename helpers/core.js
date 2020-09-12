const vscode = require('vscode');
const path = require("path");
const fs = require('fs');

const getFieldName = (editor) => {
    let fileBaseName = path.basename(editor.fileName);
    let field = fileBaseName.substring(0, fileBaseName.lastIndexOf("."));
    console.debug("Getting fieldname");
    return field;
};

const getTable = (editor) => {
    let table = "";

    let currentFileName = editor.fileName ? editor.fileName : editor.document.uri.fsPath;
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

const getSysID = (editor) => {
    console.log("Editor", editor.fileName, editor.document.uri.fspat);
    let currentFileName = editor.fileName ? editor.fileName : editor.document.uri.fsPath;
    // split the file path based on the current OS's separator, windows and unix like differ
    currentFileName = currentFileName.split(path.sep);
    let name = "";

    if (currentFileName[currentFileName.length - 4].length > 0) {
        name = currentFileName[currentFileName.length - 2];
    }

    let folderPath = currentFileName;
    folderPath.splice(folderPath.length -1, 1);
    folderPath = folderPath.join(path.sep);
    let sysIDPath = folderPath + path.sep + "sys_id.txt";
    // TODO, introduce some validation if path exists and there was any error
    let sysID = fs.readFileSync(sysIDPath).toString();

    return sysID;
}

module.exports = {
    getFieldName: getFieldName,
    getTable: getTable,
    getScope: getScope,
    getSysID: getSysID,
}