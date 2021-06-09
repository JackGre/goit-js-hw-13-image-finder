const basicLightbox = require("basiclightbox");
import galleryTemplate from "../src/templates/gallery_template.hbs";
const debounce = require("lodash.debounce");
//import {notice, alert} from "../../node_modules/@pnotify/core/dist/PNotify.js";

const gallery = document.querySelector('.gallery');
const input = document.querySelector('.input');


let page = 0;

const options = {
    root: null,
    threshold: 0.9,
};

const observer = new IntersectionObserver(onScroll, options);

gallery.addEventListener('click', imgClick);

input.addEventListener("input", debounce(createMarkup, 500));

function createMarkup() {
    const valueInput = input.value;

    if(valueInput.length === 0) {
        gallery.innerHTML = "";
        observer.unobserve(document.querySelector('.observer-trigger'));
        return;
    }

    gallery.innerHTML = "";
    page = 1;
    onFetchHandlers(valueInput, page);

    observer.observe(document.querySelector(".observer-trigger"));
}

function addGallery(result) {
    gallery.insertAdjacentHTML("beforeend", galleryTemplate(result))
}

function imgClick (event) {
    if (event.target.nodeName !== "IMG") {
        return;}
    const instance = basicLightbox.create(`<img src="${event.target.dataset.large}" alt="${event.target.alt}">`);

    instance.show();
}

function onScroll() {
    const valueInput = input.value;
    page += 1;
    onFetchHandlers(valueInput, page);
  }

async function onFetchHandlers (valueInput, page) {
    try {
        const imegesGet = await picsFetch(valueInput, page);
        addGallery(imegesGet);
        // if (imegesGet.hits.length === 0) {
        //     const noticeMy = alert({
        //         text: "No more images to fetch",
        //         delay: 2000,
        //         addClass: "warning-notice", 
        //     });
        //     observer.unobserve(document.querySelector(".observer-trigger"));
        //     return;
        // }
    } catch (error) {    
        console.log("Ошибка!")
    }
}

async function picsFetch (valueInput, page) {
    
      const root = "https://pixabay.com/api/";
      const mainParams = "image_type=photo&orientation=horizontal";
      const collection = 12;
      const key = "21995991-528c5e3d565cee7c57bbf1d7b";
    
  
    const url = `${root}?${mainParams}&q=${valueInput}&page=${page}&per_page=${collection}&key=${key}`;
  
    
    const response = await fetch(url);
    const data = await response.json();
  
    return data;
  };



