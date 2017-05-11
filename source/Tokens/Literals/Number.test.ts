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
		var errorHandler = new Error.ConsoleHandler()
		var token: Tokens.Token
		this.add("integer #1", () => {
			var numberString = "000012"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseInt(numberString)))
		})
		this.add("integer #2", () => {
			var numberString = "12345678900"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseInt(numberString)))
		})
		this.add("float #1", () => {
			var numberString = "000012.21"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseFloat(numberString)))
		})
		this.add("float #2", () => {
			var numberString = "12345678.900"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseFloat(numberString)))
		})
		this.add("float #3", () => {
			var numberString = "0.0000012"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseFloat(numberString)))
		})
		this.add("float #4", () => {
			var numberString = ".01f"
			var source = new Tokens.Source(new IO.StringReader(numberString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseFloat(numberString)))
		})
		this.add("binary #1", () => {
			var binaryString = "0b00000000"
			var source = new Tokens.Source(new IO.StringReader(binaryString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(0))
		})
		this.add("binary #2", () => {
			var binaryString = "0b100000001"
			var source = new Tokens.Source(new IO.StringReader(binaryString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(257))
		})
		this.add("octal #1", () => {
			var octalString = "0c0"
			var source = new Tokens.Source(new IO.StringReader(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(0))
		})
		this.add("octal #2", () => {
			var octalString = "0c10"
			var source = new Tokens.Source(new IO.StringReader(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(8))
		})
		this.add("octal #3", () => {
			var octalString = "0c20000"
			var source = new Tokens.Source(new IO.StringReader(octalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(8192))
		})
		this.add("hexadecimal #1", () => {
			var hexadecimalString = "0x0"
			var source = new Tokens.Source(new IO.StringReader(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(0))
		})
		this.add("hexadecimal #2", () => {
			var hexadecimalString = "0xF"
			var source = new Tokens.Source(new IO.StringReader(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseInt(hexadecimalString, 16)))
		})
		this.add("hexadecimal #3", () => {
			var hexadecimalString = "0xB0D16F"
			var source = new Tokens.Source(new IO.StringReader(hexadecimalString), errorHandler)
			this.expect((token = Tokens.Literals.Number.scan(source)) instanceof Number, Is.True())
			this.expect((<Tokens.Literals.Number>token).getValue(), Is.Equal().To(parseInt(hexadecimalString, 16)))
		})
	}
}
Unit.Fixture.add(new NumberTest())
