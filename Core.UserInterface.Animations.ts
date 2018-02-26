///<reference path="Core.StringUtils.ts"/>

namespace Core {
    enum AnimationTimeStampUnit { Seconds = 0, Milliseconds = 1, Percent = 2 }

    class AnimationTimeStamp {
        static private getUnitFromString(unitStr: string): AnimationTimeStampUnit {
            switch (unitStr) {
                case "s":
                    return AnimationTimeStampUnit.Seconds;
                case "ms":
                    return AnimationTimeStampUnit.Milliseconds;
                case "%":
                    return AnimationTimeStampUnit.Percent;
            }

            return null;
        }

        static fromString(timeStampStr: string) {
            let amountLastIndex = StringUtils.lastIndexOfAny(timeStampStr, "[0-9]");
        }

        constructor(value: number, unit: AnimationTimeStampUnit) {
            //Run time validation
            if (typeof value != NUMBER)
                throw new Exceptions.ParameterTypeException('value', 'number');

            this.value = value;
            this.unit = unit;
        }

        value: number;
        unit: AnimationTimeStampUnit;
    }

    class AnimationAction {
    }

    class AnimationStoryboard {
    }

    export const KEYFRAMES_FADEIN = ;

    export class Animations {
    }
    //Enables the use of simple Web Animations API animations.
    this.animation = new function () {
        var _animation = this;

        this.presetKeyframes = {
            fadeIn: { filter: ["opacity(0)", "opacity(1)"] },
            fadeOut: { filter: ["opacity(1)", "opacity(0)"] },
            bounce: {
                transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)",
                    "translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"]
            },
            grow: { transform: ["scale(.8)", "scale(1)"] },
            shrink: { transform: ["scale(1.2)", "scale(1)"] },
            flip: { transform: ["rotateX(90deg)", "rotateX(0deg)"] }
        }

        this.registerPresetKeyframes = function (name, keyframesObj) {
            //Check for duplicates
            if (core.typeCheck.isUndefined(this.presetKeyframes[name]))
                this.presetKeyframes[name] = keyframesObj;
            else {
                core.debugging.warning("Could not register keframes. The specified name is already in use.");
                return false;
            }

            return true;
        }

        this.removePresetKeyframes = function (name) {
            delete this.presetKeyframes[name];
        }

        this.AnimationProperties = function (keyframes, options) {
            this.keyframes = keyframes;
            this.options = options;
        }

        this.animate = function (elem, properties) {
            return elem.animate(properties.keyframes, properties.options);
        }
    }
}