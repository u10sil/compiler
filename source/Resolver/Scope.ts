// Copyright (C) 2017  Simon Mika <simon@mika.se>
//
// This file is part of SysPL.
//
// SysPL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SysPL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SysPL.  If not, see <http://www.gnu.org/licenses/>.
//

import { Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import { SymbolTable } from "./SymbolTable"

export class Scope {
	private constructor(private symbols: SymbolTable<SyntaxTree.SymbolDeclaration>, private types: SymbolTable<SyntaxTree.TypeDeclaration>, private parent?: Scope) {
	}
	private findHelper(name: string): SyntaxTree.Declaration[] {
		let result: SyntaxTree.Declaration[] = [...this.symbols.get(name), ...this.types.get(name)]
		if (this.parent)
			result = result.concat(this.parent.findHelper(name))
		return result
	}
	find(name: string): SyntaxTree.Declaration | undefined {
		const result = this.findHelper(name)
		return result.length > 1 ? new SyntaxTree.Declarations(result) :
			result.length > 0 ? result[0] :
			undefined
	}
	findType(name: string): SyntaxTree.TypeDeclaration[] {
		let result: SyntaxTree.TypeDeclaration[] = [...this.types.get(name)]
		if (this.parent)
			result = result.concat(this.parent.findType(name))
		return result
	}
	resolve(statement: undefined): undefined
	resolve<T extends SyntaxTree.Node>(node: T): T
	resolve<T extends SyntaxTree.Node>(node: T | undefined): T | undefined
	resolve<T extends SyntaxTree.Node>(node: T[] | Utilities.Iterator<T>): T[]
	resolve(node: SyntaxTree.Node | undefined | SyntaxTree.Node[] | Utilities.Iterator<SyntaxTree.Node>): SyntaxTree.Node | undefined | SyntaxTree.Node[] {
		return !node ? undefined :
			node instanceof SyntaxTree.Node ? this.resolveNode(node) :
			this.resolveNodes(node instanceof Array ? new Utilities.ArrayIterator(node) : node)
	}
	private resolveNode(node: SyntaxTree.Node): SyntaxTree.Node {
		return resolvers[node.class](node, this)
	}
	private resolveNodes(nodes: Utilities.Iterator<SyntaxTree.Node>): SyntaxTree.Node[] {
		nodes = nodes.map(node => this.resolveNode(node))
		return nodes.toArray()
	}
	add(declaration: SyntaxTree.SymbolDeclaration | SyntaxTree.TypeDeclaration) {
		if (declaration instanceof SyntaxTree.SymbolDeclaration)
			this.symbols.append(declaration)
		else if (declaration instanceof SyntaxTree.TypeDeclaration)
			this.types.append(declaration)
	}
	create(statements?: Utilities.Iterator<SyntaxTree.Statement>): Scope {
		return Scope.create(statements, this)
	}
	static create(statements?: Utilities.Iterator<SyntaxTree.Statement>, parent?: Scope): Scope {
		const symbols = new SymbolTable<SyntaxTree.SymbolDeclaration>()
		const types = new SymbolTable<SyntaxTree.TypeDeclaration>()
		if (statements)
			statements.apply(statement => {
				if (statement instanceof SyntaxTree.FunctionDeclaration) // No variable declarations here as they should only be used after they are declared.
					symbols.append(statement)
				else if (statement instanceof SyntaxTree.TypeDeclaration)
					types.append(statement)
			})
		return new Scope(symbols, types, parent)
	}
	static get empty(): Scope {
		return new Scope(new SymbolTable<SyntaxTree.SymbolDeclaration>(), new SymbolTable<SyntaxTree.TypeDeclaration>())
	}
}
const resolvers: { [className: string]: (statement: SyntaxTree.Statement, scope: Scope) => SyntaxTree.Statement } = {}
export function addResolver(className: string, resolve: (statement: SyntaxTree.Statement, scope: Scope) => SyntaxTree.Statement ) {
	resolvers[className] = resolve
}
