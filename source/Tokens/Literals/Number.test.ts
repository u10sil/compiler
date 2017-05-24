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

import { Error, IO, Unit } from "@cogneco/mend"
import * as Tokens from "../"

import Is = Unit.Is
export class NumberTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Literals.Number")
		const errorHandler = new Error.ConsoleHandler()
		let token: Tokens.Token | undefined
		this.add("integer #1", () => {
			const numberString = "000012"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseInt(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseInt(numberString), original: numberString }))
		})
		this.add("integer #2", () => {
			const numberString = "12345678900"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseInt(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseInt(numberString), original: numberString }))
		})
		this.add("float #1", () => {
			const numberString = "000012.21"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseFloat(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseFloat(numberString), original: numberString }))
		})
		this.add("float #2", () => {
			const numberString = "12345678.900"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseFloat(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseFloat(numberString), original: numberString }))
		})
		this.add("float #3", () => {
			const numberString = "0.0000012"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseFloat(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseFloat(numberString), original: numberString }))
		})
		this.add("float #4", () => {
			const numberString = ".01"
			const source = new Tokens.Source(IO.StringReader.create(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseFloat(numberString)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseFloat(numberString), original: numberString }))
		})
		this.add("binary #1", () => {
			const binaryString = "0b00000000"
			const source = new Tokens.Source(IO.StringReader.create(binaryString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(0))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 0, original: binaryString }))
		})
		this.add("binary #2", () => {
			const binaryString = "0b100000001"
			const source = new Tokens.Source(IO.StringReader.create(binaryString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(257))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 257, original: binaryString }))
		})
		this.add("octal #1", () => {
			const octalString = "0c0"
			const source = new Tokens.Source(IO.StringReader.create(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(0))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 0, original: octalString }))
		})
		this.add("octal #2", () => {
			const octalString = "0c10"
			const source = new Tokens.Source(IO.StringReader.create(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(8))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 8, original: octalString }))
		})
		this.add("octal #3", () => {
			const octalString = "0c20000"
			const source = new Tokens.Source(IO.StringReader.create(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(8192))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 8192, original: octalString }))
		})
		this.add("hexadecimal #1", () => {
			const hexadecimalString = "0x0"
			const source = new Tokens.Source(IO.StringReader.create(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(0))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: 0, original: hexadecimalString }))
		})
		this.add("hexadecimal #2", () => {
			const hexadecimalString = "0xF"
			const source = new Tokens.Source(IO.StringReader.create(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseInt(hexadecimalString, 16)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseInt(hexadecimalString, 16), original: hexadecimalString }))
		})
		this.add("hexadecimal #3", () => {
			const hexadecimalString = "0xB0D16F"
			const source = new Tokens.Source(IO.StringReader.create(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Tokens.Literals.Number, Is.true)
			this.expect((token as Tokens.Literals.Number).value, Is.equal.to(parseInt(hexadecimalString, 16)))
			this.expect(token!.serialize(), Is.equal.to({ class: "number", value: parseInt(hexadecimalString, 16), original: hexadecimalString }))
		})
	}
}
Unit.Fixture.add(new NumberTest())
