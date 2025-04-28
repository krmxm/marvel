class MarvelService {
    _apiBase = `https://marvel-server-zeta.vercel.app/`;
    _apiKey = `apikey=d4eecb0c66dedbfae4eab45d312fc1df`;
    _baseOffset = 210;
    _totalCharacters = 0;
    _baseLimit = 9;

    getResource = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset, limit = this._baseLimit) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=${limit}&offset=${offset}&${this._apiKey}`); // возвращается promise
        this._totalCharacters = res.data.total;
        return res.data.results.map(this._transformCharacterList);
    }

    getCharacter = async (id) => { // возвращается промис
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); // возвращается promise, и результат записывается в переменную
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacterList = (char) => {
        return {
            id: char.id,
            name: char.name,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
        }
    }

    _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description ? char.description.length > 210 ? char.description.slice(0, 210) + '...' : char.description : 'No description',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
    
}

export default MarvelService;