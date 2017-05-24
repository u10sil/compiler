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

import { Error, IO } from "@cogneco/mend"
import { Source } from "../Source"
import { Token } from "../Token"
import { Literal } from "../Literal"

export class Number extends Literal {
	constructor(readonly value: number, readonly original: string, region: Error.Region) {
		super(region)
	}
	serialize(): { class: string } & any {
		return {
			class: "number",
			value: this.value,
			original: this.original,
		}
	}
	static scan(source: Source): Token | undefined {
		return this.scanBinary(source) ||
		this.scanOctal(source) ||
		this.scanHexadecimal(source) ||
		this.scanDecimal(source)
	}
	private static scanHexadecimal(reader: IO.BufferedReader): Token | undefined {
		let result: Token | undefined
		if (reader.peek(2) == "0x") {
			let original = reader.read(2) || ""
			let value = 0
			let divisor: number | undefined
			while (!result) {
				switch (reader.peek()) {
					case ".":
						original += reader.read()
						if (divisor) // tslint:disable:no-construct
							result = new Number(divisor ? value / divisor : value, original, reader.mark())
						else
							divisor = 1
						continue
					case "_": original += reader.read(); continue
					case "0": value = value * 16 + 0; original += reader.read(); break
					case "1": value = value * 16 + 1; original += reader.read(); break
					case "2": value = value * 16 + 2; original += reader.read(); break
					case "3": value = value * 16 + 3; original += reader.read(); break
					case "4": value = value * 16 + 4; original += reader.read(); break
					case "5": value = value * 16 + 5; original += reader.read(); break
					case "6": value = value * 16 + 6; original += reader.read(); break
					case "7": value = value * 16 + 7; original += reader.read(); break
					case "8": value = value * 16 + 8; original += reader.read(); break
					case "9": value = value * 16 + 9; original += reader.read(); break
					case "A": case "a": value = value * 16 + 10; original += reader.read(); break
					case "B": case "b": value = value * 16 + 11; original += reader.read(); break
					case "C": case "c": value = value * 16 + 12; original += reader.read(); break
					case "D": case "d": value = value * 16 + 13; original += reader.read(); break
					case "E": case "e": value = value * 16 + 14; original += reader.read(); break
					case "F": case "f": value = value * 16 + 15; original += reader.read(); break
					default: result = new Number(divisor ? value / divisor : value, original, reader.mark()); continue
				}
				if (divisor)
					divisor *= 16
			}
		}
		return result
	}
	private static scanDecimal(reader: IO.BufferedReader): Token | undefined {
		let result: Token | undefined
		let peeked = reader.peek()
		if (peeked && (Number.isNumber(peeked) || peeked == "." && (peeked = reader.peek(2)) && Number.isNumber(peeked.slice(1, 2)))) {
			let original: string = ""
			let value = 0
			let divisor: number | undefined
			while (!result) {
				switch (reader.peek()) {
					case ".":
						original += reader.read()
						if (divisor)
							result = new Number(divisor ? value / divisor : value, original, reader.mark())
						else
							divisor = 1
						continue
					case "_": original += reader.read(); continue
					case "0": value = value * 10 + 0; original += reader.read(); break
					case "1": value = value * 10 + 1; original += reader.read(); break
					case "2": value = value * 10 + 2; original += reader.read(); break
					case "3": value = value * 10 + 3; original += reader.read(); break
					case "4": value = value * 10 + 4; original += reader.read(); break
					case "5": value = value * 10 + 5; original += reader.read(); break
					case "6": value = value * 10 + 6; original += reader.read(); break
					case "7": value = value * 10 + 7; original += reader.read(); break
					case "8": value = value * 10 + 8; original += reader.read(); break
					case "9": value = value * 10 + 9; original += reader.read(); break
					//
					// Handle suffixes
					// TODO:	This will probably not be sufficient once we enable more of them.
					// 			How will we differentiate between float and double?
					//
					case "f": reader.read()
						// FALL-THROUGH
					default:
						result = new Number(divisor ? value / divisor : value, original, reader.mark()); continue
				}
				if (divisor)
					divisor *= 10
			}
		}
		return result
	}
	private static scanOctal(reader: IO.BufferedReader): Token | undefined {
		let result: Token | undefined
		if (reader.peek(2) == "0c") {
			let original = reader.read(2) || ""
			let value = 0
			let divisor: number | undefined
			while (!result) {
				switch (reader.peek()) {
					case ".":
						original += reader.read() || ""
						if (divisor)
							result = new Number(divisor ? value / divisor : value, original, reader.mark())
						else
							divisor = 1
						continue
					case "_": original += reader.read(); continue
					case "0": value = value * 8 + 0; original += reader.read(); break
					case "1": value = value * 8 + 1; original += reader.read(); break
					case "2": value = value * 8 + 2; original += reader.read(); break
					case "3": value = value * 8 + 3; original += reader.read(); break
					case "4": value = value * 8 + 4; original += reader.read(); break
					case "5": value = value * 8 + 5; original += reader.read(); break
					case "6": value = value * 8 + 6; original += reader.read(); break
					case "7": value = value * 8 + 7; original += reader.read(); break
					default: result = new Number(divisor ? value / divisor : value, original, reader.mark()); continue
				}
				if (divisor)
					divisor *= 8
			}
		}
		return result
	}
	private static scanBinary(reader: IO.BufferedReader): Token | undefined {
		let result: Token | undefined
		if (reader.peek(2) == "0b") {
			let original = reader.read(2) || ""
			let value = 0
			let divisor: number | undefined
			while (!result) {
				switch (reader.peek()) {
					case ".":
						original += reader.read()
						if (divisor)
							result = new Number(divisor ? value / divisor : value, original, reader.mark())
						else
							divisor = 1
						continue
					case "_": original += reader.read(); continue
					case "0": value = value * 2 + 0; original += reader.read(); break
					case "1": value = value * 2 + 1; original += reader.read(); break
					default: result = new Number(divisor ? value / divisor : value, original, reader.mark()); continue
				}
				if (divisor)
					divisor *= 2
			}
		}
		return result
	}
	private static isNumber(character: string): boolean {
		return character >= "0" && character <= "9"
	}
}
