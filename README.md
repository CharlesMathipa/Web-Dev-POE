Always & Forever Blooms — Luxury Floral E-Commerce Website (WEDE5020 PoE)
Student Name: Neo Charles Mathipa
Student ID: ST10511987
Module: WEDE5020 / Web Development (DISD1 Group 6)
Institution: Rosebank International / Independent Institute of Education (IIE)GitHub Repository: https://github.com/CharlesMathipa/Web-Dev-POE.git

1. Project Intent & Business Objectives

Always & Forever Blooms is a luxury boutique e-commerce web application targeting floral gift buyers across metropolitan and regional zones in Gauteng, South Africa (Sandton, Pretoria East, Centurion, Midrand, and Johannesburg).
Core Objectives & Business RequirementsDirect E-Commerce Reach: Provides an accessible web platform beyond social media channels (e.g., Instagram) for customers searching on Google for local same-day flower delivery.
Transaction Processing System (TPS): Replaces risky manual EFT payments with a secure client-side transaction flow supporting Capitec Pay, 256-Bit SSL Credit/Debit Card options, and Instant EFT (Ozow) with real-time receipt generation.
Customer Personalization & Account History: Features stem-based price scaling, dynamic add-ons (Gypsophila, glass vases), anonymous card note options, user account dashboards (login.html), order tracking, and verified buyer reviews.

2. Design System & Aesthetic Architecture

