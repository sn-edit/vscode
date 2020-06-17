const vscode = require('vscode');
const shell = require("shelljs");

const initExtension = () => {
    // get the node path
    const nodePath = (shell.which('node').toString());
    shell.config.execPath = nodePath;

    // get the path to the sn-edit binary in a variable and use it throughout
    const snedit = (shell.which('sn-edit').toString());

    if (!snedit) {
        console.log("sn-edit not found, please install sn-edit before using this extension");
    }

    const workspacePath = vscode.workspace.workspaceFolders[0].uri.path;

    return  {
        workspacePath: workspacePath,
        shell: shell,
        snedit: snedit
    };
};

module.exports = {
    initExtension: initExtension
}