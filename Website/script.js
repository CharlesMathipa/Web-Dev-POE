/* 
   ALWAYS & FOREVER BLOOMS - COMPLETE FUNCTIONALITY (PART 3)
   */

document.addEventListener("DOMContentLoaded", () => {

  /*
     1. DYNAMIC SHOPPING CART & STEM PRICING CALCULATION
    */
  const productForm = document.querySelector("form[action='cart.html']");
  if (productForm) {
    const stemRadios = productForm.querySelectorAll("input[name='stem_count']");
    const gypCheckbox = productForm.querySelector("input[name='addon_gyp']");
    const vaseCheckbox = productForm.querySelector("input[name='addon_vase']");
    const priceDisplay = document.querySelector(".product-price") || document.querySelector("h2[style*='color']");

    const calculatePrice = () => {
      let basePrice = 550;
      let selectedStems = 20;

      stemRadios.forEach(radio => {
        if (radio.checked) {
          selectedStems = parseInt(radio.value);
          // Pricing scale based on stem count
          basePrice = 550 + ((selectedStems - 20) / 20) * 300;
        }
      });

      if (gypCheckbox && gypCheckbox.checked) {
        basePrice += (selectedStems / 20) * 200;
      }
      if (vaseCheckbox && vaseCheckbox.checked) {
        basePrice += 150;
      }

      if (priceDisplay) {
        priceDisplay.textContent = `R ${basePrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
      }
    };

    stemRadios.forEach(r => r.addEventListener("change", calculatePrice));
    if (gypCheckbox) gypCheckbox.addEventListener("change", calculatePrice);
    if (vaseCheckbox) vaseCheckbox.addEventListener("change", calculatePrice);
  }

  /* 
     2. DYNAMIC CONTENT FILTERING (Menu & Reviews)
     */
  const filterPills = document.querySelectorAll(".filter-pill");
  const reviewArticles = document.querySelectorAll(".grid-2 article, .grid-3 article");

  filterPills.forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const category = pill.getAttribute("href").replace("#", "").toLowerCase();

      reviewArticles.forEach(article => {
        const text = article.textContent.toLowerCase();
        if (category === "all" || text.includes(category.replace("-", " "))) {
          article.style.display = "block";
        } else {
          article.style.display = "none";
        }
      });
    });
  });

  /* 
     3. DYNAMIC SUBURB & DELIVERY FEE LOOKUP (FAQ & Homepage)
  */
  const suburbForms = document.querySelectorAll("form[action='faq.html'], form[action='faq.html?']");
  suburbForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='text']");
      if (!input || !input.value.trim()) return;

      const query = input.value.trim().toLowerCase();
      const metros = ["sandton", "pretoria", "centurion", "midrand", "johannesburg", "rosebank", "mamelodi", "hatfield"];
      const isMetro = metros.some(m => query.includes(m));

      let resultBox = form.querySelector(".lookup-result");
      if (!resultBox) {
        resultBox = document.createElement("div");
        resultBox.className = "lookup-result";
        resultBox.style.cssText = "margin-top: 15px; padding: 14px 18px; border-radius: 14px; font-size: 14px;";
        form.appendChild(resultBox);
      }

      if (isMetro) {
        resultBox.style.background = "rgba(94, 112, 96, 0.2)";
        resultBox.style.color = "#1f1f23";
        resultBox.innerHTML = `<strong>✓ Metro Zone Confirmed:</strong> Same-day delivery fee for <em>"${input.value}"</em> is <strong>R 120.00</strong>.`;
      } else {
        resultBox.style.background = "rgba(158, 27, 34, 0.1)";
        resultBox.style.color = "#9E1B22";
        resultBox.innerHTML = `<strong>ℹ Outlying Regional Zone:</strong> Special courier rate for <em>"${input.value}"</em> is <strong>R 220.00</strong>.`;
      }
    });
  });

  /* 
     4. CONTACT FORM EMAIL COMPILATION (Mailto Handler)
   */
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector("#contact-name").value;
      const email = contactForm.querySelector("#contact-email").value;
      const subjectType = contactForm.querySelector("#contact-subject").value;
      const message = contactForm.querySelector("#contact-message").value;

      const mailtoLink = `mailto:support@alwaysforeverblooms.co.za?subject=${encodeURIComponent(subjectType + " - " + name)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      window.location.href = mailtoLink;
    });
  }

  /*
     5. IMAGE LIGHTBOX FOR REVIEWS GALLERY
  */
  const galleryImgs = document.querySelectorAll(".grid-2 article img, .grid-3 article img");
  if (galleryImgs.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.style.cssText = "display:none; position:fixed; z-index:9999; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); justify-content:center; align-items:center; cursor:pointer;";
    
    const lightboxImg = document.createElement("img");
    lightboxImg.style.cssText = "max-width:90%; max-height:85vh; border-radius:16px; object-fit:contain;";
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    galleryImgs.forEach(img => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.style.display = "flex";
      });
    });

    lightbox.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  }

  /*
   6. DYNAMIC CUSTOMER REVIEW SUBMISSION BLOCKS
   */
