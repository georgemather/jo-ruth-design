# jo-ruth-design
This is an incomplete version of a bespoke portfolio website for Jo Ruth.

## Intended Functionality
It was meant to have a straightforward grid-based landing and fulfil four basic functions:

1. Display various categorised artwork galleries with details of the individual artwork - but using CSS background-image to discourage direct downloads. [Done]
2. Provide a separate layout for the design and illustration portfolios - these being much more varied. The individual clients were to be divided into slider.js-esque vertical sliding pages with unique copy and sample images.
3. 'News' section to pull feed from Instagram API (due to be phased out mid-2020)
4. Contact form with simple ReCaptcha which would also display the last-viewed artwork. 

The website was also intended to preload all images (script written) and maintain a one-page no-reload design which would animate transitions between sections. 

## Current State
As it stands, half of the end-user-facing stuff is done for all devices and would be ready for integration with, say, Wordpress or another CMS. This includes:

1. The landing, which is entirely CSS-based and responsive (markup in LESS). Features a fixed header. All aspects listed here have been built mobile-first (from iPhone 5S upwards) and work comprehensively across browsers.
2. The categorised galleries - these are done and feature heavy jQuery to position the artwork images as their aspect ratios vary. 
    * The main image, like the header, is position:fixed so that the main scrollbar for the page only affects the thumbnails. 
    * In portrait orientations the gallery thumbnails move below the main image rather than beside. 
    * jQuery is also used to align the currently selected image with the center of the main image. 
    * Image details are retrieved via AJAX call to PHP script which currently just feeds back JSON of an artwork object from a preset array; this looks forward to integration with eventual CMS.
    * Features a lightweight custom lightbox for fullscreen previews (minimal animation).
    * Current bugs include realigning the selected thumbnail on mobile rotation and iOS Safari auto-hiding of the URL bar which can affect the size of the main image on first load. 
3. The portfolios were meant to replicate the functionality of slider.js and then in each separate compartment show details of a separate client commission. The current layout suggested by the category.html page was one idea and could be easily replaced.

There are multiple js and css files for the project, and jQuery `$(document).ready()` gets called multiple times. This is largely because the sections were developed separately and were intended to be subsequently integrated, but inevitably this generates clashes and redundancies.

## Work that remained
1. To complete the portfolio view pages styles and js
2. To style the news page
3. To style the contact form
2. To insert the preloader (from a different client's website; currently not included in the repository)
3. To decide on exactly how to animate transitions between dynamic pages
4. To integrate the front-end with a Wordpress backend or other CMS. The aim was to include:
    *An easy batch-upload system which would allow the client to choose square sections of uploaded images to crop.
    *This would feature fields for artwork materials, dimensions, and so on. 
