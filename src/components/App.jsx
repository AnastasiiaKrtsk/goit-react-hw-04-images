import { Component } from 'react';
import { Searchbar } from './Search-Bar/SearchBar';
import { ImageGallery } from './Image-Gallery/ImageGallery';
import { getImages } from './services/api';
import { RotatingLines } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { Modal } from './Modal/Modal';
import { Button } from './Button/Button';

const toastConfig = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export class App extends Component {
  state = {
    searchValue: '',
    images: [],
    loading: false,
    error: null,
    modal: {
      isOpen: false,
      imageURL: '',
    },
    page: 1,
    showLoadMore: true,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { searchValue, page } = this.state;

    if (
      (prevState.searchValue !== searchValue || prevState.page !== page) &&
      searchValue.trim() !== ''
    ) {
      this.setState({
        loading: true,
        error: null,
      });

      try {
        const response = await getImages(searchValue, page);

        const images = response.data.hits;
        const totalPages = Math.ceil(response.data.totalHits / 12);
        const hasMoreImages = page < totalPages;

        if (prevState.searchValue !== searchValue) {
          this.setState({
            images,
            showLoadMore: hasMoreImages,
          });
        } else {
          this.setState(prevState => ({
            images: [...prevState.images, ...images],
            showLoadMore: hasMoreImages,
          }));
        }

        if (images.length === 0) {
          toast.warn('No photo found', toastConfig);
        }
      } catch (error) {
        this.setState({ error: error.message });
        toast.error(error.message, toastConfig);
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  handleFormSubmit = searchValue => {
    this.setState({ searchValue });
  };

  onOpenModal = imageURL => {
    this.setState({
      modal: {
        isOpen: true,
        imageURL: imageURL,
      },
    });
  };

  onCloseModal = () => {
    this.setState({
      modal: {
        isOpen: false,
        imageURL: '',
      },
    });
  };

  loadMoreImages = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { images, loading, error, modal, showLoadMore } = this.state;
    return (
      <div>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {error && <p>{error}</p>}
        {loading && (
          <RotatingLines
            strokeColor=" #3f51b5"
            strokeWidth={5}
            animationDuration={0.75}
            width={96}
            visible={true}
          />
        )}
        {modal.isOpen && (
          <Modal
            isOpen={modal.isOpen}
            imageURL={modal.imageURL}
            onCloseModal={this.onCloseModal}
          />
        )}
        {images.length > 0 && (
          <>
            <ImageGallery images={images} onOpenModal={this.onOpenModal} />
            {showLoadMore && (
              <Button onClick={this.loadMoreImages} text="Load More" />
            )}
          </>
        )}
      </div>
    );
  }
}
