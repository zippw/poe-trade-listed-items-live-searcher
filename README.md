### Setup Instructions

Before getting started, configure the `config.json` file as follows:

```json
{
    "trades": "", /* List of trade IDs (not exchange IDs). You can find these in the URL of a Path of Exile trade search, e.g., "https://www.pathofexile.com/trade/search/Standard/YdZgp1RIY". Extract the trade ID like "12fghdRdj" or "YdZgp1RIY". 
                  Multiple IDs can be entered separated by a comma and a space, e.g., "12fghdRdj, YdZgp1RIY, 34qweRtYH". */
    "bot_token": "", // Your Telegram bot token goes here.
    "chat": 12345678910, // Your chat ID.
    "show_first_items_info": 8 // Recommended value is 8. This sets the number of items displayed in the message. Set to 0 if you prefer not to display prices.
}
```

### Requirements and Usage

1. Install Node.js version 18.20.0 or higher.
2. Run the following commands:
   ```bash
   npm i
   npm run build
   node dist/index.js
   ```
