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

/**
 * Represents data for a specific level.
 */
export class LevelData {
    /**
     * Creates an instance of LevelData.
     * @param level - The level identifier (e.g., level number or name).
     * @param members - A string representing the members associated with this level.
     */
    constructor(
        public level: string,
        public members: string
    ) {}
}

/**
 * Represents a block of awards associated with a specific name.
 */
export class AwardBlockData {
    /**
     * Creates an instance of AwardBlockData.
     * @param name - The name associated with the award block.
     * @param awards - An array of AwardData representing the awards in this block.
     */
    constructor(
        public name: string,
        public awards: AwardData[]
    ) {}
}

/**
 * Represents data for a specific award.
 */
export class AwardData {
    /**
     * Creates an instance of AwardData.
     * @param award - The name of the award.
     * @param link - A URL link associated with the award.
     * @param description - A description of the award.
     * @param isCompleted - A boolean indicating whether the award has been completed.
     * @param progress - A string representing the progress associated with the award.
     * @param members - A string representing the members associated with this award.
     */
    constructor(
        public award: string,
        public link: string,
        public description: string,
        public isCompleted: boolean,
        public progress: string,
        public members: string
    ) {}
}

export class FriendData {
	constructor(
		public rank: string,
		public username: string,
		public solved: number,
		public level: number,
		public awards: number
	) {}
}
