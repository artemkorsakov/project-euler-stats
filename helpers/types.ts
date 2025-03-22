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

    static fromObject(obj: any): AccountData {
        return new AccountData(
            obj.account,
            obj.alias,
            obj.location,
            obj.language
        );
    }
}

/**
 * Represents progress data parsed from HTML.
 */
export class ProgressData {
    constructor(
        public level: string,
        public solved: number,
        public percentage: number,
        public progress: string,
        public toTheNext: string
    ) {}

    static fromObject(obj: any): ProgressData {
        return new ProgressData(
            obj.level,
            obj.solved,
            obj.percentage,
            obj.progress,
            obj.toTheNext
        );
    }
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

    static fromObject(obj: any): RatingData {
        return new RatingData(
            obj.place,
            obj.top100,
            obj.top50,
            obj.top25,
            obj.top10,
            obj.top5,
            obj.top1
        );
    }
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

    static fromObject(obj: any): LevelData {
        return new LevelData(
            obj.level,
            obj.members
        );
    }
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

    static fromObject(obj: any): AwardBlockData {
        return new AwardBlockData(
            obj.name,
            obj.awards.map((award: any) => AwardData.fromObject(award))
        );
    }

    /**
     * Calculates the number of completed awards in this block.
     * @returns The number of completed awards.
     */
    getCompletedCount(): number {
        return this.awards.filter(award => award.isCompleted).length;
    }
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
     * @param percentage - A number representing the percentage of completion.
     * @param members - A string representing the members associated with this award.
     */
    constructor(
        public award: string,
        public link: string,
        public description: string,
        public isCompleted: boolean,
        public progress: string,
        public percentage: number,
        public members: string
    ) {}

    static fromObject(obj: any): AwardData {
        return new AwardData(
            obj.award,
            obj.link,
            obj.description,
            obj.isCompleted,
            obj.progress,
            obj.percentage,
            obj.members
        );
    }
}

export class FriendData {
	constructor(
		public rank: string,
		public username: string,
		public solved: number,
		public level: number,
		public awards: number
	) {}

    static fromObject(obj: any): FriendData {
        return new FriendData(
            obj.rank,
            obj.username,
            obj.solved,
            obj.level,
            obj.awards
        );
    }
}

export class CacheData {
	constructor(
		public accountData: AccountData,
        public progressData: ProgressData,
        public euleriansPlace: string,
        public locationUrl: string,
        public languageUrl: string,
        public locationRating: RatingData,
        public languageRating: RatingData,
        public levelDataArray: LevelData[],
        public awardsData: AwardBlockData[],
        public friends: FriendData[]
	) {}

    static fromObject(obj: any): CacheData {
        return new CacheData(
            AccountData.fromObject(obj.accountData),
            ProgressData.fromObject(obj.progressData),
            obj.euleriansPlace,
            obj.locationUrl,
            obj.languageUrl,
            RatingData.fromObject(obj.locationRating),
            RatingData.fromObject(obj.languageRating),
            obj.levelDataArray.map((level: any) => LevelData.fromObject(level)),
            obj.awardsData.map((awardBlock: any) => AwardBlockData.fromObject(awardBlock)),
            obj.friends.map((friend: any) => FriendData.fromObject(friend))
        );
    }
}

export class Source {
	constructor(
        public tasks: PersonalTask[],
	) {}
}

export class PersonalTask {
    constructor(
        public task: string,
        public percentage: number
    ) {}
}
