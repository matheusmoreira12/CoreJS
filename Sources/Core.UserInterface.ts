namespace Core.UserInterface {
    export enum ContentType { Text, HTML }
    export class Content {
        public constructor(value: string, type: ContentType = ContentType.Text) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, STRING, true, false);
            Validation.RuntimeValidator.validateParameter("type", type, NUMBER, true, false);

            type = type;
            this.type = type;
            this.value = value;

            return Object.freeze(this);
        }

        public value: string;
        public type: ContentType;
    }

    export enum FlexibleValueUnit { Number, Percent }
    export namespace FlexibleValueUnit {
        export function parse(unitStr: string) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("unitStr", unitStr, STRING, true, false);

            switch (unitStr) {
                case "":
                    return FlexibleValueUnit.Number;
                case "%":
                    return FlexibleValueUnit.Percent;
            }

            return null;
        }

        export function toString(unit: FlexibleValueUnit): string {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("unit", unit, NUMBER, true, false);

            switch (unit) {
                case FlexibleValueUnit.Number:
                    return "";
                case FlexibleValueUnit.Percent:
                    return "%";
            }

            return null;
        }
    }

    export class FlexibleValue {
        public static infer(value: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, [STRING, NUMBER, FlexibleValue], true, false);

            if (typeof value === STRING)
                return FlexibleValue.parse(<string>value);
            else if (typeof value === NUMBER)
                return new FlexibleValue(<number>value, FlexibleValueUnit.Number);
            else
                return <FlexibleValue>value;
        }

        public static parse(str: string): FlexibleValue {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            let valueStr = StringUtils.matchString(str, /\d+/);

            if (valueStr === null)
                throw new Exceptions.InvalidOperationException("Cannot parse color value. Missing value.");

            let value = Number(valueStr),
                unitStr = str.substring(valueStr.length),
                unit = FlexibleValueUnit.parse(unitStr);

            if (unit === null)
                throw new Exceptions.InvalidOperationException("Cannot parse color value. Invalid unit.");

            if (isNaN(value))
                throw new Exceptions.InvalidOperationException("Cannot parse color value. Value is not a number.");

            return new FlexibleValue(value, unit);
        }

        public constructor(value: number, unit: FlexibleValueUnit) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("unit", unit, NUMBER, true, false);

            this.value = value;
            this.unit = unit;

            return Object.freeze(this);
        }

        public value: number;
        public unit: FlexibleValueUnit;

        public toString(): string {
            return this.value.toString() + this.unit.toString();
        }
    }

    export type FlexibleValueDecorator = FlexibleValue | string | number;

    export enum ColorType { RGB, RGBA, CMYK, HSL, HSV }
    export namespace ColorType {
        const STR_CONVERSION_MAP: [ColorType, string][] = [
            [ColorType.RGB, "rgb"],
            [ColorType.RGBA, "rgba"],
            [ColorType.CMYK, "cmyk"],
            [ColorType.HSL, "hsl"],
            [ColorType.HSV, "hsv"]
        ];

        export function parse(str: string): ColorType {
            let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);

            if (matches.length == 0)
                return null;

            else return matches[0][0];
        }

        export function toString(style: ColorType): string {
            let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);

            if (matches.length == 0)
                return null;

            else return matches[0][1];
        }
    }

    const MAX_RGB_INT_VALUE = 0xFFFFFF;
    const RGB_INT_FIELD_MASK = 0xFF;

    export abstract class Color {
        private static _inferFromInt(value: number) {
            if (String(value) != value.toPrecision() || value < 0 || value > MAX_RGB_INT_VALUE)
                throw new Exceptions.ParameterOutOfRangeException("value");

            let r = (value >>> 16) & RGB_INT_FIELD_MASK,
                g = (value >>> 8) & RGB_INT_FIELD_MASK,
                b = value & RGB_INT_FIELD_MASK;

            return new ColorRGB(r, g, b);
        }

        public static infer(value: string | number | Color): Color {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, [STRING, NUMBER, Color], true, false);

            if (typeof (value) === STRING)
                return Color.parse(<string>value);
            else if (typeof (value) === NUMBER)
                return Color._inferFromInt(<number>value);
            else
                return <Color>value;
        }

        public static parse(str: string): Color {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            return null;
        }

        public constructor(type: ColorType) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("type", type, NUMBER, true, false);

            this.type = type;
        }

        public toString(): string {
            return null;
        }

        public type: ColorType;
    }

    export class ColorRGB extends Color {
        public constructor(r: FlexibleValueDecorator, g: FlexibleValueDecorator, b: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("r", r, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("g", g, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("b", b, [STRING, NUMBER, FlexibleValue], true, false);

            super(ColorType.RGB);

            this.r = FlexibleValue.infer(r);
            this.g = FlexibleValue.infer(g);
            this.b = FlexibleValue.infer(b);

            return Object.freeze(this);
        }

        public r: FlexibleValue;
        public g: FlexibleValue;
        public b: FlexibleValue;
    }

    export class ColorRGBA extends Color {
        public constructor(r: FlexibleValueDecorator, g: FlexibleValueDecorator, b: FlexibleValueDecorator,
            a: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("r", r, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("g", g, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("b", b, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("a", a, [STRING, NUMBER, FlexibleValue], true, false);

            super(ColorType.RGBA);

            this.r = FlexibleValue.infer(r);
            this.g = FlexibleValue.infer(g);
            this.b = FlexibleValue.infer(b);
            this.a = FlexibleValue.infer(a);

            return Object.freeze(this);
        }

        public r: FlexibleValue;
        public g: FlexibleValue;
        public b: FlexibleValue;
        public a: FlexibleValue;
    }

    export class ColorCMYK extends Color {
        public constructor(c: FlexibleValueDecorator, m: FlexibleValueDecorator, y: FlexibleValueDecorator,
            k: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("c", c, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("m", m, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("y", y, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("k", k, [STRING, NUMBER, FlexibleValue], true, false);

            super(ColorType.CMYK);

            this.c = FlexibleValue.infer(c);
            this.m = FlexibleValue.infer(m);
            this.y = FlexibleValue.infer(y);
            this.k = FlexibleValue.infer(k);

            return Object.freeze(this);
        }

        public c: FlexibleValue;
        public m: FlexibleValue;
        public y: FlexibleValue;
        public k: FlexibleValue;
    }

    export class ColorHSL extends Color {
        public constructor(h: FlexibleValueDecorator, s: FlexibleValueDecorator, l: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("h", h, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("s", s, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("l", l, [STRING, NUMBER, FlexibleValue], true, false);

            super(ColorType.HSL);

            this.h = FlexibleValue.infer(h);
            this.s = FlexibleValue.infer(s);
            this.l = FlexibleValue.infer(l);

            return Object.freeze(this);
        }

        public h: FlexibleValue;
        public s: FlexibleValue;
        public l: FlexibleValue;
    }

    export class ColorHSV extends Color {
        public constructor(h: FlexibleValueDecorator, s: FlexibleValueDecorator, v: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("h", h, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("s", s, [STRING, NUMBER, FlexibleValue], true, false);
            Validation.RuntimeValidator.validateParameter("v", v, [STRING, NUMBER, FlexibleValue], true, false);

            super(ColorType.HSV);

            this.h = FlexibleValue.infer(h);
            this.s = FlexibleValue.infer(s);
            this.v = FlexibleValue.infer(v);

            return Object.freeze(this);
        }

        public h: FlexibleValue;
        public s: FlexibleValue;
        public v: FlexibleValue;
    }

    export class BrushList extends Collections.GenericList<Brush> {
        public static parse(str: string): BrushList {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            return null;
        }

        public toString(): string {
            return null;
        }

        public add(item: Brush): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("item", item, Brush, true);

            super.add.apply(this, ...arguments);
        }
        public addMultiple(items: Brush[]): void {
            //Run time validation
            Validation.RuntimeValidator.validateArrayParameter("items", items, Brush);

            super.addMultiple.apply(this, ...arguments);
        }
        public insert(item: Brush): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("item", item, Brush, true);

            super.insert.apply(this, ...arguments);
        }
        public insertMultiple(items: Brush[]): void {
            //Run time validation
            Validation.RuntimeValidator.validateArrayParameter("items", items, Brush);

            super.insertMultiple.apply(this, ...arguments);
        }
        public replace(oldItem: Brush, newItem: Brush): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("oldItem", oldItem, Brush, true, false);
            Validation.RuntimeValidator.validateParameter("newItem", newItem, Brush, true, false);

            super.replace.apply(this, ...arguments);
        }
        public replaceAt(index: number, newItem: Brush): Brush {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);
            Validation.RuntimeValidator.validateParameter("newItem", newItem, Brush, true, false);

            return super.replaceAt.apply(this, ...arguments);
        }
    }

    export enum BrushType { Image, LinearGradient, RadialGradient, ConicGradient }
    export namespace BrushType {
        export function parse(str: string) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

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
            //Run time validation
            Validation.RuntimeValidator.validateParameter("type", type, NUMBER, true, false);

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
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            return null;
        }

        public constructor(type: BrushType) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("type", type, NUMBER, true, false);

            this.type = type;
        }

        public type: BrushType;

        public toString(): string {
            return null;
        }
    }

    export class ImageBrush extends Brush {
        public constructor(source: string) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("source", source, STRING, true, false);

            super(BrushType.Image);

            this.source = source;

            return Object.freeze(this);
        }

        public source: string;
    }

    export abstract class GradientBrush extends Brush {

        public static parse(str: string): GradientBrush {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true, false);

            return null;
        }

        public constructor(type: BrushType, stops: GradientStop[] = []) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("type", type, NUMBER, true, false);
            Validation.RuntimeValidator.validateArrayParameter("stops", stops, GradientStop, false);

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

    export class GradientStopList extends Collections.GenericList<GradientStop> {
        public add(item: GradientStop): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("item", item, GradientStop, true);

            super.add.apply(this, ...arguments);
        }
        public addMultiple(items: GradientStop[]): void {
            //Run time validation
            Validation.RuntimeValidator.validateArrayParameter("items", items, GradientStop, false);

            super.addMultiple.apply(this, ...arguments);
        }
        public insert(item: GradientStop): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("item", item, GradientStop, true);

            super.insert.apply(this, ...arguments);
        }
        public insertMultiple(items: GradientStop[]): void {
            //Run time validation
            Validation.RuntimeValidator.validateArrayParameter("items", items, GradientStop, false);

            super.insertMultiple.apply(this, ...arguments);
        }
        public replace(oldItem: GradientStop, newItem: GradientStop): void {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("oldItem", oldItem, GradientStop, true);
            Validation.RuntimeValidator.validateParameter("newItem", newItem, GradientStop, true);

            super.replace.apply(this, ...arguments);
        }
        public replaceAt(index: number, newItem: GradientStop): GradientStop {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true);
            Validation.RuntimeValidator.validateParameter("newItem", newItem, GradientStop, true);

            return super.replaceAt.apply(this, ...arguments);
        }
    }

    export class GradientStop {
        constructor(color: Color, offset: FlexibleValueDecorator) {
            //Run time validation
            Validation.RuntimeValidator.validateParameter("color", color, Color, true);
            Validation.RuntimeValidator.validateParameter("offset", offset, [STRING, NUMBER, FlexibleValue], true);

            this.color = color;
            this.offset = FlexibleValue.infer(offset);

            return Object.freeze(this);
        }

        public color: Color;
        public offset: FlexibleValue;
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
            //Run time validation
            Validation.RuntimeValidator.validateParameter("str", str, STRING, true);

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
            //Run time validation
            Validation.RuntimeValidator.validateParameter("value", value, NUMBER, true);
            Validation.RuntimeValidator.validateParameter("unit", unit, NUMBER, true);

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