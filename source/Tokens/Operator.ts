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

import { Error } from "@cogneco/mend"
import { Source } from "./Source"
import { Token } from "./Token"
import { Substance } from "./Substance"

export class Operator extends Substance {
	constructor(readonly symbol: string, region?: Error.Region) {
		super(region)
	}
	serialize(): { class: string } & any {
		return {
			class: "operator",
			symbol: this.symbol,
		}
	}
	isOperator(symbol?: string | ((symbol: string) => boolean)): boolean {
		return symbol == undefined || (typeof(symbol) == "string" ? symbol == this.symbol : symbol(this.symbol))
	}
	static scan(source: Source): Token | undefined {
		let result: Token | undefined
		switch (source.peek()) {
			case "@": result = new Operator(source.read()!, source.mark()); break
			case "+":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "++": result = new Operator(source.read(2)!, source.mark()); break
					case "+=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "-":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "--": result = new Operator(source.read(2)!, source.mark()); break
					case "-=": result = new Operator(source.read(2)!, source.mark()); break
					case "->": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "*":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "**":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case "**=": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
					case "*=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "/":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "/=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "=":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "==": result = new Operator(source.read(2)!, source.mark()); break
					case "=>": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "^":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "^=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "|":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "||": result = new Operator(source.read(2)!, source.mark()); break
					case "|=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "&":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "&&": result = new Operator(source.read(2)!, source.mark()); break
					case "&=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "!":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "!=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "<":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "<<":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case "<<=": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
					case "<=":
						switch (source.peek(4)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case "<==>": result = new Operator(source.read(4)!, source.mark()); break
						}
						break
				}
				break
			case ">":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case ">>":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case ">>=": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
					case ">=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case ":":
				switch (source.peek(2)) {
					default: /* separator */ break
					case ":=":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case ":==": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
					case "::":
						switch (source.peek(3)) {
							default: source.raise("Undefined operator \"::\""); break
							case "::=": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
				}
				break
			case ".":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "..":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2)!, source.mark()); break
							case "...": result = new Operator(source.read(3)!, source.mark()); break
						}
						break
				}
				break
			case "%":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "%=": result = new Operator(source.read(2)!, source.mark()); break
				}
				break
			case "~": result = new Operator(source.read()!, source.mark()); break
			case "?":
				switch (source.peek(2)) {
					default: result = new Operator(source.read()!, source.mark()); break
					case "??": result = new Operator(source.read(2)!, source.mark()); break
				}
				break

			default: break
		}
		return result
	}
}
