const vscode = require('vscode');
const { tryParseJSON } = require('../helpers/json');
const { runCommand } = require("../helpers/commands");

const searchCMD = async (options) => {
    let table = options.table;
    let query = options.encodedQuery;
    let placeholder = options.placeholder;


    if (!options.query) {
        query = "active=true";
    }

    if (!options.table) {
        table = "sys_db_object";
    }

    //search --table sys_db_object --encoded_query active=true --fields name,sys_id --limit 1 --json
    const command = ["search", "--table", table, "--encoded_query", query, "--fields", "label,name,sys_id", "--limit", "9999", "--json"];

	// result is the array of jsons in this case
	let commandResult = await runCommand(command);

    // resulting JSON parsed into an object
    let result = {};
    let uniqueKey = null;

	commandResult.data.forEach((res) => {
        let resJSON = tryParseJSON(res);

		if (resJSON && resJSON.result) {
            result = tryParseJSON(resJSON.result);
            if (resJSON.unique_key) {
                uniqueKey = resJSON.unique_key;
            }
            
            return
		}
    });
    
    if (result === false) {
        return vscode.window.showErrorMessage(
            "Could not find results in the response!"
        );
    }

    // options
    const pickerOptions = {
        placeHolder: placeholder ? placeholder : "",
    };

    // rewrite object to use for quickpick
    console.debug("Unique key " + uniqueKey);

    console.debug("Found results " + result.result.length);

    // add the table name to the label, since we can have many tables with the same label...
    result.result.forEach(el => {
        if (uniqueKey) {
            el.label = el[uniqueKey];
        } else {
            el.label = el.label + " [" + el.name + "]";
        }
    });
    
    let choice = await vscode.window.showQuickPick(result.result, pickerOptions);

    if (uniqueKey) {
        choice["unique_key"] = uniqueKey;
    }

    // return the selected choice
    return choice;
}

module.exports = {
    searchCMD: searchCMD
}