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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
import * as Type from "../Type"
import { Argument } from "./Argument"
import { Block } from "../Block"
import { FunctionModifier } from "./FunctionModifier"

export class Function extends Declaration {
	constructor(symbol: Type.Name, private modifier: FunctionModifier, private typeParameters: Type.Name[], private argumentList: Argument[], private returnType: Type.Expression, private body: Block, tokens: Tokens.Substance[]) {
		super(symbol.name, tokens)
	}
	getModifier(): FunctionModifier {
		return this.modifier
	}
	getTypeParameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.typeParameters)
	}
	getReturnType(): Type.Expression {
		return this.returnType
	}
	getBody(): Block {
		return this.body
	}
	getArguments(): Utilities.Iterator<Argument> {
		return new Utilities.ArrayIterator(this.argumentList)
	}
	static parse(source: Source): Function {
		var result: Function
		if (source.peek(0).isIdentifier() && source.peek(1).isSeparator(":") && (source.peek(2).isIdentifier("func") || source.peek(3).isIdentifier("func"))) {
			var symbol = Type.Name.parse(source.clone())
			var modifier = FunctionModifier.None
			source.next() // consume ":"
			if (!source.peek().isIdentifier("func")) {
				//
				// TODO: what about 'unmangled'? A function can be 'static unmangled'
				//
				switch ((<Tokens.Identifier>source.peek()).name) {
					case "static":
						modifier = FunctionModifier.Static
						break
					case "abstract":
						modifier = FunctionModifier.Abstract
						break
					case "virtual":
						modifier = FunctionModifier.Virtual
						break;
					case "override":
						modifier = FunctionModifier.Override
						break
					default:
						source.raise("Invalid modifier.", Error.Level.Critical)
				}
				source.next() // consume modifier
			}
			source.next() // consume "func"
			// TODO: add overload name parsing: ~overloadName
			var typeParameters = Declaration.parseTypeParameters(source)
			var argumentList = Argument.parseAll(source)
			var returnType: Type.Expression
			if (source.peek().isOperator("->")) {
				source.next() // consume "->"
				returnType = Type.Expression.parse(source)
			}
			var body = Block.parse(source)
			result = new Function(symbol, modifier, typeParameters, argumentList, returnType, body, source.mark())
		}
		return result
	}
}
Statement.addParser(Function.parse)
