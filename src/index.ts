import type { Item } from "./types.d.ts";

import { CronJob } from 'cron';
import config from '../config.json';

const job = new CronJob(
    '0 */5 * * * *',
    async () => {
        console.log(new Date().toLocaleTimeString('ru'));
        main();

    }, null, true
);

class Trade {
    tradeId: string;
    last: string[] = [];

    constructor(tradeId: string) {
        this.tradeId = tradeId;
    }

    f(): Promise<string[]> {
        return new Promise(async (resolve) => {
            let trade = await fetch(`https://www.pathofexile.com/api/trade/search/Standard/${this.tradeId}`, {
                method: "POST",
                headers: { "content-type": "application/json" }
            });

            console.log(trade.status, `fetching trade ${this.tradeId}`);

            if (trade.ok) {
                const { result } = await trade.json() as { result: string[] };
                resolve(result)
            } else {
                console.log(await trade.text());
                resolve([]);
            }
        })
    }
}

const parsedCfgTrades: string[] = config.trades.split(', ');
let trades = parsedCfgTrades.map(id => new Trade(id));
let newItems: Record<string, string[]> = parsedCfgTrades.reduce((obj, id) => ({ ...obj, [id]: [] }), {});

// every 5 min
const main = async () => {
    const fetchedTrades = await Promise.all(trades.map(x => x.f()));

    for (let i = 0; i < trades.length; i++) {
        newItems[trades[i].tradeId].push(...fetchedTrades[i].filter(id => !trades[i].last.includes(id)));
        fetchedTrades.forEach(ids => trades[i].last = [...new Set(trades[i].last.concat(...ids))]);
    }

    let txt: string = `New items found!`;
    let totalLen: number = 0;
    for (const [tradeId, itemIds] of Object.entries(newItems)) {
        if (itemIds.length) {
            txt += `\n\n${itemIds.length} from <code>${tradeId}</code>`;

            if (config.show_first_items_info > 0) {
                txt += "\n" + itemIds
                    .slice(0, config.show_first_items_info)
                    .map((id, i) => `${i + 1} - <item:${id}>`)
                    .join('\n') + (itemIds.length > config.show_first_items_info ? '\n...' : '');
            }

            newItems[tradeId] = [];
            totalLen++;
        }
    }

    const regexp = new RegExp('<item:([^>]+)>', 'g');
    if (config.show_first_items_info > 0) {
        const itemsToReplace = txt.matchAll(regexp);
        if (itemsToReplace) {
            const ids = [...itemsToReplace].map(m => m[1]);
            const details = await fetchItemsBulk(ids);

            ids.forEach((id, i) => txt = txt.replace(`<item:${id}>`, () => {
                const item = details[i];
                if (!item) return `N/A`;
                return `${item.listing.price.amount} ${item.listing.price.currency}`;
            }));
        }
    } else txt = txt.replace(regexp, '');

    if (totalLen > 0) {
        const tg = await fetch(`https://api.telegram.org/bot${config.bot_token}/sendMessage?chat_id=${config.chat}&parse_mode=HTML&text=${encodeURIComponent(txt)}`);
        console.log(tg.status, `fetching telegram`);
        totalLen = 0;
    }
}

const MAX_ITEMS_PER_FETCH = 10;
const fetchItemsBulk = async (ids: string[]) => {
    let res: (null | Item)[] = [];
    for (let start = 0; start < ids.length; start += MAX_ITEMS_PER_FETCH) {
        const idsToFetch = ids.slice(start, start + 10);
        let items = await fetch(`https://www.pathofexile.com/api/trade/fetch/${idsToFetch.join(',')}`);
        console.log(items.status, `fetching ${idsToFetch.length} / ${MAX_ITEMS_PER_FETCH} items`);

        if (items.ok) {
            const { result } = await items.json() as { result: Item[] };
            result.forEach(item => res.push(item));
        } else res.push(...new Array(idsToFetch.length).fill(null));
    }

    return res;
}

main()