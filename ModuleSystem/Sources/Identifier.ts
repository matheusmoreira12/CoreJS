namespace Core.ModuleSystem {

    export class Identifier extends Array<string> {
        public static get MEMBER_VALIDATION_PATTERN() { return /^[a-zA-Z]\w*?$/; }

        public static * getCommonMembers(identifier1: Identifier, identifier2: Identifier): IterableIterator<string> {
            for (let i = 0; i < identifier1.length && i < identifier2.length; i++) {
                let member1 = identifier1[i];
                let member2 = identifier2[i];

                if (member1 !== member2)
                    break;

                yield member1;
            }
        }

        public static getCommonIdentifier(identifier1: Identifier, identifier2: Identifier) {
            let commonMembers = Array.from(this.getCommonMembers(identifier1, identifier2));

            return new Identifier(commonMembers);
        }

        public static validateMember(member: string): boolean {
            if (typeof member != "string")
                throw new ReferenceError(`${member} is not a valid string.`);

            return this.MEMBER_VALIDATION_PATTERN.test(member);
        }

        public static validateMultiple(members: string[]): boolean {
            for (let member of members)
                if (!this.validateMember(member))
                    return false;

            return true;
        }

        public static getMembersFromString(identifierStr: string): string[] {
            let members = identifierStr.split(".");

            if (!Identifier.validateMultiple(members))
                throw new Error("Cannot push requested members. All items must be valid.");

            return members;
        }

        constructor(members: string[]);
        constructor(identifierStr: string);
        constructor(arg0: string | string[]) {
            if (typeof arg0 === "string") {
                let members = Identifier.getMembersFromString(arg0); //Get individual members
                super(...members);
            }
            else if (arg0 instanceof Array) {
                super(...arg0);
            }
            else
                throw new ReferenceError(`Invalid value for argument "arg0". ${arg0} is not a valid string or Array.`);
        }

        public toString(): string {
            return this.join(".");
        }

        public push(...items: string[]): number {
            //Validate items
            if (Identifier.validateMultiple(items))
                throw new Error("Cannot push requested members. All items must be valid.");

            return super.push(...items);
        }

        public splice(start: number, deleteCount: number, ...items: string[]): string[] {
            //Validate items
            if (Identifier.validateMultiple(items))
                throw new Error("Cannot insert the requested members. All items must be valid.");

            return super.splice(start, deleteCount, ...items);
        }

        public fill(value: string, start?: number, end?: number): this {
            if (!Identifier.validateMember(value))
                throw new Error("Cannot fill. The provided member is invalid.")

            return super.fill(value, start, end);
        }

        public concat(identifier: Identifier): Identifier {
            return new Identifier([...this, ...identifier]);
        }
    }
}