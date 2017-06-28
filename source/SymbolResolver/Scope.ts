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
	find(name: string): SyntaxTree.Declaration[] {
		let result: SyntaxTree.Declaration[] = [...this.symbols.get(name), ...this.types.get(name)]
		if (this.parent)
			result = result.concat(this.parent.find(name))
		return result
	}
	findType(name: string): SyntaxTree.TypeDeclaration[] {
		let result: SyntaxTree.TypeDeclaration[] = [...this.types.get(name)]
		if (this.parent)
			result = result.concat(this.parent.findType(name))
		return result
	}
	resolve(statement: SyntaxTree.Statement): SyntaxTree.Statement
	resolve(statements: Utilities.Iterator<SyntaxTree.Statement>): SyntaxTree.Statement[]
	resolve(statement: SyntaxTree.Statement | Utilities.Iterator<SyntaxTree.Statement>): SyntaxTree.Statement | SyntaxTree.Statement[] {
		return statement instanceof SyntaxTree.Statement ? this.resolveStatement(statement) : this.resolveStatements(statement).toArray()
	}
	private resolveStatement(statement: SyntaxTree.Statement): SyntaxTree.Statement {
		return resolvers[statement.class](statement, this)
	}
	private resolveStatements(statements: Utilities.Iterator<SyntaxTree.Statement>): Utilities.Iterator<SyntaxTree.Statement> {
		const scope = Scope.create(statements, this)
		return statements.map(statement => scope.resolveStatement(statement))
	}
	static create(statements: Utilities.Iterator<SyntaxTree.Statement>, parent?: Scope): Scope {
		const symbols = new SymbolTable<SyntaxTree.SymbolDeclaration>()
		const types = new SymbolTable<SyntaxTree.TypeDeclaration>()
		statements.apply(statement => {
			if (statement instanceof SyntaxTree.SymbolDeclaration)
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
