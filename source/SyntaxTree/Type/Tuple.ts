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
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "../deserialize"
import { Node } from "../Node"

export class Tuple extends Expression {
	get class() { return "type.tuple" }
	constructor(readonly elements: Utilities.Enumerable<Expression>, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			elements: this.elements.map(c => c.serialize()).toArray(),
		}
	}
	toString(): string {
		return "(" + this.elements.map(argument => argument.toString()).toArray().join(", ") + ")"
	}
}
addDeserializer("type.tuple", data => new Tuple(deserialize<Expression>(data.elements as Utilities.Enumerable<{ class: string } & any>)))
