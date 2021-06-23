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
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.mutateCode', () => {
		const webWorkerUrl = vscode.workspace.getConfiguration().codemutationtool.webWorkerUrl
			|| 'http://localhost:3003/';

		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let selection = editor.selection;

		// Get the word within the selection
		let selectionContent = document.getText(selection);

		// let updatedContent = processor.run(selectionContent);
		let updatedContentPromise = axios.post(webWorkerUrl, {
			code: selectionContent
		})

		updatedContentPromise.then((updatedContentResp) => {
			const updatedContent = updatedContentResp.data.text || `${selectionContent}\n//no text data received`
			editor.edit((editBuilder) => {
				editBuilder.replace(selection, updatedContent);
			});
		})

		// Display a message box to the user

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
