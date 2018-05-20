/// <reference path="Core.UserInterface.Colors.d.ts" />
declare namespace Core.UserInterface {
    enum ContentType {
        Text = 0,
        HTML = 1,
    }
    class Content {
        constructor(value: string, type?: ContentType);
        value: string;
        type: ContentType;
    }
    class Percentage extends Number {
        static parse(str: string): number;
        toString(): string;
    }
    enum ColorType {
        RGB = 0,
        RGBA = 1,
        CMYK = 2,
        HSL = 3,
        HSV = 4,
    }
    abstract class Color {
        static fromInt(value: number): ColorRGB;
        static parse(str: string): Color;
        constructor(type: ColorType);
        abstract toString(): string;
        type: ColorType;
    }
    class ColorRGB extends Color {
        constructor(r: string | number, g: string | number, b: string | number);
        r: Number;
        g: Number;
        b: Number;
        toString(): string;
    }
    class ColorRGBA extends Color {
        static parse(str: string): any;
        constructor(r: string | number, g: string | number, b: string | number, a: string | number);
        r: Number;
        g: Number;
        b: Number;
        a: Number;
        toString(): string;
    }
    class ColorCMYK extends Color {
        constructor(c: string | number, m: string | number, y: string | number, k: string | number);
        c: Number;
        m: Number;
        y: Number;
        k: Number;
        toString(): string;
    }
    class ColorHSL extends Color {
        constructor(h: string | number, s: string | number, l: string | number);
        h: Number;
        s: Number;
        l: Number;
        toString(): string;
    }
    class ColorHSV extends Color {
        constructor(h: string | number, s: string | number, v: string | number);
        h: Number;
        s: Number;
        v: Number;
        toString(): string;
    }
    class BrushList extends Collections.Generic.List<Brush> {
    }
    enum BrushType {
        Image = 0,
        LinearGradient = 1,
        RadialGradient = 2,
        ConicGradient = 3,
    }
    namespace BrushType {
        function parse(str: string): BrushType.Image | BrushType.LinearGradient;
        function toString(type: BrushType): "url" | "linear-gradient" | "radial-gradient" | "conic-gradient";
    }
    abstract class Brush {
        static parse(str: string): Brush;
        constructor(type: BrushType);
        type: BrushType;
        toString(): string;
    }
    class ImageBrush extends Brush {
        constructor(source: string);
        source: string;
    }
    abstract class GradientBrush extends Brush {
        static parse(str: string): GradientBrush;
        constructor(type: BrushType, stops?: GradientStop[]);
        toString(): string;
        stops: GradientStopList;
    }
    class LinearGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class RadialGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class ConicGradientBrush extends GradientBrush {
        constructor(stops?: GradientStop[]);
    }
    class GradientStopList extends Collections.Generic.List<GradientStop> {
    }
    class GradientStop {
        constructor(color: Color, offset: string);
        color: Color;
        offset: Number;
    }
    enum LengthUnit {
        Number = 0,
        Pixels = 1,
        Percent = 2,
        Inches = 3,
        Millimeters = 4,
        Centimeters = 5,
        Points = 6,
        Picas = 7,
        Em = 8,
        Ex = 9,
    }
    namespace LengthUnit {
        function parse(str: string): LengthUnit;
        function toString(style: LengthUnit): string;
    }
    class Length {
        static getZero(): Length;
        static parse(str: string): Length;
        constructor(value: number, unit: LengthUnit);
        toString(): string;
        value: number;
        unit: LengthUnit;
    }
    enum BorderStyle {
        Hidden = 0,
        Dotted = 1,
        Dashed = 2,
        Solid = 3,
        Double = 4,
        Groove = 5,
        Ridge = 6,
        Inset = 7,
        Inherit = 8,
        Unset = 9,
    }
    namespace BorderStyle {
        function parse(str: string): BorderStyle;
        function toString(style: BorderStyle): string;
    }
}
