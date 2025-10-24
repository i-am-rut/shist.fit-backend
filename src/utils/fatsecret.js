const axios = require("axios");
require("dotenv").config();

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
    const now = new Date();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const clientId = process.env.FAT_SECRET_CLIENT_ID;
    const clientSecret = process.env.FAT_SECRET_CLIENT_SECRET;
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await axios.post("https://oauth.fatsecret.com/connect/token", 
        "grant_type=client_credentials", 
        {
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = new Date(now.getTime() + response.data.expires_in * 1000);

    return cachedToken;
};
module.exports = getAccessToken;
