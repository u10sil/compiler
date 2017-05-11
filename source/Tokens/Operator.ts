// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import { Error } from "@cogneco/mend"
import { Source } from "./Source"
import { Token } from "./Token"
import { Substance } from "./Substance"

export class Operator extends Substance {
	constructor(private symbol: string, region: Error.Region) {
		super(region)
	}
	getSymbol(): string {
		return this.symbol
	}
	isOperator(symbol: string = null): boolean {
		return !symbol || symbol == this.symbol
	}
	static scan(source: Source): Token {
		var result: Token;
		switch (source.peek()) {
			case "@": result = new Operator(source.read(), source.mark()); break
			case "+":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "++": result = new Operator(source.read(2), source.mark()); break
					case "+=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "-":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "-=": result = new Operator(source.read(2), source.mark()); break
					case "->": result = new Operator(source.read(2), source.mark()); break
				} break
			case "*":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "**":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case "**=": result = new Operator(source.read(3), source.mark()); break
						} break
					case "*=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "/":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "/=": result = new Operator(source.read(2), source.mark()); break
				}; break
			case "=":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "==": result = new Operator(source.read(2), source.mark()); break
					case "=>": result = new Operator(source.read(2), source.mark()); break
				} break
			case "^":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "^=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "|":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "||": result = new Operator(source.read(2), source.mark()); break
					case "|=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "&":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "&&": result = new Operator(source.read(2), source.mark()); break
					case "&=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "!":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "!=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "<":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "<<":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case "<<=": result = new Operator(source.read(3), source.mark()); break
						} break
					case "<=":
						switch (source.peek(4)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case "<==>": result = new Operator(source.read(4), source.mark()); break
						} break
				} break
			case ">":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case ">>":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case ">>=": result = new Operator(source.read(3), source.mark()); break
						} break
					case ">=": result = new Operator(source.read(2), source.mark()); break
				}
				break
			case ":":
				switch (source.peek(2)) {
					default: result = null /* separator */; break
					case ":=":
						switch (source.peek(3)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case ":==": result = new Operator(source.read(3), source.mark()); break
						} break
					case "::":
						switch (source.peek(3)) {
							default: source.raise("Undefined operator \"::\""); break
							case "::=": result = new Operator(source.read(3), source.mark()); break
						} break
				} break
			case ".":
				switch (source.peek(2)) {
					default: result = null /* separator */; break
					case "..":
						switch(source.peek(3)) {
							default: result = new Operator(source.read(2), source.mark()); break
							case "...": result = new Operator(source.read(3), source.mark()); break
						} break
				} break
			case "%":
				switch (source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "%=": result = new Operator(source.read(2), source.mark()); break
				} break
			case "~": result = new Operator(source.read(), source.mark()); break
			case "?":
				switch(source.peek(2)) {
					default: result = new Operator(source.read(), source.mark()); break
					case "??": result = new Operator(source.read(2), source.mark()); break
				} break

			default: result = null; break
		}
		return result
	}
}
