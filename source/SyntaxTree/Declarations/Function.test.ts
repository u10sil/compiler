// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Error, IO, Unit } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import * as SyntaxTree from "../"

import Is = Unit.Is
export class FunctionTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Declarations.Function")
		const handler = new Error.ConsoleHandler()
		//
		// TODO: Construct a test for an argument list with no explicitly set types (type inference)
		//
		this.add("empty function", () => {
			const functionDeclaration = this.createDeclaration("Empty: func\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
		})
		this.add("static function", () => {
			const functionDeclaration = this.createDeclaration("Empty: static func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Static))
		})
		this.add("abstract function", () => {
			const functionDeclaration = this.createDeclaration("Empty: abstract func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Abstract))
		})
		this.add("virtual function", () => {
			const functionDeclaration = this.createDeclaration("Empty: virtual func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Virtual))
		})
		this.add("override function", () => {
			const functionDeclaration = this.createDeclaration("Empty: override func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Override))
		})
		this.add("empty function with parameters", () => {
			const functionDeclaration = this.createDeclaration("Empty: func (i: Int, j: Float, k: Double)\n", handler)
			const functionArguments = functionDeclaration.argumentList
			let currentArgument: SyntaxTree.Declarations.Argument
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("i"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("j"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("k"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Double"))
		})
		this.add("empty function with parameters reduced", () => {
			const functionDeclaration = this.createDeclaration("Empty: func (w, h: Int, x, y, z: Float)\n", handler)
			const functionArguments = functionDeclaration.argumentList
			let currentArgument: SyntaxTree.Declarations.Argument
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("w"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("h"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("x"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("y"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("z"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
		})
		this.add("empty generic function with generic parameter types", () => {
			const functionDeclaration = this.createDeclaration("Empty: func <T, S> (a, b: Generic<T>, x, y: Generic<S>)\n", handler)
			const typeParameters = functionDeclaration.typeParameters
			const functionArguments = functionDeclaration.argumentList
			let currentArgument = functionArguments.next()
			this.expect(typeParameters.next().name, Is.equal.to("T"))
			this.expect(typeParameters.next().name, Is.equal.to("S"))
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).typeParameters.next().name, Is.equal.to("T"))
			functionArguments.next() // consume "b: Generic<T>"
			currentArgument = functionArguments.next()
			this.expect((currentArgument.type as SyntaxTree.Type.Identifier).typeParameters.next().name, Is.equal.to("S"))
		})
		this.add("empty function with return type", () => {
			const functionDeclaration = this.createDeclaration("Empty: func -> ReturnType\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			this.expect((functionDeclaration.returnType as SyntaxTree.Type.Identifier).name, Is.equal.to("ReturnType"))
		})
		this.add("empty function with return type tuple", () => {
			const functionDeclaration = this.createDeclaration("Empty: func -> (Int, Float, Double)\n", handler)
			const tupleChildren = (functionDeclaration.returnType as SyntaxTree.Type.Tuple).children
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Float"))
			this.expect((tupleChildren.next() as SyntaxTree.Type.Identifier).name, Is.equal.to("Double"))
		})
		this.add("argument type copy", () => {
			const functionDeclaration = this.createDeclaration("Empty: func (.arg)\n", handler)
			const argument = functionDeclaration.argumentList.next() as SyntaxTree.Declarations.Argument
			this.expect(argument.symbol, Is.equal.to("arg"))
			this.expect(argument.type, Is.nullOrUndefined)
		})
		this.add("argument assign", () => {
			const functionDeclaration = this.createDeclaration("Empty: func (=arg)\n", handler)
			const argument = functionDeclaration.argumentList.next() as SyntaxTree.Declarations.Argument
			this.expect(argument.symbol, Is.equal.to("arg"))
			this.expect(argument.type, Is.nullOrUndefined)
		})
	}
	createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.Declarations.Function {
		return SyntaxTree.Parser.parseFirst(sourceString, handler) as SyntaxTree.Declarations.Function
	}
}
Unit.Fixture.add(new FunctionTest())
