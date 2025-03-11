/**
 * Represents account data parsed from HTML.
 */
export class AccountData {
    constructor(
        public account: string,
        public alias: string,
        public location: string,
        public language: string
    ) {}
}

/**
 * Represents progress data parsed from HTML.
 */
export class ProgressData {
    constructor(
        public level: string,
        public solved: number,
        public progress: string,
        public toTheNext: string
    ) {}
}

/**
 * Represents rating data parsed from HTML.
 */
export class RatingData {
    constructor(
        public place: number,
        public top100: number,
        public top50: number,
        public top25: number,
        public top10: number,
        public top5: number,
        public top1: number
    ) {}
}

export class LevelData {
    constructor(
        public level: string,
        public members: string
    ) {}
}
