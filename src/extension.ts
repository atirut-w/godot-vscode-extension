import * as vscode from 'vscode';
import GodotLanguageClient from './languageClient';

export function activate(context: vscode.ExtensionContext) {
	GodotLanguageClient.start();
}

export function deactivate() {
    GodotLanguageClient.stop();
}
