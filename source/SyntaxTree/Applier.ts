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
	apply(node: Node | Node[] | Utilities.Iterator<Node>) {
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

	applyLiteral(node: Literal.Abstract) { }
	applyCharacterLiteral(node: Literal.Character) { this.applyLiteral(node) }
	applyNumberLiteral(node: Literal.Number) { this.applyLiteral(node) }
	applyStringLiteral(node: Literal.String) { this.applyLiteral(node) }

	applyType(node: Type.Expression) { }
	applyTypeFunction(node: Type.Function) { this.apply(node.arguments); this.apply(node.result); this.applyType(node) }
	applyTypeIdentifier(node: Type.Identifier) { this.apply(node.parameters); this.applyType(node) }
	applyTypeName(node: Type.Name) { this.applyType(node) }
	applyTypeTuple(node: Type.Tuple) { this.apply(node.elements); this.applyType(node) }

	applyArgumentDeclaration(node: ArgumentDeclaration) { this.applyDeclaration(node) }
	applyBlock(node: Block) { this.apply(node.statements); this.applyExpression(node) }
	applyClassDeclaration(node: ClassDeclaration) { this.apply(node.parameters); this.apply(node.extended); this.apply(node.implemented); this.apply(node.content); this.applyTypeDeclaration(node) }
	applyDeclaration(node: Declaration) { this.applyStatement(node) }
	applyExpression(node: Expression) { this.apply(node.type); this.applyStatement(node)}
	applyFunctionCall(node: FunctionCall) { this.apply(node.functionExpression); this.apply(node.argumentList), this.applyExpression(node) }
	applyFunctionDeclaration(node: FunctionDeclaration) { this.apply(node.parameters); this.apply(node.argumentList); this.apply(node.returnType); this.applySymbolDeclaration(node) }
	applyIdentifier(node: Identifier) { this.applyExpression(node) }
	applyInfixOperator(node: InfixOperator) { this.apply(node.left); this.apply(node.right); this.applyOperator(node) }
	applyModule(node: Module) { this.apply(node.statements); this.applyNode(node) }
	applyNode(node: Node) { }
	applyOperator(node: Operator) { this.applyExpression(node) }
	applyPostfixOperator(node: PostfixOperator) { this.applyUnaryOperator(node) }
	applyPrefixOperator(node: PrefixOperator) { this.applyUnaryOperator(node) }
	applyStatement(node: Statement) { this.applyNode(node) }
	applySymbolDeclaration(node: SymbolDeclaration) { this.applyDeclaration(node) }
	applyTuple(node: Tuple) { this.apply(node.elements); this.applyExpression(node) }
	applyTypeDeclaration(node: TypeDeclaration) { this.applyDeclaration(node) }
	applyUnaryOperator(node: UnaryOperator) { this.applyOperator(node); this.apply(node.argument)}
	applyVariableDeclaration(node: VariableDeclaration) { this.applySymbolDeclaration(node); this.apply(node.type); this.apply(node.value) }
}
