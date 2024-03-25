import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';


import './charList.scss';

class CharList extends Component {
    
    state = {
        charList: []
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
        .then(this.onCharListLoaded)
    }

    onCharListLoaded = (charList) => {
        this.setState({charList})
    }

    renderItems = (array) => {
        const newArr = array.map(item => {
            const {id, ...itemOptions} = item;
            return (
                <CharItem key={id} {...itemOptions}/>
            )
        })

        return newArr;
    }
    
    render() {
        const {charList} = this.state;
        const items = this.renderItems(charList)

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {items}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    }

class CharItem extends Component {
    constructor({name, thumbnail}){
        super({name, thumbnail});
        this.state = {
            name: name,
            loading: true,
            thumbnail: thumbnail
        }
    }
    render() {
        const {name, thumbnail, loading} = this.state;
        
        let imgStyle = {'objectFit': 'cover'}
        if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit': 'contain'}
        }

        const li =
            <li className="char__item">
                <img src={thumbnail} alt="abyss" style={imgStyle}/>
                <div className="char__name">{name}</div>
            </li>
        const spinner = loading ? <Spinner/> : null;    
        const content = !(name || thumbnail) ? spinner : li;
        
        console.log(thumbnail);
        return content;
    }
}


export default CharList;