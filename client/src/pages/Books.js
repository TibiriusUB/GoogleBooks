import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Button from "../components/Button";
import { BookList, BookListItem } from "../components/BookList";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input } from "../components/Form";

class Books extends Component {
  state = {
    book: [],
    bookSearch: "",
    books: [],
    title: "",
    authors: [],
    href: "",
    description: "",
    thunbnail: ""
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", description: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  saveBook = () => {
    if (this.state.title && this.state.author) {
      // console.log(this.state.author)
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        description: this.state.description,
        image: this.state.thumbnail,
        link: this.state.href
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        description: this.state.description,
        href: this.state.href,
        thumbnail: this.state.thumbnail
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err));
    }
  };


  handleFormSubmit2 = event => {
    // When the form is submitted, prevent its default behavior, get books update the books state
    event.preventDefault();
    API.getBookSearch(this.state.bookSearch)
      .then(res => this.setState({ book: res.data, bookSearch: "" }))
      .catch(err => console.log(err));
  };

  handleFormSubmit3 = event => {
    event.preventDefault();
    API.getBookSearch(event.target.id)
      .then(res => {this.setState({ 
        title: res.data[0].volumeInfo.title,
        author: (res.data[0].volumeInfo.authors).toString(),
        description: res.data[0].volumeInfo.description,
        href: res.data[0].volumeInfo.infoLink,
        thumbnail: res.data[0].volumeInfo.imageLinks.thumbnail
       });
       this.saveBook()
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Container fluid>
          <Row>
            <Col size="lg-12">
              <form>
                <Container>
                  <Row>
                    <Col size="xs-9 sm-10">
                      <Input
                        name="bookSearch"
                        value={this.state.bookSearch}
                        onChange={this.handleInputChange}
                        placeholder="Search For a Book"
                      />
                    </Col>
                    <Col size="xs-3 sm-2">
                      <Button
                        onClick={this.handleFormSubmit2}
                        type="success"
                        className="input-lg"
                      >
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </form>
            </Col>
          </Row>
          <Row>
            <Col size="md-6">
            <Jumbotron>
              <h1>What Should I Read?</h1>
            </Jumbotron>
              {!this.state.book.length ? (
                <h3 className="text-center">No Books to Display,{this.state.book}</h3>
              ) : (
                  <BookList>
                    {this.state.book.map(listing => {
                      return (
                        <div key={listing.id}>
                          <BookListItem
                           // key={listing.id}
                            title={listing.volumeInfo.title}
                            authors={listing.volumeInfo.authors}
                            href={listing.volumeInfo.infoLink}
                            description={listing.volumeInfo.description}
                            thumbnail={listing.volumeInfo.imageLinks?listing.volumeInfo.imageLinks.thumbnail:"https://books.google.com/googlebooks/images/no_cover_thumb.gif"}
                          />
                          <Button 
                          onClick={this.handleFormSubmit3}
                          type="success"
                          className="input-lg"
                          id={listing.id}
                          >
                            Save to Database
                          </Button>
                        </div>
                      );
                    })}
                  </BookList>
                )}
            </Col>
         
          {/* <Col size="md-6">
            {/* <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title (required)"
              />
              <Input
                value={this.state.author}
                onChange={this.handleInputChange}
                name="author"
                placeholder="Author (required)"
              />
              <TextArea
                value={this.state.description}
                onChange={this.handleInputChange}
                name="description"
                placeholder="Synopsis (Optional)"
              />
              <FormBtn
                disabled={!(this.state.author && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form> */}
         {/* </Col> */}
        
          <Col size="md-6">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <Link to={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
