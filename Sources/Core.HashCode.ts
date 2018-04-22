namespace Core.HashCode {
    export function fromString(str: string): number {
        let outHashCode = 0;

        if (str.length === 0)
            return outHashCode;

        for (let i = 0; i < str.length; i++) {
            let chr = str.charCodeAt(i);

            outHashCode = ((outHashCode << 5) - outHashCode) + chr;
        }

        return outHashCode;
    }

    export function concatenate(hashCodes: Iterable<number>): number {
        let outHashCode = 17;

        for (let hashCode of hashCodes)
            outHashCode = ((outHashCode << 5) - outHashCode) + hashCode;

        return outHashCode;
    }
}