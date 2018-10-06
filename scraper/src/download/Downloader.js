const axios = require('axios');

module.exports = {
    async get(uri) {
        const response = await axios.get(uri);

        return {
            contents: response.data,
            uri
        };
    }
};
