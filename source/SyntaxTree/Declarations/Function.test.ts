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
		var handler = new Error.ConsoleHandler()
		//
		// TODO: Construct a test for an argument list with no explicitly set types (type inference)
		//
		this.add("empty function", () => {
			var functionDeclaration = this.createDeclaration("Empty: func\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
		})
		this.add("static function", () => {
			var functionDeclaration = this.createDeclaration("Empty: static func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Static))
		})
		this.add("abstract function", () => {
			var functionDeclaration = this.createDeclaration("Empty: abstract func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Abstract))
		})
		this.add("virtual function", () => {
			var functionDeclaration = this.createDeclaration("Empty: virtual func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Virtual))
		})
		this.add("override function", () => {
			var functionDeclaration = this.createDeclaration("Empty: override func\n", handler)
			this.expect(functionDeclaration.modifier, Is.equal.to(SyntaxTree.Declarations.FunctionModifier.Override))
		})
		this.add("empty function with parameters", () => {
			var functionDeclaration = this.createDeclaration("Empty: func (i: Int, j: Float, k: Double)\n", handler)
			var functionArguments = functionDeclaration.argumentList
			var currentArgument: SyntaxTree.Declarations.Argument
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("i"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("j"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("k"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Double"))
		})
		this.add("empty function with parameters reduced", () => {
			var functionDeclaration = this.createDeclaration("Empty: func (w, h: Int, x, y, z: Float)\n", handler)
			var functionArguments = functionDeclaration.argumentList
			var currentArgument: SyntaxTree.Declarations.Argument
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("w"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("h"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Int"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("x"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("y"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Float"))
			currentArgument = functionArguments.next()
			this.expect(currentArgument.symbol, Is.equal.to("z"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).name, Is.equal.to("Float"))
		})
		this.add("empty generic function with generic parameter types", () => {
			var functionDeclaration = this.createDeclaration("Empty: func <T, S> (a, b: Generic<T>, x, y: Generic<S>)\n", handler)
			var typeParameters = functionDeclaration.typeParameters
			var functionArguments = functionDeclaration.argumentList
			var currentArgument = functionArguments.next()
			this.expect(typeParameters.next().name, Is.equal.to("T"))
			this.expect(typeParameters.next().name, Is.equal.to("S"))
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).typeParameters.next().name, Is.equal.to("T"))
			functionArguments.next() // consume "b: Generic<T>"
			currentArgument = functionArguments.next()
			this.expect((<SyntaxTree.Type.Identifier>currentArgument.type).typeParameters.next().name, Is.equal.to("S"))
		})
		this.add("empty function with return type", () => {
			var functionDeclaration = this.createDeclaration("Empty: func -> ReturnType\n", handler)
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			this.expect((<SyntaxTree.Type.Identifier>functionDeclaration.returnType).name, Is.equal.to("ReturnType"))
		})
		this.add("empty function with return type tuple", () => {
			var functionDeclaration = this.createDeclaration("Empty: func -> (Int, Float, Double)\n", handler)
			var tupleChildren = (<SyntaxTree.Type.Tuple>functionDeclaration.returnType).children
			this.expect(functionDeclaration.symbol, Is.equal.to("Empty"))
			this.expect((<SyntaxTree.Type.Identifier>tupleChildren.next()).name, Is.equal.to("Int"))
			this.expect((<SyntaxTree.Type.Identifier>tupleChildren.next()).name, Is.equal.to("Float"))
			this.expect((<SyntaxTree.Type.Identifier>tupleChildren.next()).name, Is.equal.to("Double"))
		})
		this.add("argument type copy", () => {
			var functionDeclaration = this.createDeclaration("Empty: func (.arg)\n", handler)
			var argument = <SyntaxTree.Declarations.Argument>functionDeclaration.argumentList.next()
			this.expect(argument.symbol, Is.equal.to("arg"))
			this.expect(argument.type, Is.nullOrUndefined)
		})
		this.add("argument assign", () => {
			var functionDeclaration = this.createDeclaration("Empty: func (=arg)\n", handler)
			var argument = <SyntaxTree.Declarations.Argument>functionDeclaration.argumentList.next()
			this.expect(argument.symbol, Is.equal.to("arg"))
			this.expect(argument.type, Is.nullOrUndefined)
		})
		this.add("argument declare-assign", () => {
			var functionDeclaration = this.createDeclaration("Empty: func (arg := 10)\n", handler)
			var argument = <SyntaxTree.Declarations.Argument>functionDeclaration.argumentList.next()
			this.expect(argument.symbol, Is.equal.to("arg"))
			//
			// TODO: Fix this test
			//
			this.expect(argument.type, Is.not.nullOrUndefined)
		})
	}
	createDeclaration(sourceString: string, errorHandler: Error.Handler): SyntaxTree.Declarations.Function {
		var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader(sourceString), errorHandler)), errorHandler)
		var statements = parser.next().statements
		return <SyntaxTree.Declarations.Function> statements.next()
	}
}
Unit.Fixture.add(new FunctionTest())
