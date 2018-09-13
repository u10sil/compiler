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
import { Statement } from "./Statement"
import { Expression } from "./Expression"
import * as Type from "./Type"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class Block extends Expression {
	get class() { return "block" }
	get precedence(): number {
		return Number.MAX_VALUE
	}
	constructor(readonly statements: Utilities.Enumerable<Statement>, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(Block.typeOfLast(statements), tokens)
	}
	serialize(): { class: string } & any {
		const statements = this.statements.map(s => s.serialize()).toArray()
		return {
			...super.serialize(),
			statements: statements.length > 0 ? statements : undefined,
		}
	}
	private static typeOfLast(statements: Utilities.Enumerable<Statement>): Type.Expression | undefined {
		const last = statements.last
		return last instanceof Expression ? last.type : undefined
	}
}
addDeserializer("block", data => data.hasOwnProperty("statements") ? new Block(deserialize<Statement>(data.statements as ({ class: string } & any)[])) : undefined)
