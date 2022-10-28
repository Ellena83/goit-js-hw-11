import fetchImages from './js/fetchImages';
import { renderGallery } from './js/markupTemplate';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endCollectionText = document.querySelector('.end-collection-text');

let gallery = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
    evt.preventDefault();
    searchQuery = evt.currentTarget.searchQuery.value.trim();
    currentPage = 1;

    if (searchQuery === '') {
        return;
    }

    const response = await fetchImages(searchQuery, currentPage);
    currentHits = response.hits.length;

    if (response.totalHits > 40) {
        loadMoreBtn.classList.remove('is-hidden');
    } else {
        loadMoreBtn.classList.add('is-hidden');
    }

    try {
        if (response.totalHits > 0) {
            Notify.success(`Hooray! We found ${response.totalHits} images.`);
            galleryRef.innerHTML = '';
            renderGallery(response.hits, galleryRef);
            gallery.refresh();
            endCollectionText.classList.add('is-hidden');
            loadMoreBtn.classList.remove('is-hidden');

            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * -100,
                behavior: 'smooth',
            });

            // const options = {
            //     rootMargin: "0px 0px -200px 0px",
            //     treshhold: 0.5
            // };

            // function fetch() {
            //     fetchImages(searchQuery, currentPage)
            //         .then(respons => {
            //             console.log(respons.hits)

            //             renderGallery(respons.hits, galleryRef);
            //             gallery.refresh();
            //             currentHits = response.totalHits;
            //             currentPage += 1;
            //             console.log(document.querySelector('.photo-card:last-child'))
            //             observer.observe(document.querySelector('.photo-card:last-child'));
            //         }).catch(error => console.log(error))
            // }
            // fetch();
            // const observer = new IntersectionObserver(
            //     (entries, observer) => {
            //         entries.forEach(entry => {
            //             // console.log(entry)

            //             if (entry.isIntersecting) {
            //                 observer.unobserve(entry.target);
            //             }
            //             else {
            //                 fetch();

            //                 console.log(response.totalHits)
            //             }
            //         });
            //     }, options
            // );
        }
        if (response.totalHits === 0) {
            galleryRef.innerHTML = '';
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            loadMoreBtn.classList.add('is-hidden');
            endCollectionText.classList.add('is-hidden');
        }
    } catch (error) {
        console.log(error);
    }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {

    currentPage += 1;
    const response = await fetchImages(searchQuery, currentPage);
    renderGallery(response.hits, galleryRef);
    gallery.refresh();
    currentHits += response.hits.length;

    if (currentHits >= response.totalHits && 460) {
        loadMoreBtn.classList.add('is-hidden');
        endCollectionText.classList.remove('is-hidden');
    }

}