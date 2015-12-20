import * as vscode from 'vscode';

/**
 * Controls the behaviour of remembering the order of viewed files.
 */
class SmartFileReoppener {
	/** List of viewed documents */
	documents: Array<vscode.TextDocument>;
	/** When openning a file and closing it, we do not want that file oppened again... so jump first in this case... */
	jumpFirst: boolean;

	constructor() {
		this.documents = [];
		let textEditors = vscode.window.visibleTextEditors;
		for (let i = 0; i < textEditors.length; i++) {
			this.documents.push(textEditors[i].document);
		}
		vscode.window.onDidChangeActiveTextEditor(this.onTextEditorChange.bind(this));
		this.jumpFirst = true;
	}

	/**
	 * Receive the event of openning or closing files...
	 * Process according to the desired behaviour.
	 * @param textEditor null When closing an editor, otherwise has the TextEditor with the document that was oppened.
	 */
	onTextEditorChange(textEditor: vscode.TextEditor) {
		if (textEditor === null) {
			let document = this.documents.pop();
			if (this.jumpFirst) {
				document = this.documents.pop();
			}
			this.jumpFirst = false;
			vscode.window.showTextDocument(document);
		} else {
			let lastDocument = this.documents.length > 0 ? this.documents[this.documents.length - 1] : null;
			if (textEditor.document !== lastDocument) {
				this.documents.push(textEditor.document);
				this.jumpFirst = true;
			}
		}
	}
}

var smartFileReoppener: SmartFileReoppener;

export function activate(context: vscode.ExtensionContext) {
	smartFileReoppener = new SmartFileReoppener();
}

export function deactivate() {
	smartFileReoppener = undefined;
}