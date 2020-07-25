const vscode = require('vscode');
const { searchCMD } = require('./search');
const { setStatusbarMessage } = require('../helpers/statusbar');
const { runCommand } = require("../helpers/commands");
const { tryParseJSON } = require('../helpers/json');

const downloadCMD = async() => {
    let options = {};

    setStatusbarMessage(`$(loading~spin) Loading and processing table data...`, 3000);

    // table name
    options = {
        placeholder:  "Select the table you want to see the fields for!"
    };

    let table = await searchCMD(options);

    if (!table) {
        return vscode.window.showErrorMessage(
            "Please select a table so we are able to download your data!"
        )
    }

    setStatusbarMessage(`$(loading~spin) Loading entries from table ${table.name}`, 3000);

    options = {
        table: table.name,
        query: "active=true",
        placeholder:  "Select the entry you would like to download!"
    };

    let table_entry = await searchCMD(options);

    if (!table_entry) {
        return vscode.window.showErrorMessage(
            "Please select an entry so we are able to download your data!"
        )
    }

    let tableName = table.name;
    let sysID = table_entry.sys_id;

    // run download command
    const command = ["download", "--table", tableName, "--sys_id", sysID, "--json"];

    // result is the array of jsons in this case
    let commandResult = await runCommand(command);
    
    //TODO:  if commandResult.error != null then we have an error

    commandResult.data.forEach((res) => {
        let resJSON = tryParseJSON(res);
        
        if (resJSON.level === "error" && resJSON.error) {
            return vscode.window.showErrorMessage(
                "There was an error while downloading your entry! (" + resJSON.error + ")",
            );
        }

        if (resJSON && resJSON.table_name === tableName && resJSON.sys_id === sysID) {
            if (table_entry["unique_key"]) {
                return vscode.window.showInformationMessage(
                    "Entry \"" + table_entry[table_entry["unique_key"]] + "\" from table " + tableName + " successfully downloaded!",
                );
            } else {
                return vscode.window.showInformationMessage(
                    "Entry from table " + tableName + "[" + sysID + "] successfully downloaded!",
                );
            }
        }
    });
};

module.exports = {
    downloadCMD: downloadCMD
};