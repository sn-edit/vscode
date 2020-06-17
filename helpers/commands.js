const { tryParseJSON } = require('../helpers/json');
const { initExtension } = require("../core/config");

// run a command
// accepts an array of parameters
// the binary will be searched for and used from a global setting, so we just need the command and flags here
const runCommand = (command) => {
    const engine = initExtension();
    let json = false;
    if (!command || !(command instanceof Array)) {
        console.log("The params has to be an array of the parameters!");
        return 
    }

    // check if we expect a json result
    command.forEach((el) => {
        if (el == "--json") {
            json = true;
        }
    });

    // add the binary location at the start of the command
    command.unshift(engine.snedit);

    // cd to the current workspace to have correct folder
    engine.shell.cd(engine.workspacePath);

    // run command
    // TODO escape commands
    let commandResult = engine.shell.exec(command.join(" "), {silent:false}).stdout
    let result;

    if (json) {
        // we have 1..n lines of stdout result
        result = commandResult.split("\n");
        let error = hasError(result);
    
        if (error.error !== null) {
            return error;
        }
    } else {
        // no pre-processing of JSON, since we expect a string only
        result = commandResult;
    }

    return {error: null, data: result};
};

// accepts an array of json strings from a command that has been run
// returns either the error object (from snedit or something custom, but it is an object in any case)
/**
 * @param {any[]} jsonArray
 */
const hasError = (jsonArray) => {
    if (!jsonArray || !(jsonArray instanceof Array)) {
        console.log("The params has to be an array of the parameters!");
        return;
    }

    // filter out array elements where the element is an empty string
    // this is the result of stdout \n at the end of every output
    jsonArray = jsonArray.filter((el) => {
        return el != "";
    });

    jsonArray.forEach(element => {
        // try to parse individual json string, there can be 1..n lines
        // we should not have malformed JSON in the command output in any case
        let parsedJSON = tryParseJSON(element);
        if (parsedJSON === false) {
            return {error: "We could not parse JSON string! Malformed JSON!"};
        }

        if (element.error) {
            return element;
        }
    });

    return {error: null};
};

module.exports = {
    runCommand: runCommand
};
