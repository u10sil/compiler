// Copyright (C) 2017, 2018  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error, Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import { SymbolTable } from "./SymbolTable"
import { Declarations } from "./Declarations"
import { Types } from "./Types"

export class Scope {
	get declarations() { return new Declarations(this.declarationsData) }
	private readonly symbolTable = new SymbolTable<SyntaxTree.SymbolDeclaration>((previous, current) => {
		this.handler.raise("Declaration of symbol \"" + previous.symbol + "\" at " + previous.region + " hidden by new declaration at " + current.region, Error.Level.Recoverable, "semantic", current.region)
		return current
	})
	get types() { return new Types(this.typesData) }
	private readonly typeTable = new SymbolTable<SyntaxTree.TypeDeclaration>((previous, current) => {
		this.handler.raise("Declaration of type \"" + previous.symbol + "\" at " + previous.region + " hidden by new declaration at " + current.region, Error.Level.Recoverable, "semantic", current.region)
		return current
	})
	private constructor(private handler: Error.Handler, private readonly declarationsData: { [id: number]: number }, private readonly typesData: { [id: number]: SyntaxTree.Type.Expression }, private readonly membersData: { [id: number]: { [member: string]: number } }, private parent?: Scope) {
	}
	raise(message: string, level?: Error.Level, type?: string, region?: Error.Region) {
		this.handler.raise(message, level, type, region)
	}
	addSymbol(declaration: SyntaxTree.SymbolDeclaration) {
		this.symbolTable.append(declaration)
	}
	addType(declaration: SyntaxTree.TypeDeclaration) {
		this.typeTable.append(declaration)
	}
	addDeclaration(node: SyntaxTree.Node, declaration: number) {
		this.declarationsData[node.id] = declaration
	}
	addMember(member: SyntaxTree.SymbolDeclaration, parent: SyntaxTree.TypeDeclaration | undefined) {
		if (!parent)
			this.raise("Can not resolve method without a parent type declaration.")
		else {
			const p = this.membersData[parent.id] || {}
			p[member.symbol] = member.id
			this.membersData[parent.id] = p
		}
	}
	findSymbol(identifier: SyntaxTree.Identifier): number | undefined {
		const result = this.symbolTable.get(identifier.name)
		return result ? result.id : this.parent ? this.parent.findSymbol(identifier) : undefined
	}
	findType(identifier: SyntaxTree.Type.Name): number | undefined {
		const result = this.typeTable.get(identifier.name)
		return result ? result.id : this.parent ? this.parent.findType(identifier) : undefined
	}
	setType(node: SyntaxTree.Node | number, type: SyntaxTree.Type.Expression) {
		this.typesData[node instanceof SyntaxTree.Node ? node.id : node] = type
	}
	getType(node: SyntaxTree.Node | number): SyntaxTree.Type.Expression {
		return this.typesData[node instanceof SyntaxTree.Node ? node.id : node]
	}
	findMember(member: SyntaxTree.Identifier, parent: SyntaxTree.Type.Expression | number): number | undefined {
		let result: number | undefined
		if (parent instanceof SyntaxTree.Type.Expression) {
			const finder = memberFinders[parent.class]
			if (finder)
				result = finder(this, parent, member)
			else
				this.raise("Unable to find member resolver for declaration of class \"" + parent.class + "\"")
		} else {
			const p = this.membersData[parent]
			if (p) {
				result = p[member.name]
				if (!result)
					this.raise("Could not find member with the name \"" + member.name + "\" on type declared in node " + parent)
			} else
				this.raise("No members available for node " + parent)
		}
		return result
	}
	resolve(statement: undefined): void
	resolve<T extends SyntaxTree.Node>(node: T | undefined | Utilities.Enumerable<T>, parent?: SyntaxTree.TypeDeclaration): void
	resolve(node: SyntaxTree.Node | undefined | Utilities.Enumerable<SyntaxTree.Node>, parent?: SyntaxTree.TypeDeclaration): void {
		if (node instanceof Utilities.Enumerable)
			node.apply(n => this.resolve(n, parent))
		else if (node instanceof Utilities.Enumerator)
			node.apply(n => this.resolve(n, parent))
		else if (node instanceof SyntaxTree.Node) {
			const resolver = resolvers[node.class]
			if (resolver)
				resolver(this, node, parent)
			else
				this.raise("Missing resolver for class \"" + node.class + "\".", Error.Level.Recoverable, "semantic", node.region)
		}
	}
	create(statements?: SyntaxTree.ClassDeclaration | Utilities.Enumerable<SyntaxTree.Statement>): Scope {
		const result = new Scope(this.handler, this.declarationsData, this.typesData, this.membersData, this)
		if (statements instanceof SyntaxTree.ClassDeclaration) {
			result.symbolTable.append(statements, "this")
			result.typeTable.append(statements, "This")
		} else if (statements)
			statements.apply(statement => {
				if (statement instanceof SyntaxTree.FunctionDeclaration || statement instanceof SyntaxTree.ArgumentDeclaration)
					result.symbolTable.append(statement)
				else if (statement instanceof SyntaxTree.TypeDeclaration)
					result.typeTable.append(statement)
			})
		return result
	}
	static create(handler: Error.Handler): Scope {
		return new Scope(handler, {}, {}, {})
	}
}
const resolvers: { [className: string]: ((scope: Scope, node: SyntaxTree.Node, parent: SyntaxTree.TypeDeclaration | undefined) => void) } = {}
export function addResolver<T extends SyntaxTree.Node>(className: string, resolver: (scope: Scope, node: T, parent?: SyntaxTree.TypeDeclaration) => void): void {
	resolvers[className] = (scope: Scope, node: SyntaxTree.Node, parent) => resolver(scope, node as T, parent)
}
const memberFinders: { [className: string]: ((scope: Scope, parent: SyntaxTree.Type.Expression, name: SyntaxTree.Identifier) => number | undefined) } = {}
export function addMemberFinder<T extends SyntaxTree.Type.Expression>(className: string, finder: (scope: Scope, parent: T, name: SyntaxTree.Identifier) => number | undefined): void {
	memberFinders[className] = (scope: Scope, parent: SyntaxTree.Type.Expression, name: SyntaxTree.Identifier) => finder(scope, parent as T, name)
}
