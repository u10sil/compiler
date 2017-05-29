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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Source } from "./Source"
import { Statement } from "./Statement"
import { TypeDeclaration } from "./TypeDeclaration"
import * as Type from "./Type"
import { Block } from "./Block"

export class ClassDeclaration extends TypeDeclaration {
	get typeParameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.typeParametersArray)
	}
	get implemented(): Utilities.Iterator<Type.Identifier> {
		return new Utilities.ArrayIterator(this.implementedArray)
	}
	constructor(symbol: Type.Name, readonly isAbstract: boolean, private typeParametersArray: Type.Name[], readonly extended: Type.Identifier | undefined, private implementedArray: Type.Identifier[], readonly content: Block, tokens: Tokens.Substance[]) {
		super(symbol.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "classDeclaration",
			isAbstract: this.isAbstract || undefined,
			typeParameters: this.typeParametersArray.length > 0 ? this.typeParametersArray.map(t => t.serialize()) : undefined,
			extends: this.extended && this.extended.serialize(),
			implements: this.implementedArray.length > 0 ? this.implementedArray.map(i => i.serialize()) : undefined,
			content: this.content.serialize(),
		}
	}
	static parse(source: Source): Statement | undefined {
		let result: Statement | undefined
		const isAbstract = source.peek()!.isIdentifier("abstract")
		if (source.peek(isAbstract ? 1 : 0)!.isIdentifier("class") && source.next() && (!isAbstract || source.next())) {
			const symbol = Type.Name.parse(source.clone())
			if (!symbol)
				source.raise("Expected symbol in class declaration.")
			const typeParameters = TypeDeclaration.parseTypeParameters(source.clone())
			let extended: Type.Identifier | undefined
			if (source.peek()!.isIdentifier("extends")) {
				source.next() // consume "extends"
				if (!source.peek()!.isIdentifier())
					source.raise("Expected identifier with name of class to extend.")
				extended = Type.Identifier.parse(source.clone())
			}
			const implemented: Type.Identifier[] = []
			if (source.peek()!.isIdentifier("implements"))
				do {
					source.next() // consume "implements" or ","
					if (!source.peek()!.isIdentifier())
						source.raise("Expected identifier with name of interface to extend.")
					implemented.push(Type.Identifier.parse(source.clone())!)
				} while (source.peek()!.isSeparator(","))
			const block = Block.parse(source.clone())
			if (!block)
				source.raise("Expected block in class declaration.")
			result = new ClassDeclaration(symbol!, isAbstract, typeParameters, extended, implemented, block!, source.mark())
		}
		return result
	}
}
Statement.addParser(ClassDeclaration.parse)