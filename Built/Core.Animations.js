///<reference path="Core.Collections.Generic.ts"/>
var Core;
(function (Core) {
    var Animations;
    (function (Animations) {
        let TimeStampUnit;
        (function (TimeStampUnit) {
            TimeStampUnit[TimeStampUnit["Milliseconds"] = 0] = "Milliseconds";
            TimeStampUnit[TimeStampUnit["Seconds"] = 1] = "Seconds";
            TimeStampUnit[TimeStampUnit["Minutes"] = 2] = "Minutes";
            TimeStampUnit[TimeStampUnit["Hours"] = 3] = "Hours";
            TimeStampUnit[TimeStampUnit["Percent"] = 4] = "Percent";
        })(TimeStampUnit || (TimeStampUnit = {}));
        class TimeStamp {
            static _parseUnit(unitStr) {
                switch (unitStr) {
                    case "h":
                        return TimeStampUnit.Hours;
                    case "min":
                        return TimeStampUnit.Minutes;
                    case "s":
                        return TimeStampUnit.Seconds;
                    case "ms":
                        return TimeStampUnit.Milliseconds;
                    case "%":
                        return TimeStampUnit.Percent;
                }
                return null;
            }
            static parse(str) {
                let valueStr = str.match(/^\d+/);
                if (valueStr === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannot parse time stamp. Value is missing.");
                let value = Number(valueStr), unitStr = str.substring(valueStr.length), unit = this._parseUnit(unitStr);
                if (unit === null)
                    throw new Core.Exceptions.InvalidOperationException("Cannor parse time stamp. Invalid or missing unit.");
                return new TimeStamp(value, unit);
            }
            constructor(value, unit) {
                this.value = value;
                this.unit = unit;
            }
        }
        class AnimationScene {
        }
        class AnimationSceneList extends Core.Collections.Generic.List {
        }
        class AnimationStoryboard {
            constructor(...scenes) {
                this.scenes = new AnimationSceneList(scenes);
            }
            toKeyframes() {
                return null;
            }
        }
        Animations.KEYFRAMES_FADEIN = { filter: ["opacity(0)", "opacity(1)"] };
        Animations.KEYFRAMES_FADEOUT = { filter: ["opacity(1)", "opacity(0)"] };
        Animations.KEYFRAMES_BOUNCE = {
            transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)",
                "translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"]
        };
        Animations.KEYFRAMES_GROW = { transform: ["scale(.8)", "scale(1)"] };
        Animations.KEYFRAMES_SHRINK = { transform: ["scale(1.2)", "scale(1)"] };
        Animations.KEYFRAMES_FLIP = { transform: ["rotateX(90deg)", "rotateX(0deg)"] };
    })(Animations = Core.Animations || (Core.Animations = {}));
})(Core || (Core = {}));
//# sourceMappingURL=Core.Animations.js.map