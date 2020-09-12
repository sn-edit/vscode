# Change Log

All notable changes to the "sn-edit" extension will be documented in this file.

## [Unreleased]
- ...

## v0.0.2
Upgraded dependencies.
New command "Open on Instance" [#15](https://github.com/sn-edit/vscode/issues/15)
This command lets you open a currently edited entry on your instance
I did set up a keyboard shortcut for it.

Here are the combinations per platform:
Windows: `ctrl+alt+X`
Linux: `ctrl+alt+X`
Mac: `shift+cmd+X`

If this shortcut conflicts with something else you are using, you can change it under `File -> Preferences -> Keyboard Shortcuts`. Just search for `sn-edit` and change it as you wish.

You can also run this command through the usual place, under the command palette.
For this command to work correctly, you need to be inside of a workspace, with a `_config/.sn-edit.yaml` file present. I am reading the information regarding your instance url from this config file. The details should be valid, because this config file is used for downloading/uploading too. 

## v0.0.1
Initial release of the extension

- Downloading of entries
- Uploading entries onsave
- Update set management, like displaying the currently selected update set and setting a new default one that would be used in subsequent calls in your session
- To choose a different update set, just click on the right bottom on the update set name and you should be presented with a list of other update sets
- We support basic authentication only but if there will be popular demand on other types, we are able to do it
- We support scopes, that means your entries will be saved in the specific scope they belong to
- No support for creating new entries for now
- We support searching for tables and their entries inside of vscode. After picking your entry, the entry gets downloaded locally

Please report and give feedback to make this extension better.