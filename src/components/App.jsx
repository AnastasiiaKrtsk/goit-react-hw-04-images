import React, { useState, useEffect } from 'react';
import { getImages } from './services/api';
import { toast } from 'react-toastify';
import Searchbar from './Search-Bar/SearchBar';
import { ImageGallery } from './Image-Gallery/ImageGallery';
import { RotatingLines } from 'react-loader-spinner';
import Modal from './Modal/Modal';
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

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    imageURL: '',
  });
  const [page, setPage] = useState(1);
  const [showLoadMore, setShowLoadMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (searchValue.trim() === '') return;

      setLoading(true);
      setError(null);

      try {
        const response = await getImages(searchValue, page);
        const newImages = response.data.hits;
        const totalPages = Math.ceil(response.data.totalHits / 12);
        const hasMoreImages = page < totalPages;

        setImages(prevImages =>
          page === 1 ? newImages : [...prevImages, ...newImages]
        );
        setShowLoadMore(hasMoreImages);

        if (newImages.length === 0) {
          toast.warn('No photo found', toastConfig);
        }
      } catch (error) {
        setError(error.message);
        toast.error(error.message, toastConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchValue, page]);

  const handleFormSubmit = searchValue => {
    setSearchValue(searchValue);
    setImages([]);
    setPage(1);
  };

  const onOpenModal = imageURL => {
    setModal({
      isOpen: true,
      imageURL: imageURL,
    });
  };

  const onCloseModal = () => {
    setModal({
      isOpen: false,
      imageURL: '',
    });
  };

  const loadMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      {error && <p>{error}</p>}
      {loading && (
        <RotatingLines
          strokeColor="#3f51b5"
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
          onCloseModal={onCloseModal}
        />
      )}
      {images.length > 0 && (
        <>
          <ImageGallery images={images} onOpenModal={onOpenModal} />
          {showLoadMore && <Button onClick={loadMoreImages} text="Load More" />}
        </>
      )}
    </div>
  );
}

export default App;
