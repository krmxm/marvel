import { Component } from 'react';
import PropTypes from 'prop-types';


import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';


import './charList.scss';

class CharList extends Component {
    
    state = {
        charList: [],
        loading: true,
        error: false,
        newCharLoading: false,
        offset: 1,
        charEnded: false,
        endPage: false,
        limit: 9
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        if(localStorage.getItem('limit')) { // если уже есть localstorage
            let storage = JSON.parse(localStorage.getItem('limit'));
            this.onRequest(this.state.offset, storage); // запрос с прошлым отступом от offset
            this.setState(({offset, limit}) => ({
                offset: (offset - limit) + storage
            }))
        } else {
            this.onRequest();
        }

        

        window.addEventListener('scroll', this.onCheckEndPage);
        window.addEventListener('scroll', this.onCharListLoadByScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onCheckEndPage);
        window.removeEventListener('scroll', this.onCharListLoadByScroll);
    }

    onCheckEndPage = () => {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.offsetHeight) {
            this.setState({
                endPage: true
            })
        }
    }

    onCharListLoadByScroll = () => {
        const {newCharLoading, charEnded, endPage, offset} = this.state;
        if(!newCharLoading && !charEnded && endPage) {
            this.onCharListLoading();
            this.onRequest(offset)
        }
    }

    onRequest = (offset, limit) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset, limit)
        .then(this.onCharListLoaded)
        .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newCharLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = this.marvelService._totalCharacters - this.state.offset <= 9;

        if(this.state.limit !== 9) {
            localStorage.setItem('limit', JSON.stringify(this.state.limit)) // если не первая заргузка страницы, то storage обновляется на новое значение
        }

        this.setState(({offset, charList, limit}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newCharLoading: false,
            offset: offset + 9,
            charEnded: ended,
            endPage: false,
            limit: limit + 9
        }))
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
                <CharItem key={id} id={id} {...itemOptions} onClick={this.props.onSelectedChar}/>
            )
        })


        return (
            <ul className='char__grid'>
                    {newArr}
            </ul>
        );
    }
    
    render() {
        const {charList, loading, error, newCharLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charList);

        const spinner = loading ? <Spinner/> : null;
        const erroeMessage = error ? <ErrorMessage/> : null; 
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {spinner}
                {erroeMessage}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newCharLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{"display": charEnded ? 'none' : 'block'}}>
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

CharList.propType = {
    onSelectedChar: PropTypes.func
}


export default CharList;