const reviewForm = document.querySelector("#review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop page from reloading

    const nameInput = document.querySelector("#reviewer-name");
    const ratingSelect = document.querySelector("#rating");
    const fileInput = document.querySelector("#photo-upload");
    const textInput = document.querySelector("#review-text");

    const name = nameInput.value.trim();
    const ratingNum = parseInt(ratingSelect.value);
    const reviewText = textInput.value.trim();

    const stars = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);

    let imageUrl = "images/pinkroses.jpeg";
    if (fileInput.files && fileInput.files[0]) {
      imageUrl = URL.createObjectURL(fileInput.files[0]); 
    }

    // Finds the Target Review Container
    const reviewContainer = document.querySelector("section.grid-2");

    if (reviewContainer) {
      //Creates the New Review Article Card
      const newCard = document.createElement("article");
      newCard.className = "review-card";

      newCard.innerHTML = `
        <div class="review-card-content">
          <img src="${imageUrl}" alt="Customer Uploaded Photo" class="review-img">
          
          <div class="review-details">
            <h3><span class="stars">${stars}</span> "${reviewText.substring(0, 30)}..."</h3>
            <p class="review-quote"><em>"${reviewText}"</em></p>
            <p class="reviewer-info"><strong>- ${name}</strong> (Verified Buyer)</p>
            <a href="menu.html" class="button review-btn">Order From Menu</a>
          </div>
        </div>
      `;

      //this prepends New Review to the Top of the Gallery
      reviewContainer.prepend(newCard);

      //this re-attaches the lightbox Click Listener to the new image
      const newImg = newCard.querySelector("img");
      if (newImg && typeof setupLightbox === "function") {
        setupLightbox(newImg);
      }

      //This resets the form & shows Success Feedback
      reviewForm.reset();
      alert("Thank you! Your review and photo have been posted successfully.");
    }
  });
}

/*
   INTERACTIVE USER AUTHENTICATION & DASHBOARD 
  */
const tabSignIn = document.querySelector("#tab-signin");
const tabRegister = document.querySelector("#tab-register");
const signInForm = document.querySelector("#signin-form");
const registerForm = document.querySelector("#register-form");
const authMsg = document.querySelector("#auth-msg");

const userDashboard = document.querySelector("#user-dashboard");
const authContainer = document.querySelector("#auth-container");
const logoutBtn = document.querySelector("#logout-btn");

function showAuthMsg(text, isError = false) {
  if (!authMsg) return;
  authMsg.style.display = "block";
  authMsg.style.background = isError ? "rgba(158, 27, 34, 0.15)" : "rgba(94, 112, 96, 0.2)";
  authMsg.style.color = isError ? "#9E1B22" : "#1f1f23";
  authMsg.style.border = isError ? "1px solid rgba(158, 27, 34, 0.3)" : "1px solid rgba(94, 112, 96, 0.4)";
  authMsg.innerHTML = text;
}

if (tabSignIn && tabRegister) {
  tabSignIn.addEventListener("click", () => {
    tabSignIn.classList.add("active-tab");
    tabRegister.classList.remove("active-tab");
    signInForm.style.display = "block";
    registerForm.style.display = "none";
    authMsg.style.display = "none";
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active-tab");
    tabSignIn.classList.remove("active-tab");
    registerForm.style.display = "block";
    signInForm.style.display = "none";
    authMsg.style.display = "none";
  });
}

//Check Login Status
function checkUserSession() {
  const activeUser = JSON.parse(localStorage.getItem("afb_active_user"));
  
  if (activeUser && userDashboard && authContainer) {
    authContainer.style.display = "none";
    userDashboard.style.display = "block";
    
    document.querySelector("#dashboard-user-name").textContent = activeUser.name;
    document.querySelector("#dashboard-user-email").textContent = activeUser.email;
    document.querySelector("#dashboard-user-phone").textContent = activeUser.phone;
  }
}
checkUserSession();

