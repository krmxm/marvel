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
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    handleItemClick = (id) => {
        console.log(id);
    }

    renderItems = (array) => {
        const newArr = array.map(item => {
            const {id, ...itemOptions} = item;
            return (
                <CharItem key={id} id={id} {...itemOptions} onClick={this.handleItemClick}/>
            )
        })


        return (
            <ul className='char__grid'>
                    {newArr}
            </ul>
        );
    }
    
    render() {
        const {charList, loading, error} = this.state;

        const items = this.renderItems(charList);

        const spinner = loading ? <Spinner/> : null;
        const erroeMessage = error ? <ErrorMessage/> : null; 
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {spinner}
                {erroeMessage}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    }

const CharItem = ({name, thumbnail, onClick, id}) =>  {
    
    let imgStyle = {'objectFit': 'cover'}
    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }

    const handleClick = () => {
        onClick(id);
    }

    const li =
        <li className="char__item" onClick={handleClick}>
            <img src={thumbnail} alt="abyss" style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>
    return li;
    
}


export default CharList;