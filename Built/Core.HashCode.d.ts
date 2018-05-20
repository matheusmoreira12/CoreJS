declare namespace Core.HashCode {
    function fromString(str: string): number;
    function concatenate(hashCodes: Iterable<number>): number;
}
