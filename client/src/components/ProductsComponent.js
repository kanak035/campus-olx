import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Loading from './LoadingComponent';

class Products extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const productsCards = this.props.products.map(product => {
      console.log({ product });

      // Ensure product fields are safe
      if (!product.owner) product.owner = {};
      if (!product.images) product.images = [];
      if (!product.description) product.description = '';

      // Check favorites safely
      let favorite = false;
      if (
        this.props.favorites &&
        this.props.favorites.products &&
        Array.isArray(this.props.favorites.products)
      ) {
        favorite = this.props.favorites.products.some(
          p => p && p._id === product._id
        );
      }

      // Check if logged-in user is the owner
      const isOwner =
        this.props.user &&
        this.props.user.userinfo &&
        this.props.user.userinfo._id &&
        product.owner &&
        product.owner._id &&
        this.props.user.userinfo._id === product.owner._id;

      return (
        <div className="col-12 col-md-4" key={product._id || Math.random()}>
          <Card className="mt-2 mb-2">
            <CardImg
              top
              width="100%"
              height="200"
              src={
                product.images[0]
                  ? 'https://iiitm-marketplace.s3.eu-north-1.amazonaws.com/' +
                    product.images[0].slice(22)
                  : ''
              }
              onMouseOver={e => {
                if (product.images[1]) {
                  e.currentTarget.src =
                    'https://iiitm-marketplace.s3.eu-north-1.amazonaws.com/' +
                    product.images[1].slice(22);
                }
              }}
              onMouseOut={e => {
                if (product.images[0]) {
                  e.currentTarget.src =
                    'https://iiitm-marketplace.s3.eu-north-1.amazonaws.com/' +
                    product.images[0].slice(22);
                }
              }}
            />

            <CardBody className="text-black">
              <CardTitle className="text-danger">
                <b>
                  {product.name} &nbsp;
                  {this.props.user && this.props.user.userinfo ? (
                    favorite ? (
                      <span
                        className="fa fa-heart Option"
                        onClick={() =>
                          alert('Already favorite')
                        }
                      ></span>
                    ) : (
                      <span
                        className="fa fa-heart-o Option"
                        onClick={() => this.props.postFavorite(product._id)}
                      ></span>
                    )
                  ) : (
                    <React.Fragment />
                  )}
                  &nbsp; &nbsp;
                  {isOwner ? (
                    <React.Fragment>
                      <span
                        onClick={() => {
                          this.props.changeSelected(product._id);
                          this.props.toggleEditModal();
                        }}
                        className="Option fa fa-pencil"
                      />
                      &nbsp; &nbsp;
                      <span
                        onClick={() => {
                          this.props.changeSelected(product._id);
                          this.props.toggleDeleteModal();
                        }}
                        className="Option fa fa-trash"
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                </b>
              </CardTitle>

              <CardSubtitle className="text-success">
                <b>
                  {product.bid ? (
                    <React.Fragment>
                      Bidding range : <span>&#8377;</span> {product.price} -{' '}
                      {product.max_bid}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span>&#8377;</span> {product.price}
                    </React.Fragment>
                  )}
                </b>
              </CardSubtitle>

              <CardText>
                {product.description.length > 100
                  ? product.description.slice(0, 100) + '....'
                  : product.description}
              </CardText>

              <CardLink
                tag={Link}
                to={'/products/' + product._id}
                className="text-center"
              >
                <Button className="button btn-block" color="info">
                  <i className="fa fa-eye fa-lg" /> &nbsp;View details
                </Button>
              </CardLink>
            </CardBody>
          </Card>
        </div>
      );
    });

    return (
      <div className="container full">
        <div className="heading row row-content white-text justify-content-center">
          <div className="col-12">
            <h3 align="center">{this.props.title}</h3>
          </div>
          {this.props.products.length === 1 ? (
            this.props.productsLoading ? (
              <Loading />
            ) : this.props.productsErrMess ? (
              <h3>{this.props.productsErrMess}</h3>
            ) : (
              productsCards
            )
          ) : this.props.productsLoading ? (
            <Loading />
          ) : this.props.productsErrMess ? (
            <h3>{this.props.productsErrMess}</h3>
          ) : this.props.products.length === 0 ? (
            <div className="justify-content-center">
              <br />
              <br />
              <br />
              <br />
              <h5 align="center">There are no products in this list.</h5>
            </div>
          ) : (
            productsCards
          )}
        </div>
      </div>
    );
  }
}

export default Products;
