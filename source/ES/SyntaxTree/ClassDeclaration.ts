// Copyright (C) 2018  Simon Mika <simon@mika.se>
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
import * as Tokens from "../../Tokens"
import * as Type from "./Type"
import { TypeDeclaration } from "./TypeDeclaration"
import { Statement } from "./Statement"

export class ClassDeclaration extends TypeDeclaration {
	get class() { return "classDeclaration" }
	readonly extends: Type.Identifier | undefined
	readonly implements: Utilities.Enumerable<Type.Identifier>
	constructor(symbol: string, readonly isAbstract: boolean, readonly parameters: Utilities.Enumerable<Type.Name>, extended: Type.Identifier | undefined, implemented: Utilities.Enumerable<Type.Identifier>, readonly declarations: Utilities.Enumerable<Statement>, tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(symbol, tokens)
		this.extends = extended
		this.implements = implemented
	}
	serialize(): { class: string } & any {
		const parameters = this.parameters.map(t => t.serialize()).toArray()
		const implemented = this.implements.map(i => i.serialize()).toArray()
		return {
			...super.serialize(),
			isAbstract: this.isAbstract || undefined,
			parameters: parameters.length > 0 ? parameters : undefined,
			extends: this.extends && this.extends.serialize(),
			implements: implemented.length > 0 ? implemented : undefined,
			declarations: this.declarations.map(declaration => declaration.serialize()).toArray(),
		}
	}
}
