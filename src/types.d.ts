export declare namespace PoeResponses {
    interface trade { result: string[] }
    interface items { result: Item[] }
}

export interface Item {
    id: string;
    listing: {
        method: string; // "psapi"
        indexed: string; // "2024-05-16T17:52:29Z"
        stash: {
            name: string; // "~b/o 300 facetors",
            x: number;
            y: number;
        };
        whisper: string;
        account: {
            name: string;
            online: {
                league: string;
            };
            lastCharacterName: string,
            language: string; // "ko_KR",
            realm: string // "pc"
        },
        price: {
            type: string, // "~b/o"
            amount: number,
            currency: string
        }
    },

    item: {
        verified: boolean;
        w: number;
        h: number;
        icon: string;
        league: string;
        id: string;
        sockets: Array<{
            group: number;
            attr: string;
            sColour: string;
        }>;
        name: string;
        typeLine: string;
        baseType: string;
        rarity: string;
        ilvl: number;
        identified: boolean;
        corrupted: boolean;
        properties: Array<{
            name: string;
            values: Array<[string, number]>;
            displayMode: number;
            type: number;
        }>;
        requirements: Array<{
            name: string;
            values: Array<[string, number]>;
            displayMode: number;
            type: number;
        }>;
        implicitMods: string[];
        explicitMods: string[];
        flavourText: string[];
        replica: boolean;
        frameType: number;
        incubatedItem: {
            name: string;
            level: number;
            progress: number;
            total: number;
        };
        extended: {
            base_defence_percentile: number;
            ev: number;
            ar: number;
            mods: {
                explicit: Array<{
                    name: string;
                    tier: string;
                    level: number;
                    magnitudes: Array<{
                        hash: string;
                        min: string;
                        max: string;
                    }>;
                }>;
                implicit: Array<{
                    name: string;
                    tier: string;
                    level: number;
                    magnitudes: Array<{
                        hash: string;
                        min: string;
                        max: string;
                    }>;
                }>;
            };
            hashes: {
                explicit: Array<[string, number[]]>;
                implicit: Array<[string, number[]]>;
            };
            text: string;
        }
    }
}