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
import * as Type from "../Type"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "../deserialize"
import { Node } from "../Node"

export class ObjectLiteral extends Expression {
	get class() { return "literal.object" }
	constructor(readonly className: Type.Identifier | undefined, readonly value: { [property: string]: Expression } | any, type?: Type.Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		const value: { [property: string]: { class: string } & any } = {}
		for (const property in this.value)
			if (this.value.hasOwnProperty(property))
				value[property] = this.value[property].serialize()
		return { ...super.serialize(), className: (this.className ? this.className.serialize() : undefined), value }
	}
}
function deserializeValue(value: { [property: string]: { class: string } & any }): { [property: string]: Expression } {
	const result: { [property: string]: Expression } = {}
	let v: Expression | undefined
	for (const property in value)
		if (value.hasOwnProperty(property) && (v = deserialize(value[property])))
			result[property] = v
	return result
}
// tslint:disable no-construct
addDeserializer("literal.object", data => data.hasOwnProperty("value") ? new ObjectLiteral(data.className, deserializeValue(data.value)) : undefined)
