const axios = require('axios');

const Downloader = {
    Downloader(baseUri) {
        this.baseUri = baseUri;
        this.lastIndex = 0;
    },
    async next() {
        this.lastIndex++;

        const uri = () => {
            if (this.lastIndex == 1) {
                return this.baseUri;
            } else {
                return `${this.baseUri}?p=${this.lastIndex}`;
            }
        };

        const contents = await axios.get(uri);

        return {
            contents,
            index: this.lastIndex,
            uri
        };
    }
}

module.exports = Downloader;
