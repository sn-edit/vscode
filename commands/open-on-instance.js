const vscode = require('vscode');
const fs = require('fs');
const yaml = require('js-yaml');
const { initExtension } = require('../core/config');
const { getSysID, getTable } = require('../helpers/core');

const openOnInstanceCMD = async () => {
    const engine = initExtension();
    
    if (engine.error) {
        return;
    }
    let data = {};

    try {
        let fileContents = fs.readFileSync(engine.workspacePath + '/_config/.sn-edit.yaml', 'utf8');
        data = yaml.safeLoad(fileContents);
    
        console.log(data);
    } catch (e) {
        data = null;
        console.log(e);
    }

    if (!data || !data["app"]["core"]["rest"]["url"]) {
        return vscode.window.showErrorMessage(
			"Could not get instance information from your config file! Please check and try again!"
		);
    }

    // open url
    let editor = vscode.window.activeTextEditor;
    let instanceURL = data["app"]["core"]["rest"]["url"];
    let sysID = getSysID(editor);
    let tableName = getTable(editor);

    vscode.env.openExternal(vscode.Uri.parse(instanceURL + "/" + tableName + ".do?sys_id=" + sysID));
};

module.exports = {
    openOnInstanceCMD: openOnInstanceCMD
}