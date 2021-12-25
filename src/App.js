import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: []
  }

  componentDidMount = () => {
    console.log('Inside did mount');
    BooksAPI.getAll().then(data => {
      console.log(data);
      this.setState({ books: data })
    }).catch(e => console.log(e))
  }

  changeShelf = (book, event)=> {
    event.preventDefault();
    console.log(event.target.value);
    
    BooksAPI.update(book, event.target.value).then(data => {
      console.log(data);
      this.setState({ books: data })
    }).catch(e => console.log(e)).then(()=> {
      BooksAPI.getAll().then(data => {
        console.log(data);
        this.setState({ books: data })
      })
    })
  }

  search = (event) => {
    event.preventDefault();
    BooksAPI.search(event.target.value).then(data => {
      // console.log(data);
      // this.setState({ books: data })
    })
  }

  render() {
    let currentlyReading = null;
    console.log(this.state.books);
    if (this.state.books && this.state.books.length > 0) {
      console.log(this.state.books);
      currentlyReading = this.state.books.map((book, index) => {
        return (
          <>
            <h2 className="bookshelf-title">{
              book.shelf === 'currentlyReading' ? 'Currently Reading' :
                book.shelf === 'wantToRead' ? 'Want to read' :
                  'Read'
            }</h2>
            <div className="bookshelf-books">
              <ol className="books-grid">
                <li key={index}>
                  <div className="book">
                    <div className="book-top">
                      <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                      <div className="book-shelf-changer">
                        <select onChange={(e) => this.changeShelf(book, e)}>
                          <option value="move" disabled>Move to...</option>
                          <option value="currentlyReading">Currently Reading</option>
                          <option value="wantToRead">Want to Read</option>
                          <option value="read">Read</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.authors.map(author =>
                      `${author + ', '}`)}</div>
                  </div>
                </li>
              </ol>
            </div></>)
      })
    }
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" onChange={this.search}/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">{this.state.books.length > 0 ? currentlyReading : ''
                  }</ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">


                  {this.state.books.length > 0 ? currentlyReading : ''
                  }


                </div>
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
