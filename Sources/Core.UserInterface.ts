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

            if (!PERCENTAGE_REGEX.test(str))
                return null;

            let exec = PERCENTAGE_REGEX.exec(str),
                numberStr = exec["groups"]["number"];

            return new Percentage(numberStr);
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
                throw new Exceptions.ArgumentException("value", "Parameter is not a valid integer value.");
            if (value < 0 || value > COLOR_RGB_MAX_INT_VALUE)
                throw new Exceptions.ArgumentOutOfRangeException("value");

            let r = (value >>> 16) & COLOR_RGB_INT_FIELD_MASK,
                g = (value >>> 8) & COLOR_RGB_INT_FIELD_MASK,
                b = value & COLOR_RGB_INT_FIELD_MASK;

            return new ColorRGB(r.toString(), g.toString(), b.toString());
        }

        private static fromHexCode(value: string) {
            if (value.startsWith("#")) {
                value = value.slice(1);

                let intValue = Number("0x" + value);

                if (value.length == 3)
                    return Color.fromInt(intValue * 0x1001);
                else if (value.length == 6)
                    return Color.fromInt(intValue);
            }

            throw new Exceptions.ArgumentException("value", "Parameter is not a valid hexadecimal color value.");
        }

        public static parse(str: string): Color {
            let colorFromName = null,
                outColor = null;

            return Colors.fromName(str) || ColorRGB.parse(str) || ColorRGBA.parse(str) || ColorCMYK.parse(str) ||
                ColorHSL.parse(str) || ColorHSV.parse(str);
        }

        public constructor(type: ColorType) {
            this.type = type;
        }

        public abstract toString(): string;

        public type: ColorType;
    }

    export class ColorRGB extends Color {
        public constructor(r: string | number, g: string | number, b: string | number) {
            super(ColorType.RGB);

            this.r = Percentage.parse(<string>r) || Number(r);
            this.g = Percentage.parse(<string>g) || Number(g);
            this.b = Percentage.parse(<string>b) || Number(b);

            return Object.freeze(this);
        }

        public r: Number;
        public g: Number;
        public b: Number;

        public toString(): string {
            return null;
        }
    }

    export class ColorRGBA extends Color {
        public static parse(str: string) {
            return null;
        }

        public constructor(r: string | number, g: string | number, b: string | number, a: string | number) {
            super(ColorType.RGBA);

            this.r = Percentage.parse(<string>r) || Number(r);
            this.g = Percentage.parse(<string>g) || Number(g);
            this.b = Percentage.parse(<string>b) || Number(b);
            this.a = Percentage.parse(<string>a) || Number(a);

            return Object.freeze(this);
        }

        public r: Number;
        public g: Number;
        public b: Number;
        public a: Number;

        public toString(): string {
            return null;
        }
    }

    export class ColorCMYK extends Color {
        public constructor(c: string | number, m: string | number, y: string | number, k: string | number) {
            super(ColorType.CMYK);

            this.c = Percentage.parse(<string>c) || Number(c);
            this.m = Percentage.parse(<string>m) || Number(m);
            this.y = Percentage.parse(<string>y) || Number(y);
            this.k = Percentage.parse(<string>k) || Number(k);

            return Object.freeze(this);
        }

        public c: Number;
        public m: Number;
        public y: Number;
        public k: Number;

        public toString(): string {
            return null;
        }
    }

    export class ColorHSL extends Color {
        public constructor(h: string | number, s: string | number, l: string | number) {
            super(ColorType.HSL);

            this.h = Percentage.parse(<string>h) || Number(h);
            this.s = Percentage.parse(<string>s) || Number(s);
            this.l = Percentage.parse(<string>l) || Number(l);

            return Object.freeze(this);
        }

        public h: Number;
        public s: Number;
        public l: Number;

        public toString(): string {
            return null;
        }
    }

    export class ColorHSV extends Color {
        public constructor(h: string | number, s: string | number, v: string | number) {
            super(ColorType.HSV);

            this.h = Percentage.parse(<string>h) || Number(h);
            this.s = Percentage.parse(<string>s) || Number(s);
            this.v = Percentage.parse(<string>v) || Number(v);

            return Object.freeze(this);
        }

        public h: Number;
        public s: Number;
        public v: Number;

        public toString(): string {
            return null;
        }
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