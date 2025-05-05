import Diagnostics from './DiagnosticsManager';

interface FunctionDescriptor {
	name: string;
}

export default class FunctionManager {
	signatures: Record<string, FunctionDescriptor> = {};

	constructor() {
		this.signatures = {};
	}

	parse(line: string, index: number) {
		const diagnostics = new Diagnostics();

		const signature = this.getFunctionName(line);
		const call = this.getFunctionCall(line);

		if (signature) {
			this.add(signature);
		} else if (call && !(call in this.signatures)) {
			diagnostics.error(
				index,
				line.indexOf(call),
				line.indexOf(call) + call.length,
				`Function "${call}" is not defined.`
			);
		}

		return diagnostics.get();
	}

	getFunctionDeclaration(line: string) {
		const declaration = line.match(/(drop)\s+(bombs)\s+(we)/g)?.at(0);
		if (!declaration) { return null; }
	}

	getFunctionName(line: string) {
		return line.match(/(?<=drop bombs we\s+)[^\s]+(?=\([^)]*\))/g)?.at(0) ?? null;
	}

	getFunctionCall(line: string) {
		return line.match(/[^\s]+(?=\([^)]*\))/g)?.at(0) ?? null;
	}

	add(name: string) {
		this.signatures[name] = {
			name
		};
	}
}