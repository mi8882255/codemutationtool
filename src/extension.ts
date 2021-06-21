// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
const parse = require('@babel/parser').parse;
const generate = require('@babel/generator').default;
const axios = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codemutationtool" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.mutateCode', () => {
		// The code you place here will be executed every time your command is executed
		// if (!vscode.workspace.workspaceFolders) {
		// 	return;
		// }

		// const globalWorkerPath = vscode.workspace.getConfiguration().codemutationtool.globalWorkerPath;

		// console.log(globalWorkerPath);

		// const codeDirName = fs.existsSync(globalWorkerPath+'/processor.js') 
		// 	? globalWorkerPath 
		// 	: vscode.workspace.workspaceFolders[0].uri.fsPath;

		// console.log(codeDirName);
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let selection = editor.selection;

		// Get the word within the selection
		let selectionContent = document.getText(selection);

		// let updatedContent = processor.run(selectionContent);
		let updatedContentPromise = axios.post('http://localhost:5003/', {
			code: selectionContent
		})

		updatedContentPromise.then((updatedContentResp)=>{
			const updatedContent = updatedContentResp.data.text || '//no text data received'
			editor.edit((editBuilder) => {
				editBuilder.replace(selection, updatedContent);			
			});
		})



		// if(fs.existsSync(codeDirName+'/processor.js')) {
		// 	try {
		// 		delete require.cache[require.resolve(codeDirName+'/processor.js')];
		// 		const processor = require (codeDirName+'/processor.js')(parse, generate, vscode);
		// 		processor.process();
		// 	} catch (e) {console.log(e);}

		// } else {
		// 	vscode.window.showInformationMessage('Do nothing');
		// }

		// Display a message box to the user

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
