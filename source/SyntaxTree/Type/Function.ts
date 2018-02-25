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
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "../deserialize"
import { Node } from "../Node"

export class Function extends Expression {
	get class() { return "type.function" }
	get arguments(): Utilities.Iterator<Expression> {
		return new Utilities.ArrayIterator(this.argumentArray)
	}
	constructor(private argumentArray: Expression[], readonly result: Expression, tokens?: Utilities.Iterable<Tokens.Substance> | Node) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			arguments: this.argumentArray.map(a => a.serialize()),
			result: this.result.serialize(),
		}
	}
	toString(): string {
		return "(" + this.argumentArray.map(argument => argument.toString()).join(", ") + ") => " + this.result.toString()
	}
}
addDeserializer("type.function", data => data.hasOwnProperty("value") ? new Function(deserialize<Expression>(data.arguments as ({ class: string } & any)[]), deserialize(data.result)!) : undefined)
