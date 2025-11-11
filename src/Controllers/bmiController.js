const axios = require('axios')

const getBMI = async (req, res) => {
  try {
    const weight = parseFloat(req.query.weight);
    const height = parseFloat(req.query.height);

    if (
      isNaN(weight) ||
      isNaN(height) ||
      weight <= 0 ||
      height <= 0
    ) {
      return res.status(400).json({ message: 'Please provide valid numeric values for weight and height greater than 0.' });
    }

    const bmiOptions = {
      method: 'GET',
      url: 'https://body-mass-index-bmi-calculator.p.rapidapi.com/metric',
      params: { weight, height },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'body-mass-index-bmi-calculator.p.rapidapi.com'
      }
    };

    const bmiResponse = await axios.request(bmiOptions);
    if (!bmiResponse?.data?.bmi) {
      return res.status(500).json({ message: 'Failed to calculate BMI from the API.' });
    }

    const bmiValue = Number(bmiResponse.data.bmi.toFixed(2));

    const categoryOptions = {
      method: 'GET',
      url: 'https://body-mass-index-bmi-calculator.p.rapidapi.com/weight-category',
      params: { bmi: bmiValue },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'body-mass-index-bmi-calculator.p.rapidapi.com'
      }
    };

    const categoryResponse = await axios.request(categoryOptions);
    if (!categoryResponse?.data?.weightCategory) {
      return res.status(500).json({ message: 'Failed to fetch weight category from the API.' });
    }

    const result = {
      bmi: bmiValue,
      weight,
      height,
      weightCategory: categoryResponse.data.weightCategory
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in getBMI:', error.message || error);
    return res.status(500).json({
      message: 'An unexpected error occurred while calculating BMI.',
      error: error.response?.data || error.message
    });
  }
};

module.exports = getBMI;
