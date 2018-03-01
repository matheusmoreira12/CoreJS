



namespace Core {
    enum AnimationTimeStampUnit { Seconds = 0, Milliseconds = 1, Percent = 2 }

    class AnimationTimeStamp {
        private static getUnitFromString(unitStr: string): AnimationTimeStampUnit {
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
            //Runtime validation
            Validation.RuntimeValidator.validateParameter("timeStampStr", timeStampStr, STRING, true, false);

            let amountLastIndex = StringUtils.lastIndexOfAny(timeStampStr, StringUtils.toCharRange("[0-9]"));
        }

        constructor(value: number, unit: AnimationTimeStampUnit) {
            //Runtime validation
            Validation.RuntimeValidator.validateParameter('value', value, NUMBER, true, false);

            this.value = value;
            this.unit = unit;
        }

        value: number;
        unit: AnimationTimeStampUnit;
    }

    class AnimationAction {
    }

    class AnimationActionCollection extends Collections.GenericCollection<AnimationAction> {
        add(action: AnimationAction) {
            Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);

            super.add(action);
        }
        insert(action: AnimationAction, index: number) {
            Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            super.insert(action, index);
        }
        removeAt(index: number): AnimationAction {
            Validation.RuntimeValidator.validateParameter("index", index, NUMBER, true, false);

            return super.removeAt(index);
        }
        remove(action: AnimationAction) {
            Validation.RuntimeValidator.validateParameter("action", action, AnimationAction, true, false);

            super.remove(action);
        }
    }

    class AnimationStoryboard {
        constructor(...actions: AnimationAction[]) {
            this.actions = new AnimationActionCollection(actions);
        }

        actions: AnimationActionCollection;

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