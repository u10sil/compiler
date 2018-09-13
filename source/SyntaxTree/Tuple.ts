// Copyright (C) 2017  Simon Mika <simon@mika.se>
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
import * as Type from "./Type"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class Tuple extends Expression {
	get precedence() { return Number.MAX_VALUE }
	get class() { return "tuple" }
	constructor(readonly elements: Utilities.Enumerable<Expression>, type?: Type.Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		const elements = this.elements.map(e => e.serialize()).toArray()
		return {
			...super.serialize(),
			elements: elements.length > 0 ? elements : undefined,
		}
	}
}
addDeserializer("tuple", data => new Tuple(deserialize<Expression>(data.elements as ({ class: string } & any)[])))
