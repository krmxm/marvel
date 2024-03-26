import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';


import './charList.scss';

class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({charList})
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems = (array) => {
        const newArr = array.map(item => {
            const {id, ...itemOptions} = item;
            return (
                <CharItem key={id} {...itemOptions}/>
            )
        })

        this.setState({
            charList: array,
            loading: false
        })

        return newArr;
    }
    
    render() {
        const {charList, loading, error} = this.state;
        const spinner = loading ? <Spinner/> : null;
        const erroeMessage = error ? <ErrorMessage/> : null; 
        const items = !(loading || error) ? this.renderItems(charList) : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {spinner}
                    {erroeMessage}
                    {items}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    }

const CharItem = ({name, thumbnail}) =>  {
    
    let imgStyle = {'objectFit': 'cover'}
        if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit': 'contain'}
        }

    const li =
        <li className="char__item">
            <img src={thumbnail} alt="abyss" style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>
    return li;
    
}


export default CharList;