//Register Account
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.querySelector("#reg-name").value.trim();
    const email = document.querySelector("#reg-email").value.trim().toLowerCase();
    const phone = document.querySelector("#reg-phone").value.trim();
    const password = document.querySelector("#reg-password").value;

    const saPhoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!saPhoneRegex.test(phone)) {
      showAuthMsg("Please enter a valid SA mobile number (e.g. 0610667057).", true);
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("afb_users") || "[]");
    
    if (existingUsers.some(u => u.email === email)) {
      showAuthMsg("An account with this email already exists. Please sign in.", true);
      return;
    }

    // Save User
    const newUser = { name, email, phone, password };
    existingUsers.push(newUser);
    localStorage.setItem("afb_users", JSON.stringify(existingUsers));
    
    localStorage.setItem("afb_active_user", JSON.stringify(newUser));
    showAuthMsg("✓ Account created successfully! Logging you in...", false);

    setTimeout(() => {
      checkUserSession();
    }, 1000);
  });
}

//Sign In
if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#signin-email").value.trim().toLowerCase();
    const password = document.querySelector("#signin-password").value;

    const existingUsers = JSON.parse(localStorage.getItem("afb_users") || "[]");
    const matchedUser = existingUsers.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      localStorage.setItem("afb_active_user", JSON.stringify(matchedUser));
      showAuthMsg("✓ Sign in successful! Redirecting...", false);
      setTimeout(() => {
        checkUserSession();
      }, 800);
    } else {
      showAuthMsg("Invalid email or password. Please try again or create a new account.", true);
    }
  });
}

//Sign Out
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("afb_active_user");
    userDashboard.style.display = "none";
    authContainer.style.display = "block";
    authMsg.style.display = "none";
  });
}

/*
     CHECKOUT PAGE FUNCTIONALITY & PAYMENT ACCORDION
 */
  const checkoutSummarySection = document.querySelector("#checkout-summary");
  const checkoutForm = document.querySelector("#payment-form");

  if (checkoutSummarySection) {
    //Load Cart & Delivery Data into Summary Box
    const cartItem = JSON.parse(localStorage.getItem("afb_cart_item")) || {
      title: "Pink Rose Bouquet (40 Stems)",
      amount: 850.00,
      deliveryDate: "2026-02-14"
    };

    const deliveryDetails = JSON.parse(localStorage.getItem("afb_delivery_details")) || {
      recipientName: "Valued Customer",
      recipientAddress: "Gauteng Metro Area"
    };

    const deliveryFee = 120.00;
    const totalPayment = cartItem.amount + deliveryFee;

    checkoutSummarySection.innerHTML = `
      <h2>Final Payment Summary</h2>
      <br>
      <div style="background: rgba(255,255,255,0.4); padding: 16px; border-radius: 14px; margin-bottom: 14px;">
        <p>Item: <strong>${cartItem.title}</strong></p>
        <p style="margin-top: 4px;">Recipient: <strong>${deliveryDetails.recipientName}</strong> (${deliveryDetails.recipientAddress})</p>
        <p style="margin-top: 4px;">Target Date: <strong>${cartItem.deliveryDate}</strong></p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid var(--glass-border);">
          <td style="padding: 8px 0;">Bouquet Subtotal</td>
          <td style="text-align: right; font-weight: 600;">R ${cartItem.amount.toFixed(2)}</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--glass-border);">
          <td style="padding: 8px 0;">Standard Same-Day Delivery</td>
          <td style="text-align: right; font-weight: 600;">R ${deliveryFee.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 1.15rem; font-weight: 700; color: #9E1B22;">Total Due Now</td>
          <td style="text-align: right; font-size: 1.15rem; font-weight: 700; color: #9E1B22;">R ${totalPayment.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>
    `;

    //Toggle Payment Inputs (Capitec Pay vs Card vs Wallet)
    const paymentRadios = document.querySelectorAll("input[name='payment_method']");
    const capitecFields = document.querySelector("#capitec-fields");
    const cardFields = document.querySelector("#card-fields");

    paymentRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (e.target.value === "capitec_pay") {
          if (capitecFields) capitecFields.style.display = "block";
          if (cardFields) cardFields.style.display = "none";
        } else if (e.target.value === "card") {
          if (cardFields) cardFields.style.display = "block";
          if (capitecFields) capitecFields.style.display = "none";
        } else {
          if (capitecFields) capitecFields.style.display = "none";
          if (cardFields) cardFields.style.display = "none";
        }
      });
    });

    //Receipt
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const orderRef = "AFB-" + Math.floor(100000 + Math.random() * 900000);
        const receiptData = {
          orderRef,
          date: new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }),
          cartItem,
          deliveryDetails,
          deliveryFee,
          totalPayment
        };

        localStorage.setItem("afb_last_receipt", JSON.stringify(receiptData));
        window.location.href = "receipt.html";
      });
    }
  }
});