The website design is built around an Apple-Inspired Liquid Glass & Rose Aesthetic using modern CSS3 design tokens:
=Petal Gradient Theme (--brand-rose, #9E1B22): Soft radial gradients (radial-gradient(circle at 10% 20%, rgba(255, 200, 220, 0.5) 0%, transparent 40%)) and deep crimson highlights symbolizing fresh rose petals.
=Stem Foundation Footer (rgba(94, 112, 96, 0.35)): Muted sage green glassmorphism footer representing the organic stem of a rose arrangement.
=Glassmorphism Components: Floating navigation bar and cards utilizing -webkit-backdrop-filter: blur(30px) saturate(210%), rounded borders (border-radius: 24px), dynamic shadow states, and translucent overlays.

3. Key Technical Features & Implementation

A. Dynamic Stem Pricing & Add-On EngineInteractive pricing scale calculating base rates from 20 to 100 stems (e.g., R 550.00 to R 1,750.00).Dynamic add-on calculations for Gypsophila (+R 200 per 20 stems) and clear glass vases (+R 150).
B. Client-Side Authentication & Order Tracking (login.html)Tabbed Sign In and Registration forms backed by JavaScript localStorage session state.Regex Validation: South African mobile number validation (/^(\+27|0)[6-8][0-9]{8}$/).Auth Guard: Requires account authentication prior to adding items to cart or initiating checkout.User Dashboard: Displays active user credentials and order tracking history with reference codes (AFB-XXXXXX).
C. Suburb Travel Rate Lookup & Google Maps API Sync (faq.html)Delivery zone algorithm classifying Gauteng Metro areas (R 120.00 rate) versus Outlying Regional areas (R 220.00 rate).Dynamic Google Maps Embed: Re-centers and updates the interactive Google Maps frame to match the searched suburb location.
D. Multi-Item Express Cart & Accordion Payment Gateway (cart.html & checkout.html)Multi-item cart array handling (afb_cart_items), badge counter updates in navigation (#cart-badge), and individual item removal.Spotify-Style Accordion Payment Interface: Radio accordion supporting Capitec Pay, Credit/Debit Card (Visa/Mastercard), Instant EFT, and Mobile Carrier Billing.Dynamic Receipt Generator (receipt.html): Generates a printable invoice payload storing order metadata, item breakdown, travel rates, and recipient details.
E. Verified Buyer Reviews & Stem-Count Filter (reviews.html)Photo review grid featuring an interactive image lightbox modal.Stem Category Filters: Filter pills (All Photos, 40 Stems, 60 Stems, 100 Stems) driven by data-filter attributes.Dynamic Review Submission: User review submission form adding customer photos, star ratings, and stem category tags.

4. Project Changelog & Version History

v2.0.0 — Final PoE Submission & TPS Optimization (Current)Added: End-to-end Transaction Processing System (TPS) supporting multi-item cart storage arrays in localStorage.
Added: Account authentication guards restricting cart additions and checkouts to verified registered users.
Added: User profile dashboard featuring live order tracking history with unique AFB-XXXXXX reference generation.
Added: Dynamic Google Maps Embed API integration on faq.html that re-centers upon searching Gauteng delivery suburbs.
Added: Interactive stem-count filter pills (data-filter) and dynamic form tagging for user-submitted reviews.
Enhanced: Spotify-style accordion payment gateway (checkout.html) supporting Capitec Pay, cards, and digital wallets.Enhanced: Open Graph (OG) meta tags and SEO optimization for Gauteng metro search ranking.
v1.5.0 — CSS Design System & Layout EnhancementAdded: Centralized style.css implementing the Apple-inspired Liquid Glass & Rose aesthetic (--brand-rose, frosted glass blur filters).
Added: Responsive CSS Grid layouts (grid-2, grid-3) ensuring cross-device compatibility across mobile phones, tablets, and desktops.
Added: Sticky glassmorphism navigation header with scroll elevation shadow transitions.v1.0.0 — Initial HTML Wireframe Structure 

(Part 1)Created: Base site hierarchy including Homepage.html, menu.html, reviews.html, faq.html, contact.html, login.html, and cart.html.
Established: Initial semantic markup, product catalogue structure, and static form elements.

5. Project File Map & Architecture

Always & Forever Blooms/
├── Homepage.html            # Main landing page with hero marquee & delivery search
├── menu.html                # Bouquet product catalogue grid
├── product=pinkroses.html   # Pink rose bouquet customization details & stem options
├── product=redroses.html    # Red rose bouquet customization details & stem options
├── product=whiteroses.html  # White rose bouquet customization details & stem options
├── reviews.html             # Customer photo gallery, review form & lightbox modal
├── faq.html                 # Delivery rate lookup, Google Maps sync & FAQ accordion
├── contact.html             # Gauteng studio locations, direct contact & mailto handler
├── login.html               # Tabbed Sign-In/Register & User Dashboard with Order History
├── cart.html                # Multi-item cart item review & recipient entry form
├── checkout.html            # Accordion payment gateway (Capitec Pay / Card / EFT)
├── receipt.html             # Dynamic printable receipt & order confirmation
├── style.css                # Master CSS3 glassmorphism design system & variables
├── script.js                # Complete modular JavaScript application logic & LocalStorage
└── README.md                # Project documentation & PoE submission specifications


6. Cross-Device Responsive Layout

StatusVerification AssetDesktop / LaptopFullscreen Monitor (1920x1080)Verified & Responsive [image-1.png] 
Mobile iPhone 16 Pro Max (Portrait)Verified & Responsive [image-2.png] TabletiPad Pro (Landscape)Verified & Responsive [image-3.png] 
Tablet iPad Pro (Portrait) Verified & Responsive [image-4.png]
Mobile iPhone 16 Pro Max (Landscape) Verified & Responsive [image-5.png]

7. Academic References

Bootstrap Icons, 2026. Bootstrap Icons Library.
[online] Available at: https://icons.getbootstrap.com/ [Accessed October 2026].CSS-Tricks, 2026. Complete Guide to Flexbox & CSS Grid. 
[online] Available at: https://css-tricks.com [Accessed September 2026].Fireship, 2026. JavaScript DOM Manipulation & Web Storage API. [online video] Available at: https://www.youtube.com/@Fireship [Accessed September 2026].Google Developers, 2026a. Google Maps Embed API Documentation. 
[online] Available at: https://developers.google.com/maps [Accessed October 2026].Google, 2026b. web.dev Performance & Responsive Design Guidelines.
[online] Available at: https://web.dev [Accessed September 2026].MDN Web Docs, 2026. Window.localStorage & Event Handling in Web API.
[online] Available at: https://developer.mozilla.org [Accessed October 2026].Powell, K., 2026. Building Modern Glassmorphism & Layouts. 
[online video] Available at: https://www.youtube.com/@KevinPowell [Accessed September 2026].Tech2 etc, 2021. Build and Deploy Ecommerce Website With HTML CSS JavaScript. 
[online video] Available at: https://www.youtube.com/watch?v=P8YuWEkTeuE [Accessed September 2026].Traversy Media, 2026. Vanilla JavaScript E-Commerce Cart Logic. [online video] Available at: https://www.youtube.com/@TraversyMedia [Accessed October 2026].W3Schools, 2026. HTML5 Form Attributes & Input Validations. 
[online] Available at: https://www.w3schools.com [Accessed September 2026].Wooldridge, G., 2025. Recreate the iOS 26 Liquid Glass effect with HTML/CSS only. [online video] Available at: https://www.youtube.com/shorts/BDpR3loGIFQ [Accessed September 2026].
