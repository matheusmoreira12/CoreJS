namespace Core.Animations {
    enum TimeStampUnit { Milliseconds, Seconds, Minutes, Hours, Percent }

    class TimeStamp {
        private static _parseUnit(unitStr: string): TimeStampUnit {
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

        static parse(str: string) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("timeStampStr", str, STRING, true, false);

            let valueStr = str.match(/^\d+/);

            if (valueStr === null)
                throw new Exceptions.InvalidOperationException("Cannot parse time stamp. Value is missing.");

            let value = Number(valueStr),
                unitStr = str.substring(valueStr.length),
                unit = this._parseUnit(unitStr);

            if (unit === null)
                throw new Exceptions.InvalidOperationException("Cannor parse time stamp. Invalid or missing unit.");

            return new TimeStamp(value, unit);
        }

        constructor(value: number, unit: TimeStampUnit) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter('value', value, NUMBER, true, false);

            this.value = value;
            this.unit = unit;
        }

        value: number;
        unit: TimeStampUnit;
    }

    class AnimationScene {
        time: TimeStamp;
    }

    class AnimationSceneList extends Collections.Generic.List<AnimationScene> {
        add(scene: AnimationScene) {
            Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);

            super.add(scene);
        }
        insert(index: number, scene: AnimationScene) {
            Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            super.insert(index, scene);
        }
        removeAt(index: number): AnimationScene {
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            return super.removeAt(index);
        }
        remove(scene: AnimationScene) {
            Validation.RuntimeValidator.validateParameter("scene", scene, AnimationScene, true, false);

            super.remove(scene);
        }
    }

    class AnimationStoryboard {
        constructor(...scenes: AnimationScene[]) {
            this.scenes = new AnimationSceneList(scenes);
        }

        scenes: AnimationSceneList;

        toKeyframes(): Object {
            return null;
        }
    }

    export const KEYFRAMES_FADEIN = { filter: ["opacity(0)", "opacity(1)"] };
    export const KEYFRAMES_FADEOUT = { filter: ["opacity(1)", "opacity(0)"] };
    export const KEYFRAMES_BOUNCE = {
        transform: ["translate(0, 0)", "translate(10%, 0)", "translate(-10%, 0)",
            "translate(10%, 0)", "translate(-10%, 0)", "translate(0, 0)"]
    };
    export const KEYFRAMES_GROW = { transform: ["scale(.8)", "scale(1)"] };
    export const KEYFRAMES_SHRINK = { transform: ["scale(1.2)", "scale(1)"] };
    export const KEYFRAMES_FLIP = { transform: ["rotateX(90deg)", "rotateX(0deg)"] };
}