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
import * as Type from "../Type"
import { Expression } from "./Expression"
import { addDeserializer } from "../deserialize"
import { Node } from "../Node"

export class Number extends Expression {
	get class() { return "literal.number" }
	constructor(readonly value: number, type?: Type.Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			value: this.value,
		}
	}
}
// tslint:disable no-construct
addDeserializer("literal.number", data => data.hasOwnProperty("value") ? new Number(data.value) : undefined)
