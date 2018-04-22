namespace Core.UserInterface {
    export enum ContentType { Text, HTML }
    export class Content {
        public constructor(value: string, type: ContentType = ContentType.Text) {
            type = type;
            this.type = type;
            this.value = value;

            return Object.freeze(this);
        }

        public value: string;
        public type: ContentType;
    }

    export class Percentage extends Number {
        public static parse(str: string) {
            const PERCENTAGE_REGEX = /^(?<number>\d+?)%/;

            if (PERCENTAGE_REGEX.test(str))
                return null;

            let exec = PERCENTAGE_REGEX.exec(str),
                numberStr = exec["groups"]["number"];

            return super.parseFloat(numberStr);
        }

        public toString(): string {
            return `${super.toString.call(this)}%`;
        }
    }

    export enum ColorType { RGB, RGBA, CMYK, HSL, HSV }

    const COLOR_RGB_MAX_INT_VALUE = (1 << 24) - 1;
    const COLOR_RGB_INT_FIELD_MASK = (1 << 8) - 1;

    export abstract class Color {
        public static fromInt(value: number) {
            if (!Number.isInteger(value))
                throw new Exceptions.ArgumentException("value", "Parameter is not valid integer value.");
            if (value < 0 || value > COLOR_RGB_MAX_INT_VALUE)
                throw new Exceptions.ArgumentOutOfRangeException("value");

            let r = (value >>> 16) & COLOR_RGB_INT_FIELD_MASK,
                g = (value >>> 8) & COLOR_RGB_INT_FIELD_MASK,
                b = value & COLOR_RGB_INT_FIELD_MASK;

            return new ColorRGB(r.toString(), g.toString(), b.toString());
        }

        public static parse(str: string): Color {
            let rgbInt: number = Number.parseInt(str),
                colorFromName: Color = Colors.fromName(str);

            if (!isNaN(rgbInt))
                return this.fromInt(rgbInt);
            else if (colorFromName)
                return colorFromName;
            else
                return ColorRGB.parse(str) || ColorRGBA.parse(str) || ColorCMYK.parse(str) || ColorHSL.parse(str) ||
                    ColorHSV.parse(str) || null;
        }

        public constructor(type: ColorType) {
            this.type = type;
        }

        public toString(): string {
            return null;
        }

        public type: ColorType;
    }

    export class ColorRGB extends Color {
        public constructor(r: string, g: string, b: string) {
            super(ColorType.RGB);

            this.r = Percentage.parse(r) || Number.parseFloat(r);
            this.g = Percentage.parse(g) || Number.parseFloat(g);
            this.b = Percentage.parse(b) || Number.parseFloat(b);

            return Object.freeze(this);
        }

        public r: Number;
        public g: Number;
        public b: Number;
    }

    export class ColorRGBA extends Color {
        public static parse(str: string) {
            return null;
        }

        public constructor(r: string, g: string, b: string, a: string) {
            super(ColorType.RGBA);

            this.r = Percentage.parse(r) || Number.parseFloat(r);
            this.g = Percentage.parse(g) || Number.parseFloat(g);
            this.b = Percentage.parse(b) || Number.parseFloat(b);
            this.a = Percentage.parse(a) || Number.parseFloat(a);

            return Object.freeze(this);
        }

        public r: Number;
        public g: Number;
        public b: Number;
        public a: Number;
    }

    export class ColorCMYK extends Color {
        public constructor(c: string, m: string, y: string,
            k: string) {
            super(ColorType.CMYK);

            this.c = Percentage.parse(c) || Number.parseFloat(c);
            this.m = Percentage.parse(m) || Number.parseFloat(m);
            this.y = Percentage.parse(y) || Number.parseFloat(y);
            this.k = Percentage.parse(k) || Number.parseFloat(k);

            return Object.freeze(this);
        }

        public c: Number;
        public m: Number;
        public y: Number;
        public k: Number;
    }

    export class ColorHSL extends Color {
        public constructor(h: string, s: string, l: string) {
            super(ColorType.HSL);

            this.h = Percentage.parse(h) || Number.parseFloat(h);
            this.s = Percentage.parse(s) || Number.parseFloat(s);
            this.l = Percentage.parse(l) || Number.parseFloat(l);

            return Object.freeze(this);
        }

        public h: Number;
        public s: Number;
        public l: Number;
    }

    export class ColorHSV extends Color {
        public constructor(h: string, s: string, v: string) {
            super(ColorType.HSV);

            this.h = Percentage.parse(h) || Number.parseFloat(h);
            this.s = Percentage.parse(s) || Number.parseFloat(s);
            this.v = Percentage.parse(v) || Number.parseFloat(v);

            return Object.freeze(this);
        }

        public h: Number;
        public s: Number;
        public v: Number;
    }

    export class BrushList extends Collections.Generic.List<Brush> {
    }

    export enum BrushType { Image, LinearGradient, RadialGradient, ConicGradient }
    export namespace BrushType {
        export function parse(str: string) {
            switch (str) {
                case "url":
                    return BrushType.Image;
                case "linear-gradient":
                    return BrushType.LinearGradient;
                case "radial-gradient":
                    return BrushType.LinearGradient;
                case "conic-gradient":
                    return BrushType.LinearGradient;
            }

            return null;
        }

        export function toString(type: BrushType) {
            switch (type) {
                case BrushType.Image:
                    return "url";
                case BrushType.LinearGradient:
                    return "linear-gradient";
                case BrushType.RadialGradient:
                    return "radial-gradient";
                case BrushType.ConicGradient:
                    return "conic-gradient";
            }

            return null;
        }
    }

    export abstract class Brush {
        public static parse(str: string): Brush {
            return null;
        }

        public constructor(type: BrushType) {
            this.type = type;
        }

        public type: BrushType;

        public toString(): string {
            return null;
        }
    }

    export class ImageBrush extends Brush {
        public constructor(source: string) {
            super(BrushType.Image);

            this.source = source;

            return Object.freeze(this);
        }

        public source: string;
    }

    export abstract class GradientBrush extends Brush {

        public static parse(str: string): GradientBrush {
            return null;
        }

        public constructor(type: BrushType, stops: GradientStop[] = []) {
            super(type);

            this.stops = new GradientStopList(stops);
        }

        public toString(): string {
            return null;
        }

        stops: GradientStopList;
    }

    export class LinearGradientBrush extends GradientBrush {
        public constructor(stops?: GradientStop[]) {
            super(BrushType.LinearGradient, stops);
        }
    }

    export class RadialGradientBrush extends GradientBrush {
        public constructor(stops?: GradientStop[]) {
            super(BrushType.RadialGradient, stops);
        }
    }

    export class ConicGradientBrush extends GradientBrush {
        public constructor(stops: GradientStop[] = []) {
            super(BrushType.ConicGradient, stops);
        }
    }

    export class GradientStopList extends Collections.Generic.List<GradientStop> {
    }

    export class GradientStop {
        constructor(color: Color, offset: string) {
            this.color = color;
            this.offset = Percentage.parse(offset);

            return Object.freeze(this);
        }

        public color: Color;
        public offset: Number;
    }

    export enum LengthUnit { Number, Pixels, Percent, Inches, Millimeters, Centimeters, Points, Picas, Em, Ex }
    export namespace LengthUnit {
        const STR_CONVERSION_MAP: [LengthUnit, string][] = [
            [LengthUnit.Number, ""],
            [LengthUnit.Pixels, "px"],
            [LengthUnit.Percent, "%"],
            [LengthUnit.Inches, "in"],
            [LengthUnit.Centimeters, "cm"],
            [LengthUnit.Millimeters, "mm"],
            [LengthUnit.Points, "pt"],
            [LengthUnit.Picas, "pc"],
            [LengthUnit.Em, "em"],
            [LengthUnit.Ex, "ex"]
        ];

        export function parse(str: string): LengthUnit {
            let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);

            if (matches.length == 0)
                return null;

            else return matches[0][0];
        }

        export function toString(style: LengthUnit): string {
            let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);

            if (matches.length == 0)
                return null;

            else return matches[0][1];
        }
    }

    export class Length {
        public static getZero(): Length {
            return new Length(0, LengthUnit.Number);
        }

        public static parse(str: string): Length {
            //Find value in string
            let valueStr = StringUtils.matchString(str, /^\d+/);

            if (valueStr === null)
                throw new Exceptions.InvalidOperationException("Cannot parse length. Missing value.");

            let value = Number(valueStr), //Parse value
                unitStr = str.substring(valueStr.length), //Get unit substring
                unit = LengthUnit.parse(unitStr); //Parse unit

            if (unit === null)
                throw new Exceptions.InvalidOperationException("Cannot parse length. Invalid unit.");

            if (isNaN(value))
                throw new Error("Cannot parse length. Value is not a number.");

            return new Length(value, unit);
        }

        public constructor(value: number, unit: LengthUnit) {
            this.value = value;
            this.unit = unit;

            return Object.freeze(this);
        }

        toString(): string {
            return String(this.value) + LengthUnit.toString(this.unit);
        }

        public value: number;
        public unit: LengthUnit;
    }

    export enum BorderStyle { Hidden, Dotted, Dashed, Solid, Double, Groove, Ridge, Inset, Inherit, Unset }
    export namespace BorderStyle {
        const STR_CONVERSION_MAP: [BorderStyle, string][] = [
            [BorderStyle.Hidden, "hidden"],
            [BorderStyle.Dotted, "dotted"],
            [BorderStyle.Dashed, "dashed"],
            [BorderStyle.Solid, "solid"],
            [BorderStyle.Double, "double"],
            [BorderStyle.Groove, "groove"],
            [BorderStyle.Ridge, "ridge"],
            [BorderStyle.Inset, "inset"],
            [BorderStyle.Inherit, "inherit"],
            [BorderStyle.Unset, "unset"]
        ];

        export function parse(str: string): BorderStyle {
            let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);

            if (matches.length == 0)
                return null;

            else return matches[0][0];
        }

        export function toString(style: BorderStyle): string {
            let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);

            if (matches.length == 0)
                return null;

            else return matches[0][1];
        }
    }
}