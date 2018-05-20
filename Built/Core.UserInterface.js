///<reference path="Core.UserInterface.Colors.ts"/>
var Core;
(function (Core) {
    var UserInterface;
    (function (UserInterface) {
        let ContentType;
        (function (ContentType) {
            ContentType[ContentType["Text"] = 0] = "Text";
            ContentType[ContentType["HTML"] = 1] = "HTML";
        })(ContentType = UserInterface.ContentType || (UserInterface.ContentType = {}));
        class Content {
            constructor(value, type = ContentType.Text) {
                type = type;
                this.type = type;
                this.value = value;
                return Object.freeze(this);
            }
        }
        UserInterface.Content = Content;
        class Percentage extends Number {
            static parse(str) {
                const PERCENTAGE_REGEX = /^(?<number>\d+?)%/;
                if (PERCENTAGE_REGEX.test(str))
                    return null;
                let exec = PERCENTAGE_REGEX.exec(str), numberStr = exec["groups"]["number"];
                return super.parseFloat(numberStr);
            }
            toString() {
                return `${super.toString.call(this)}%`;
            }
        }
        UserInterface.Percentage = Percentage;
        let ColorType;
        (function (ColorType) {
            ColorType[ColorType["RGB"] = 0] = "RGB";
            ColorType[ColorType["RGBA"] = 1] = "RGBA";
            ColorType[ColorType["CMYK"] = 2] = "CMYK";
            ColorType[ColorType["HSL"] = 3] = "HSL";
            ColorType[ColorType["HSV"] = 4] = "HSV";
        })(ColorType = UserInterface.ColorType || (UserInterface.ColorType = {}));
        const COLOR_RGB_MAX_INT_VALUE = (1 << 24) - 1;
        const COLOR_RGB_INT_FIELD_MASK = (1 << 8) - 1;
        class Color {
            constructor(type) {
                this.type = type;
            }
            static fromInt(value) {
                if (!Number.isInteger(value))
                    throw new Core.Exceptions.ArgumentException("value", "Parameter is not a valid integer value.");
                if (value < 0 || value > COLOR_RGB_MAX_INT_VALUE)
                    throw new Core.Exceptions.ArgumentOutOfRangeException("value");
                let r = (value >>> 16) & COLOR_RGB_INT_FIELD_MASK, g = (value >>> 8) & COLOR_RGB_INT_FIELD_MASK, b = value & COLOR_RGB_INT_FIELD_MASK;
                return new ColorRGB(r.toString(), g.toString(), b.toString());
            }
            static parse(str) {
                let colorFromName = null;
                if (str.startsWith("#")) {
                    let hexCode = str.substring(-6);
                    return this.fromInt(Number(hexCode));
                }
                return UserInterface.Colors.fromName(str) || ColorRGB.parse(str) || ColorRGBA.parse(str) || ColorCMYK.parse(str) ||
                    ColorHSL.parse(str) || ColorHSV.parse(str) || null;
            }
        }
        UserInterface.Color = Color;
        class ColorRGB extends Color {
            constructor(r, g, b) {
                super(ColorType.RGB);
                this.r = Percentage.parse(r) || Number(r);
                this.g = Percentage.parse(g) || Number(g);
                this.b = Percentage.parse(b) || Number(b);
                return Object.freeze(this);
            }
            toString() {
                return null;
            }
        }
        UserInterface.ColorRGB = ColorRGB;
        class ColorRGBA extends Color {
            constructor(r, g, b, a) {
                super(ColorType.RGBA);
                this.r = Percentage.parse(r) || Number(r);
                this.g = Percentage.parse(g) || Number(g);
                this.b = Percentage.parse(b) || Number(b);
                this.a = Percentage.parse(a) || Number(a);
                return Object.freeze(this);
            }
            static parse(str) {
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.ColorRGBA = ColorRGBA;
        class ColorCMYK extends Color {
            constructor(c, m, y, k) {
                super(ColorType.CMYK);
                this.c = Percentage.parse(c) || Number(c);
                this.m = Percentage.parse(m) || Number(m);
                this.y = Percentage.parse(y) || Number(y);
                this.k = Percentage.parse(k) || Number(k);
                return Object.freeze(this);
            }
            toString() {
                return null;
            }
        }
        UserInterface.ColorCMYK = ColorCMYK;
        class ColorHSL extends Color {
            constructor(h, s, l) {
                super(ColorType.HSL);
                this.h = Percentage.parse(h) || Number(h);
                this.s = Percentage.parse(s) || Number(s);
                this.l = Percentage.parse(l) || Number(l);
                return Object.freeze(this);
            }
            toString() {
                return null;
            }
        }
        UserInterface.ColorHSL = ColorHSL;
        class ColorHSV extends Color {
            constructor(h, s, v) {
                super(ColorType.HSV);
                this.h = Percentage.parse(h) || Number(h);
                this.s = Percentage.parse(s) || Number(s);
                this.v = Percentage.parse(v) || Number(v);
                return Object.freeze(this);
            }
            toString() {
                return null;
            }
        }
        UserInterface.ColorHSV = ColorHSV;
        class BrushList extends Core.Collections.Generic.List {
        }
        UserInterface.BrushList = BrushList;
        let BrushType;
        (function (BrushType) {
            BrushType[BrushType["Image"] = 0] = "Image";
            BrushType[BrushType["LinearGradient"] = 1] = "LinearGradient";
            BrushType[BrushType["RadialGradient"] = 2] = "RadialGradient";
            BrushType[BrushType["ConicGradient"] = 3] = "ConicGradient";
        })(BrushType = UserInterface.BrushType || (UserInterface.BrushType = {}));
        (function (BrushType) {
            function parse(str) {
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
            BrushType.parse = parse;
            function toString(type) {
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
            BrushType.toString = toString;
        })(BrushType = UserInterface.BrushType || (UserInterface.BrushType = {}));
        class Brush {
            constructor(type) {
                this.type = type;
            }
            static parse(str) {
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.Brush = Brush;
        class ImageBrush extends Brush {
            constructor(source) {
                super(BrushType.Image);
                this.source = source;
                return Object.freeze(this);
            }
        }
        UserInterface.ImageBrush = ImageBrush;
        class GradientBrush extends Brush {
            constructor(type, stops = []) {
                super(type);
                this.stops = new GradientStopList(stops);
            }
            static parse(str) {
                return null;
            }
            toString() {
                return null;
            }
        }
        UserInterface.GradientBrush = GradientBrush;
        class LinearGradientBrush extends GradientBrush {
            constructor(stops) {
                super(BrushType.LinearGradient, stops);
            }
        }
        UserInterface.LinearGradientBrush = LinearGradientBrush;
        class RadialGradientBrush extends GradientBrush {
            constructor(stops) {
                super(BrushType.RadialGradient, stops);
            }
        }
        UserInterface.RadialGradientBrush = RadialGradientBrush;
        class ConicGradientBrush extends GradientBrush {
            constructor(stops = []) {
                super(BrushType.ConicGradient, stops);
            }
        }
        UserInterface.ConicGradientBrush = ConicGradientBrush;
        class GradientStopList extends Core.Collections.Generic.List {
        }
        UserInterface.GradientStopList = GradientStopList;
        class GradientStop {
            constructor(color, offset) {
                this.color = color;
                this.offset = Percentage.parse(offset);
                return Object.freeze(this);
            }
        }
        UserInterface.GradientStop = GradientStop;
        let LengthUnit;
        (function (LengthUnit) {
            LengthUnit[LengthUnit["Number"] = 0] = "Number";
            LengthUnit[LengthUnit["Pixels"] = 1] = "Pixels";
            LengthUnit[LengthUnit["Percent"] = 2] = "Percent";
            LengthUnit[LengthUnit["Inches"] = 3] = "Inches";
            LengthUnit[LengthUnit["Millimeters"] = 4] = "Millimeters";
            LengthUnit[LengthUnit["Centimeters"] = 5] = "Centimeters";
            LengthUnit[LengthUnit["Points"] = 6] = "Points";
            LengthUnit[LengthUnit["Picas"] = 7] = "Picas";
            LengthUnit[LengthUnit["Em"] = 8] = "Em";
            LengthUnit[LengthUnit["Ex"] = 9] = "Ex";
        })(LengthUnit = UserInterface.LengthUnit || (UserInterface.LengthUnit = {}));
        (function (LengthUnit) {
            const STR_CONVERSION_MAP = [
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
            function parse(str) {
                let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][0];
            }
            LengthUnit.parse = parse;
            function toString(style) {
                let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][1];
            }
            LengthUnit.toString = toString;
        })(LengthUnit = UserInterface.LengthUnit || (UserInterface.LengthUnit = {}));
        class Length {
            constructor(value, unit) {
                this.value = value;
                this.unit = unit;
                return Object.freeze(this);
            }
            static getZero() {
                return new Length(0, LengthUnit.Number);
            }
            static parse(str) {
                //Find value in string
                let valueStr = Core.StringUtils.matchString(str, /^\d+/);
                if (valueStr === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse length. Missing value.");
                let value = Number(valueStr), //Parse value
                unitStr = str.substring(valueStr.length), //Get unit substring
                unit = LengthUnit.parse(unitStr); //Parse unit
                if (unit === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse length. Invalid unit.");
                if (isNaN(value))
                    throw new Error("Cannot parse length. Value is not a number.");
                return new Length(value, unit);
            }
            toString() {
                return String(this.value) + LengthUnit.toString(this.unit);
            }
        }
        UserInterface.Length = Length;
        let BorderStyle;
        (function (BorderStyle) {
            BorderStyle[BorderStyle["Hidden"] = 0] = "Hidden";
            BorderStyle[BorderStyle["Dotted"] = 1] = "Dotted";
            BorderStyle[BorderStyle["Dashed"] = 2] = "Dashed";
            BorderStyle[BorderStyle["Solid"] = 3] = "Solid";
            BorderStyle[BorderStyle["Double"] = 4] = "Double";
            BorderStyle[BorderStyle["Groove"] = 5] = "Groove";
            BorderStyle[BorderStyle["Ridge"] = 6] = "Ridge";
            BorderStyle[BorderStyle["Inset"] = 7] = "Inset";
            BorderStyle[BorderStyle["Inherit"] = 8] = "Inherit";
            BorderStyle[BorderStyle["Unset"] = 9] = "Unset";
        })(BorderStyle = UserInterface.BorderStyle || (UserInterface.BorderStyle = {}));
        (function (BorderStyle) {
            const STR_CONVERSION_MAP = [
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
            function parse(str) {
                let matches = STR_CONVERSION_MAP.filter(item => item[1] == str);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][0];
            }
            BorderStyle.parse = parse;
            function toString(style) {
                let matches = STR_CONVERSION_MAP.filter(item => item[0] == style);
                if (matches.length == 0)
                    return null;
                else
                    return matches[0][1];
            }
            BorderStyle.toString = toString;
        })(BorderStyle = UserInterface.BorderStyle || (UserInterface.BorderStyle = {}));
    })(UserInterface = Core.UserInterface || (Core.UserInterface = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.UserInterface.js.map