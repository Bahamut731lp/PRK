import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';

export default class Diagnostics {
	diagnostics: Diagnostic[] = [];

	constructor() {
		this.diagnostics = [];
	}

	get() {
		return this.diagnostics;
	}
	
	add(level: DiagnosticSeverity, line: number, start: number, end: number, message: string) {
		this.diagnostics.push({
			severity: DiagnosticSeverity.Error,
			message,
			range: {
				start: { line, character: start },
				end: { line, character: end }
			}
		});
	}

	error(line: number, start: number, end: number, message: string) {
		this.add(DiagnosticSeverity.Error, line, start, end, message);
	}
}