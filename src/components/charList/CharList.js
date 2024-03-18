import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

const CharList = () => {
    const marvelService = new MarvelService();

    onMountList = (array) => {
        const newArr = array.map(item => {
            const {id, ...itemOptions} = item;
            return (
                <charItem key={id} {...itemOptions}/>
            )
        })

        return newArr;
    }

    updateListChars = () => {
        this.marvelService
        .getAllCharacters()
        .then(onMountList)
    }
    return (
        <div className="char__list">
            <ul className="char__grid">
            updateListChars()
            </ul>
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const charItem = ({name, thumbnail}) => {
    return (
        <li className="char__item">
                    <img src={thumbnail} alt="abyss"/>
                    <div className="char__name">{name}</div>
        </li>
    )
}


export default CharList;