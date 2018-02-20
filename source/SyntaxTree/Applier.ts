// Copyright (C) 2018 Simon Mika <simon@mika.se>
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
import {
	ArgumentDeclaration,
	Block,
	ClassDeclaration,
	Declaration,
	Expression,
	FunctionCall,
	FunctionDeclaration,
	Identifier,
	InfixOperator,
	Literal,
	Module,
	Node,
	Operator,
	PostfixOperator,
	PrefixOperator,
	Statement,
	SymbolDeclaration,
	Tuple,
	Type,
	TypeDeclaration,
	UnaryOperator,
	VariableDeclaration,
} from "./"
import { isArray } from "util"

export abstract class Applier {
	protected apply(node: Node | Node[] | Utilities.Iterator<Node> | undefined) {
		if (isArray(node))
			node.forEach(n => this.apply(n))
		else if (node instanceof Utilities.Iterator)
			node.apply(n => this.apply(n))
		else if (node instanceof Literal.Character)
			this.applyCharacterLiteral(node)
		else if (node instanceof Literal.Number)
			this.applyNumberLiteral(node)
		else if (node instanceof Literal.String)
			this.applyStringLiteral(node)
		else if (node instanceof Type.Function)
			this.applyTypeFunction(node)
		else if (node instanceof Type.Identifier)
			this.applyTypeIdentifier(node)
		else if (node instanceof Type.Name)
			this.applyTypeName(node)
		else if (node instanceof Type.Tuple)
			this.applyTypeTuple(node)
		else if (node instanceof ArgumentDeclaration)
			this.applyArgumentDeclaration(node)
		else if (node instanceof Block)
			this.applyBlock(node)
		else if (node instanceof ClassDeclaration)
			this.applyClassDeclaration(node)
		else if (node instanceof FunctionCall)
			this.applyFunctionCall(node)
		else if (node instanceof FunctionDeclaration)
			this.applyFunctionDeclaration(node)
		else if (node instanceof Identifier)
			this.applyIdentifier(node)
		else if (node instanceof InfixOperator)
			this.applyInfixOperator(node)
		else if (node instanceof Module)
			this.applyModule(node)
		else if (node instanceof PostfixOperator)
			this.applyPostfixOperator(node)
		else if (node instanceof PrefixOperator)
			this.applyPrefixOperator(node)
		else if (node instanceof SymbolDeclaration)
			this.applySymbolDeclaration(node)
		else if (node instanceof Tuple)
			this.applyTuple(node)
		else if (node instanceof VariableDeclaration)
			this.applyVariableDeclaration(node)
	}

	protected applyLiteral(node: Literal.Expression) { }
	protected applyCharacterLiteral(node: Literal.Character) { this.applyLiteral(node) }
	protected applyNumberLiteral(node: Literal.Number) { this.applyLiteral(node) }
	protected applyStringLiteral(node: Literal.String) { this.applyLiteral(node) }

	protected applyType(node: Type.Expression) { }
	protected applyTypeFunction(node: Type.Function) { this.apply(node.arguments); this.apply(node.result); this.applyType(node) }
	protected applyTypeIdentifier(node: Type.Identifier) { this.apply(node.parameters); this.applyType(node) }
	protected applyTypeName(node: Type.Name) { this.applyType(node) }
	protected applyTypeTuple(node: Type.Tuple) { this.apply(node.elements); this.applyType(node) }

	protected applyArgumentDeclaration(node: ArgumentDeclaration) { this.applyDeclaration(node) }
	protected applyBlock(node: Block) { this.apply(node.statements); this.applyExpression(node) }
	protected applyClassDeclaration(node: ClassDeclaration) { this.apply(node.parameters); this.apply(node.extended); this.apply(node.implemented); this.apply(node.content); this.applyTypeDeclaration(node) }
	protected applyDeclaration(node: Declaration) { this.applyStatement(node) }
	protected applyExpression(node: Expression) { this.apply(node.type); this.applyStatement(node)}
	protected applyFunctionCall(node: FunctionCall) { this.apply(node.functionExpression); this.apply(node.argumentList), this.applyExpression(node) }
	protected applyFunctionDeclaration(node: FunctionDeclaration) { this.apply(node.parameters); this.apply(node.argumentList); this.apply(node.returnType); this.applySymbolDeclaration(node) }
	protected applyIdentifier(node: Identifier) { this.applyExpression(node) }
	protected applyInfixOperator(node: InfixOperator) { this.apply(node.left); this.apply(node.right); this.applyOperator(node) }
	protected applyModule(node: Module) { this.apply(node.statements); this.applyNode(node) }
	protected applyNode(node: Node) { }
	protected applyOperator(node: Operator) { this.applyExpression(node) }
	protected applyPostfixOperator(node: PostfixOperator) { this.applyUnaryOperator(node) }
	protected applyPrefixOperator(node: PrefixOperator) { this.applyUnaryOperator(node) }
	protected applyStatement(node: Statement) { this.applyNode(node) }
	protected applySymbolDeclaration(node: SymbolDeclaration) { this.applyDeclaration(node) }
	protected applyTuple(node: Tuple) { this.apply(node.elements); this.applyExpression(node) }
	protected applyTypeDeclaration(node: TypeDeclaration) { this.applyDeclaration(node) }
	protected applyUnaryOperator(node: UnaryOperator) { this.applyOperator(node); this.apply(node.argument)}
	protected applyVariableDeclaration(node: VariableDeclaration) { this.applySymbolDeclaration(node); this.apply(node.type); this.apply(node.value) }
}
