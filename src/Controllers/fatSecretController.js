const axios = require("axios");
const getAccessToken = require("../utils/fatsecret");

const searchFoods = async (req, res) => {
    try {
        const token = await getAccessToken();
        const { q } = req.query;

        const response = await axios.get("https://platform.fatsecret.com/rest/server.api", {
            params: {
                method: "foods.search",
                search_expression: q,
                format: "json"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const foods = response.data.foods?.food || [];
        res.json(foods);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to search foods", error: err.message });
    }
};

const getFoodInfo = async (req, res) => {
    try {
        const token = await getAccessToken();
        const { food_id } = req.query;

        const response = await axios.get("https://platform.fatsecret.com/rest/server.api", {
            params: {
                method: "food.get.v2",
                food_id,
                format: "json"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch food info", error: err.message });
    }
};

module.exports = {
    searchFoods,
    getFoodInfo
};
