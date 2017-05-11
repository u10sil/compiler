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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
import * as Type from "../Type"
import { Block } from "../Block"

export class Class extends Declaration {
	constructor(symbol: Type.Name, private isAbstractClass: boolean, private typeParameters: Type.Name[], private extended: Type.Identifier, private implemented: Type.Identifier[], private block: Block, tokens: Tokens.Substance[]) {
		super(symbol.getName(), tokens)
	}
	isAbstract(): boolean {
		return this.isAbstractClass
	}
	getTypeParameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.typeParameters)
	}
	getExtended(): Type.Identifier {
		return this.extended
	}
	getImplemented(): Utilities.Iterator<Type.Identifier> {
		return new Utilities.ArrayIterator(this.implemented)
	}
	getBlock(): Block {
		return this.block
	}
	static parse(source: Source): Class {
		var result: Class
		var isAbstract = false
		if (source.peek(0).isIdentifier() && source.peek(1).isSeparator(":") && (source.peek(2).isIdentifier("class") || source.peek(3).isIdentifier("class"))) {
			var symbol = Type.Name.parse(source.clone())
			source.next() // consume ":"
			if (source.peek().isIdentifier("abstract")) {
				isAbstract = true
				source.next() // consume "abstract"
			}
			source.next() // consume "class"
			var typeParameters = Declaration.parseTypeParameters(source.clone())
			var extended: Type.Identifier
			if (source.peek().isIdentifier("extends")) {
				source.next() // consume "extends"
				if (!source.peek().isIdentifier())
					source.raise("Expected identifier with name of class to extend.")
				extended = Type.Identifier.parse(source.clone())
			}
			var implemented: Type.Identifier[] = []
			if (source.peek().isIdentifier("implements"))
				do {
					source.next() // consume "implements" or ","
					if (!source.peek().isIdentifier())
						source.raise("Expected identifier with name of interface to extend.")
					implemented.push(Type.Identifier.parse(source.clone()))
				} while (source.peek().isSeparator(","))
			var block = Block.parse(source.clone())
			result = new Class(symbol, isAbstract, typeParameters, extended, implemented, block, source.mark())
		}
		return result
	}
}
Statement.addParser(Class.parse)
