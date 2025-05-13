/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Location,
	CompletionItemKind,
	CodeLens,
	Hover,
	ReferenceParams,
	FoldingRange,
	FoldingRangeKind,
	SignatureHelp
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import ControlSequenceManager from './ControlSequenceManager';
import DefinitionManager, { SymbolDefinition } from './DefinitionManager';
import ActionManager from './ActionManager';
import * as utils from "./utils";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	console.log('Initializing In-Silico Language server');

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Goto definition support
			definitionProvider: true,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			},
			codeActionProvider: true,
			codeLensProvider: {
				resolveProvider: true
			},
			hoverProvider: true,
			foldingRangeProvider: true,
			referencesProvider: true,
			signatureHelpProvider: {
				triggerCharacters: ['(', ',']
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
});

connection.onInitialized(() => {
	console.log("In Silico Language Server has been initialized.");
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// Cache the settings of all open documents
const documentSettings = new Map<string, Thenable<ExampleSettings>>();

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

const symbols: Record<string, Map<string, SymbolDefinition>> = {};

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	const diagnostics: Diagnostic[] = [];
	const lines = change.document.getText().split(/\r?\n/g);

	let index = 0;

	const controlManager = new ControlSequenceManager();
	const definitionManager = new DefinitionManager(change.document.uri);

	for (const line of lines) {
		diagnostics.push(...controlManager.parse(line, index));
		diagnostics.push(...definitionManager.parse(line, index));

		index++;
	}

	symbols[change.document.uri] = definitionManager.definitions;

	// Send the computed diagnostics to VS Code.
	connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
});

connection.onDefinition((params: TextDocumentPositionParams): Location | null => {
	const uri = params.textDocument.uri;
	const lineText = documents.get(uri)?.getText({
		start: { line: params.position.line, character: 0 },
		end: { line: params.position.line + 1, character: 0 }
	}) || '';

	const match = utils.getTokenByPosition(lineText, params.position.character);

	// Find word at position
	if (!match) { return null; }

	const definitions = symbols[uri];
	if (!definitions) { return null; }


	const def = definitions.get(match);
	if (!def) { return null; }

	return def.location;
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		const uri = _textDocumentPosition.textDocument.uri;

		// Extract current word for basic prefix matching
		const definitions = symbols[uri];
		const items = [];

		for (const [key, value] of definitions.entries()) {
			items.push({
				label: key,
				kind: value.type,
				data: value
			});
		}

		return items;
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		const data = item.data as SymbolDefinition;

		if (data.type == CompletionItemKind.Function) {
			item.insertText = `${data.name}()`;
		}

		if (data.type == CompletionItemKind.Keyword) {
			item.insertText = data.name;
		}

		return item;
	}
);

connection.onCodeAction((params) => {
	const errors = params.context.diagnostics;
	const actions = new ActionManager(params);

	for (const error of errors) {
		actions.handle(error);
	}

	return actions.get();
});

connection.onCodeLens((params) => {
	const document = documents.get(params.textDocument.uri);
	if (!document) { return []; }

	let index = 0;
	const lines = document.getText().split("\n");
	const lenses: CodeLens[] = [];

	for (const line of lines) {
		if (line.includes("drop bombs we")) {
			const args = (line.match(/\(.+\)/)?.at(0) ?? "").split(",");

			lenses.push(
				{
					command: {
						title: `Parameters: ${args.length}`,
						command: ""
					},
					range: {
						start: {
							character: line.indexOf("drop"),
							line: index
						},
						end: {
							character: line.indexOf(")"),
							line: index
						}
					}
				}
			);
		}

		index += 1;
	}

	return lenses;
});

connection.onCodeLensResolve((lens) => {
	console.log(lens);

	return lens;
});

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
	const document = documents.get(params.textDocument.uri);
	if (!document) {return null;}


	const line = document.getText({ start: { character: 0, line: params.position.line }, end: { character: 9999, line: params.position.line } });
	const definitions = symbols[document.uri];
	const match = utils.getTokenByPosition(line, params.position.character);

	if (match && definitions.has(match)) {
		const definition = definitions.get(match) as SymbolDefinition;
		
		switch (definition.type) {
			case CompletionItemKind.Function:
				return {
					contents: {
						kind: 'markdown',
						value: `\`\`\`in-silico\ndrop bombs we ${definition.name}\n\`\`\``
					}
				};
		
			default:
				return {
					contents: {
						kind: 'markdown',
						value: `\`\`\`in-silico\nset ${definition.name}\n\`\`\``
					}
				};
		}
	}

	return null;
});

connection.onReferences((params: ReferenceParams): Location[] | null  => {
	const document = documents.get(params.textDocument.uri);
	if (!document) {return null;}

	const locations: Location[] = [];
	let index = -1;

	const definitions = symbols[document.uri];
	const lines = document.getText().split("\n");
	const token = utils.getTokenByPosition(lines[params.position.line], params.position.character);

	if (!definitions.has(token)) {return null;}

	for (const line of lines) {
		const tokens = [...line.match(/\w+/g) ?? []];
	
		index += 1;
		if (!tokens.includes(token)) { continue; }

		locations.push({
			uri: params.textDocument.uri,
			range: {
				start: {
					line: index,
					character: line.indexOf(token)
				},
				end: {
					line: index,
					character: line.indexOf(token) + token.length
				}
			}
		});
	}

	return locations;
});

connection.onFoldingRanges((params) => {
	const document = documents.get(params.textDocument.uri);
	const lines = document?.getText().split("\n") ?? [];
	const ranges: FoldingRange[] = [];
	const stack: number[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		
		if (line.includes('{')) {
			stack.push(i);
		}

		if (line.includes('}')) {
			const start = stack.pop();
			if (start !== undefined && i > start) {
				ranges.push({
					startLine: start,
					endLine: i,
					kind: FoldingRangeKind.Region
				});
			}
		}
	}

	return null;
});

connection.onSignatureHelp(params => {
	const uri = params.textDocument.uri;
	const document = documents.get(uri);
	const lines = document?.getText().split("\n") ?? [];
	const line = lines[params.position.line];

	const definitions = symbols[uri];
	const prefix = line.substring(0, params.position.character);
	const match = prefix.match(/(\w+)\s*\(.*$/);
	const functionName = match ? match[1] : null;
	if (!functionName) {return;}

	const definition = definitions.get(functionName);
	const signature = definition?.signature;
	if (!signature) {return;}

	const commaIndexes: number[] = [];
	for (let i = 0; i < prefix.length; i++) {
		if (prefix[i] === ',') {
			commaIndexes.push(i);
		}
	}
	
	const activeParameter = commaIndexes.findIndex((value, index, array) => 
		params.position.character > value && 
		(index === array.length - 1 || params.position.character <= array[index + 1])
	) + 1;

	const result: SignatureHelp = {
		signatures: [
			signature
		],
		activeParameter
	};

	return result;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
