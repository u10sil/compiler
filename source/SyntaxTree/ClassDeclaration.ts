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
import { TypeDeclaration } from "./TypeDeclaration"
import * as Type from "./Type"
import { Block } from "./Block"
import { addDeserializer, deserialize } from "./deserialize"

export class ClassDeclaration extends TypeDeclaration {
	get class() { return "classDeclaration" }
	get parameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.parametersArray)
	}
	get implemented(): Utilities.Iterator<Type.Identifier> {
		return new Utilities.ArrayIterator(this.implementedArray)
	}
	constructor(symbol: string, readonly isAbstract: boolean, private parametersArray: Type.Name[], readonly extended: Type.Identifier | undefined, private implementedArray: Type.Identifier[], readonly content: Block, tokens?: Utilities.Iterable<Tokens.Substance>) {
		super(symbol, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			isAbstract: this.isAbstract || undefined,
			parameters: this.parametersArray.length > 0 ? this.parametersArray.map(t => t.serialize()) : undefined,
			extends: this.extended && this.extended.serialize(),
			implements: this.implementedArray.length > 0 ? this.implementedArray.map(i => i.serialize()) : undefined,
			content: this.content.serialize(),
		}
	}
}
addDeserializer("classDeclaration", data =>
	data.hasOwnProperty("name") && data.hasOwnProperty("content") ?
	new ClassDeclaration(data.name, data.isAbstract, deserialize<Type.Name>(data.parameters as ({ class: string } & any)[]), deserialize<Type.Identifier>(data.extends), deserialize<Type.Identifier>(data.implements as ({ class: string } & any)[]), deserialize<Block>(data.content)!) :
	undefined)
