/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import * as vscode from 'vscode';
import { multiStepInput } from './multiStepInput';
import * as fs from 'fs';
import { test } from './test/test.js'

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// const helloCommand = vscode.commands.registerCommand('team-build-extension.sayHello', () => {
	// 	vscode.window.showInformationMessage('Hello team');
	// });

	// Register the command to show the menu
	const disposable = vscode.commands.registerCommand('team-build-extension.showMenu', () => {
		showMenu();
	});
	subscriptions.push(disposable);
	//subscriptions.push(helloCommand)


	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	myStatusBarItem.command = 'team-build-extension.showMenu';
	subscriptions.push(myStatusBarItem);
	myStatusBarItem.text = `$(code) $(n) Team Build`;
	myStatusBarItem.show();

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(myStatusBarItem);

	// update status bar item once at start
	//vscode.commands.executeCommand('team-build-extension.sayHello');
}


function showMenu() {
	// Define menu options
	const options: vscode.QuickPickItem[] = [
		{ label: 'Initialize', description: 'Initialize the team build' },
		{ label: 'Retrieve', description: 'Retrieve modules from endevor' },
		{ label: 'Run', description: 'Run the team build' },
	];

	// Show the menu
	vscode.window.showQuickPick(options).then((selectedOption) => {
		if (selectedOption) {
			// Handle the selected option
			handleMenuOption(selectedOption.label);
		}
	});
}


async function handleMenuOption(option: string) {
	// Handle each menu option
	switch (option) {
		case 'Retrieve':
			let folderName = await vscode.window.showInputBox({
				prompt: 'Enter folder name for retrieval',
				placeHolder: 'e.g., test-folder',
				validateInput: input => {
					return input === 'vivek' ? null : 'Not Vivek';
				},
				value: 'test', // Default value (can be an empty string)
			})

			// if (folderName) {
			// 	vscode.window.showInformationMessage(`Hey There!! ${folderName}`);
			// }

			if (folderName) {
				createTestFolder()
			}

			break;
		// Add cases for 'Initialize' and 'Run' if needed
		default:
			vscode.window.showInformationMessage(`Selected: ${option}`);
			break;
	}
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

async function createTestFolder() {
	// Get the current workspace folder
	//const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	// console.log(vscode.workspace.workspaceFolders);
	test();
	if (vscode.workspace.workspaceFolders) {
		for (let [index, eachFolder] of vscode.workspace.workspaceFolders.entries()) {
			if (eachFolder.name == "Team Build") {
				//Already Existing Folder
				//Ask user for Workspace Retention
				const options: vscode.QuickPickItem[] = [
					{ label: 'Yes', description: '' },
					{ label: 'No', description: '' }
				];

				// Show the menu
				let res = await vscode.window.showQuickPick(options, { placeHolder: "Delete Existing Workspace?", title: "Delete existing Workspace?" });
				if (res?.label == 'Yes') {
					//Delete Team Build Folder
					fs.rmdirSync(eachFolder.uri.path.substring(1), { recursive: true })
					fs.mkdirSync("C:\\Users\\vvdar\\OneDrive\\Desktop\\Team Build", { recursive: true });
					await vscode.workspace.updateWorkspaceFolders(index, 1, { uri: vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\Team Build") });
				}
			}
		}
	}
	else {
		console.log('hey');
		vscode.workspace.updateWorkspaceFolders(0, null, { uri: vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\Team Build") })
	}

	// vscode.window.withProgress({
	// 	location: vscode.ProgressLocation.Notification, title: 'Please Wait...', cancellable: false,
	// }, (progress) => {
	// 	return new Promise<void>(async (resolve) => {
	// 		//fs.mkdirSync("C:\\Users\\vvdar\\OneDrive\\Desktop\\Team Build", { recursive: true });
	// 		console.log('done1');
	// 		progress.report({ increment: 0 });
	// 		await vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\Team Build") })
	// 		progress.report({ increment: 100 });
	// 		console.log('done');
	// 		resolve();
	// 	})
	// });


	// await vscode.window.withProgress({
	// 	location: vscode.ProgressLocation.Notification, title: 'Loading...', cancellable: false,
	// }, (progress) => {
	// 	return new Promise<void>((resolve) => {
	// 		setTimeout(() => {
	// 			progress.report({ increment: 100 });
	// 			resolve();
	// 		}, 6000); // 6 seconds delay
	// 	});
	// })
	// Handle the selected option after the loader
	// if (workspaceFolder) {
	// 	// Create a 'test' folder in the workspace
	// 	//const testFolder = vscode.Uri.joinPath(workspaceFolder.uri, 'test');
	// 	// vscode.workspace.fs.createDirectory(testFolder);
	// 	// vscode.window.showInformationMessage('Test folder created successfully.');
	// 	vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\VS-Code-Ext") })
	// } else {
	// 	//vscode.window.showErrorMessage('No workspace folder found.');
	// 	vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\VS-Code-Ext") })

	// 	let string = vscode.Uri.file("C:\\Users\\vvdar\\OneDrive\\Desktop\\VS-Code-Ext");
	// 	//let raw = vscode.Uri.toString(string)

	// }

}

