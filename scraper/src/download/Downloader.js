const axios = require('axios');

module.exports = {
    get(uri) {
        const response = await axios.get(uri);

        return {
            contents: response.data,
            uri
        };
    }
};
