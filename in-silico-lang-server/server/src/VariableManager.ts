import Diagnostics from './DiagnosticsManager';

interface FunctionDescriptor {
	name: string;
}

export default class FunctionManager {
	identifiers: Record<string, FunctionDescriptor> = {};

	constructor() {
		this.identifiers = {};
	}

	parse(line: string, index: number) {
		const diagnostics = new Diagnostics();

		const signature = this.getVariableDeclaration(line);

		if (signature) {
			this.add(signature);
		}

		return diagnostics.get();
	}

	getVariableDeclaration(line: string) {
		const declaration = line.match(/(set)\s[^\s].*\s(on)\s[^\s]+/g)?.at(0);
		if (!declaration) { return null; }
	}

	add(name: string) {
		this.identifiers[name] = {
			name
		};
	}
}