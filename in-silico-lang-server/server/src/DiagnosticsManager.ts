import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';

export default class Diagnostics {
	diagnostics: Diagnostic[] = [];

	constructor() {
		this.diagnostics = [];
	}

	get() {
		return this.diagnostics;
	}
	
	add(level: DiagnosticSeverity, code: number, line: number, start: number, end: number, message: string) {
		this.diagnostics.push({
			severity: DiagnosticSeverity.Error,
			message,
			code: code,
			codeDescription: {
				href: "www.google.com"
			},
			range: {
				start: { line, character: start },
				end: { line, character: end }
			}
		});
	}

	error(code: number, message: string, selection: { line: number; start: number; end: number }) {
		this.add(DiagnosticSeverity.Error, code, selection.line, selection.start, selection.end, message);
	}
}