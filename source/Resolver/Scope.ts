// Copyright (C) 2017, 2018  Simon Mika <simon@mika.se>
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

import { Error, Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import { SymbolTable } from "./SymbolTable"
import { Declarations } from "./Declarations"
import { Types } from "./Types"

export class Scope {
	get declarations() { return new Declarations(this.declarationsData) }
	get types() { return new Types(this.typesData) }
	private symbolTable = new SymbolTable<SyntaxTree.SymbolDeclaration>((previous, current) => {
		this.handler.raise("Declaration of symbol \"" + previous.symbol + "\" at " + previous.region + " hidden by new declaration at " + current.region, Error.Level.Recoverable, "semantic", current.region)
		return current
	})
	private typeTable = new SymbolTable<SyntaxTree.TypeDeclaration>((previous, current) => {
		this.handler.raise("Declaration of type \"" + previous.symbol + "\" at " + previous.region + " hidden by new declaration at " + current.region, Error.Level.Recoverable, "semantic", current.region)
		return current
	})
	private constructor(private handler: Error.Handler, private readonly declarationsData: { [id: number]: number }, private readonly typesData: { [id: number]: SyntaxTree.Type.Expression }, private parent?: Scope) {
	}
	private findSymbol(identifier: SyntaxTree.Identifier): number | undefined {
		const result = this.symbolTable.get(identifier.name)
		return result ? result.id : this.parent ? this.parent.findSymbol(identifier) : undefined
	}
	private findType(identifier: SyntaxTree.Type.Identifier): number | undefined {
		const result = this.typeTable.get(identifier.name)
		return result ? result.id : this.parent ? this.parent.findType(identifier) : undefined
	}
	resolve(statement: undefined): void
	resolve<T extends SyntaxTree.Node>(node: T | undefined | T[] | Utilities.Iterator<T>): void
	resolve(node: SyntaxTree.Node | undefined | SyntaxTree.Node[] | Utilities.Iterator<SyntaxTree.Node>): void {
		if (node instanceof Array)
			node.forEach(n => this.resolve(n))
		else if (node instanceof Utilities.Iterator)
			node.apply(n => this.resolve(n))
		else if (node instanceof SyntaxTree.Type.Function) {
			this.resolve(node.arguments)
			this.resolve(node.result)
		} else if (node instanceof SyntaxTree.Type.Primitive) {
		} else if (node instanceof SyntaxTree.Type.Identifier) {
			const result = this.findType(node)
			if (result != undefined)
				this.declarationsData[node.id] = result
			else
				this.handler.raise("Unable to resolve type \"" + node.name + "\" at " + node.region + ".")
		} else if (node instanceof SyntaxTree.Type.Name) {
			// TODO: what should we do here?
		} else if (node instanceof SyntaxTree.Type.Tuple) {
			this.resolve(node.elements)
		} else if (node instanceof SyntaxTree.ArgumentDeclaration) {
			this.resolve(node.type)
			if (node.type)
				this.typesData[node.id] = node.type
		} else if (node instanceof SyntaxTree.Literal.Number) {
			this.typesData[node.id] = SyntaxTree.Type.Primitive.getType(node.value)
		} else if (node instanceof SyntaxTree.Block) {
			const scope = this.create(node.statements)
			scope.resolve(node.statements)
			this.resolve(node.type)
			const last = node.statements.last
			if (last)
				this.typesData[node.id] = this.typesData[last.id]
		} else if (node instanceof SyntaxTree.ClassDeclaration) {
			// TODO: handle classes and structs
		} else if (node instanceof SyntaxTree.FunctionCall) {
			this.resolve(node.functionExpression)
			this.resolve(node.argumentList)
			this.resolve(node.type)
			const functionType = this.typesData[node.functionExpression.id]
			if (functionType instanceof SyntaxTree.Type.Function)
				this.typesData[node.id] = functionType.result
			else
				this.handler.raise("Unable to call an expression " + node.functionExpression.region + "  that is not of a function type.", Error.Level.Recoverable, "type", node.region)
		} else if (node instanceof SyntaxTree.FunctionDeclaration) {
			this.resolve(node.argumentList)
			this.resolve(node.returnType)
			const scope = this.create(node.argumentList)
			scope.resolve(node.body)
			if (node.body)
				this.typesData[node.id] = new SyntaxTree.Type.Function(node.argumentList.map(n => this.typesData[n.id]).toArray(), this.typesData[node.body.id])
		} else if (node instanceof SyntaxTree.Identifier) {
			const result = this.findSymbol(node)
			if (result != undefined) {
				this.declarationsData[node.id] = result
				const declaration = SyntaxTree.Node.locate(result)
				if (declaration)
					this.typesData[node.id] = this.typesData[declaration.id]
			} else
				this.handler.raise("Unable to resolve symbol \"" + node.name + "\" at " + node.region + ".")
		} else if (node instanceof SyntaxTree.InfixOperator) {
			// TODO: resolve operators
			this.resolve(node.left)
			this.resolve(node.right)
			this.resolve(node.type)
		} else if (node instanceof SyntaxTree.Module) {
			const scope = this.create(node.statements)
			scope.resolve(node.statements)
		} else if (node instanceof SyntaxTree.UnaryOperator) {
			// TODO: resolve operators
			this.resolve(node.argument)
			this.resolve(node.type)
		} else if (node instanceof SyntaxTree.Tuple) {
			this.resolve(node.elements)
			this.resolve(node.type)
			this.typesData[node.id] = new SyntaxTree.Type.Tuple(node.elements.map(n => this.typesData[n.id]))
		} else if (node instanceof SyntaxTree.VariableDeclaration) {
			this.symbolTable.append(node)
			this.resolve(node.value)
			this.resolve(node.type)
			const valueType = (node.value ? this.typesData[node.value.id] : undefined)  || node.type
			if (valueType)
				this.typesData[node.id] = valueType
		}
	}
	private create(statements?: Utilities.Iterator<SyntaxTree.Statement>): Scope {
		const result = new Scope(this.handler, this.declarationsData, this.typesData, this)
		if (statements)
			statements.apply(statement => {
				if (statement instanceof SyntaxTree.FunctionDeclaration || statement instanceof SyntaxTree.ArgumentDeclaration)
					this.symbolTable.append(statement)
				else if (statement instanceof SyntaxTree.TypeDeclaration)
					this.typeTable.append(statement)
			})
		return result
	}
	static create(handler: Error.Handler): Scope {
		return new Scope(handler, {}, {})
	}
}
