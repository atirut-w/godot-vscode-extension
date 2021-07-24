import * as net from 'net';
import * as vscode from 'vscode';

import {Trace} from 'vscode-jsonrpc';
import { window, workspace, commands, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo, Position as LSPosition, Location as LSLocation } from 'vscode-languageclient/node';

let client: LanguageClient;

export default class GodotLanguageClient {
    /**
     * Start the language client.
     */
    static start() {
        let connectionInfo = {
            port: vscode.workspace.getConfiguration('godot')["languageServerPort"]
        };
        // I don't know any other ways to communicate to a non-module & non-executable LS.
        // If there are better methods, please make an issue or a PR.
        let serverOptions = () => {
            let socket = net.connect(connectionInfo);
            let result: StreamInfo = {
                writer: socket,
                reader: socket
            };
            return Promise.resolve(result);
        };

        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'gdscript' }],
            synchronize: {
                fileEvents: workspace.createFileSystemWatcher('**/*.*')
            }
        };

        client = new LanguageClient(
            "GDScript Language Client",
            serverOptions,
            clientOptions
        );

        client.start();
        console.log("Started GDScript language client.");
    }

    /**
     * Stop the language client.
     */
    static stop() {
        if (!client) {
            return undefined;
        }
        return client.stop();
    }
};
