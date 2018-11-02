// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { TypeDeclaration } from "./TypeDeclaration"
import * as Type from "./Type"
import { Statement } from "./Statement"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"
import { ThisDeclaration } from "./ThisDeclaration"

export class ClassDeclaration extends TypeDeclaration {
	get class() { return "classDeclaration" }
	readonly this: ThisDeclaration
	readonly implements: Utilities.Enumerable<Type.Identifier>
	constructor(
		symbol: Type.Name,
		readonly isAbstract: boolean,
		readonly parameters: Utilities.Enumerable<Type.Name>,
		readonly extended: Type.Identifier | undefined,
		implemented: Utilities.Enumerable<Type.Identifier>,
		readonly content: Utilities.Enumerable<Statement>,
		tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, tokens)
		this.implements = implemented
		this.this = new ThisDeclaration(this, tokens instanceof ClassDeclaration ? tokens.this : tokens)
	}
	serialize(): { class: string } & any {
		const parameters = this.parameters.map(t => t.serialize()).toArray()
		const implemented = this.implements.map(i => i.serialize()).toArray()
		return {
			...super.serialize(),
			isAbstract: this.isAbstract || undefined,
			parameters: parameters.length > 0 ? parameters : undefined,
			extends: this.extended && this.extended.serialize(),
			implements: implemented.length > 0 ? implemented : undefined,
			content: this.content.map(c => c.serialize()).toArray(),
		}
	}
}
addDeserializer("classDeclaration", data =>
	data.hasOwnProperty("name") && data.hasOwnProperty("content") ?
	new ClassDeclaration(data.name, data.isAbstract, deserialize<Type.Name>(data.parameters as ({ class: string } & any)[]), deserialize<Type.Identifier>(data.extends), deserialize<Type.Identifier>(data.implements as ({ class: string } & any)[]), deserialize<Statement>(data.content as ({ class: string } & any)[])!) :
	undefined)
