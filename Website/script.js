document.addEventListener("DOMContentLoaded", () => {

  /*
     1. PRODUCT stem PRICING & AUTH-PROTECTED ADD-TO-CART (TPS)
*/
  const productForm = document.querySelector("form[action='cart.html']");
  if (productForm) {
    const stemRadios = productForm.querySelectorAll("input[name='stem_count']");
    const gypCheckbox = productForm.querySelector("input[name='addon_gyp']");
    const vaseCheckbox = productForm.querySelector("input[name='addon_vase']");
    const priceDisplay = document.querySelector(".product-price") || document.querySelector("h2[style*='color']");
    const productName = document.querySelector("h1")?.textContent || "Custom Bouquet";

    const calculatePrice = () => {
      let basePrice = 550;
      let selectedStems = 20;

      stemRadios.forEach(radio => {
        if (radio.checked) {
          selectedStems = parseInt(radio.value);
          basePrice = 550 + ((selectedStems - 20) / 20) * 300;
        }
      });

      let addOnsTotal = 0;
      if (gypCheckbox && gypCheckbox.checked) {
        addOnsTotal += (selectedStems / 20) * 200;
      }
      if (vaseCheckbox && vaseCheckbox.checked) {
        addOnsTotal += 150;
      }

      const grandTotal = basePrice + addOnsTotal;

      if (priceDisplay) {
        priceDisplay.textContent = `R ${grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
      }

      return { productName, selectedStems, basePrice, addOnsTotal, grandTotal };
    };

    stemRadios.forEach(r => r.addEventListener("change", calculatePrice));
    if (gypCheckbox) gypCheckbox.addEventListener("change", calculatePrice);
    if (vaseCheckbox) vaseCheckbox.addEventListener("change", calculatePrice);

    productForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const activeUser = JSON.parse(localStorage.getItem("afb_active_user"));
      if (!activeUser) {
        alert("Account Required: Please log in or create an account before adding items to your cart.");
        window.location.href = "login.html";
        return;
      }

      const orderSpecs = calculatePrice();
      const deliveryDate = productForm.querySelector("#delivery-date")?.value || "Standard Delivery";

      const cartItem = {
        title: orderSpecs.productName,
        stems: orderSpecs.selectedStems,
        deliveryDate: deliveryDate,
        amount: orderSpecs.grandTotal,
        hasGyp: gypCheckbox ? gypCheckbox.checked : false,
        hasVase: vaseCheckbox ? vaseCheckbox.checked : false
      };

      let cartItems = JSON.parse(localStorage.getItem("afb_cart_items") || "[]");
      cartItems.push(cartItem);
      localStorage.setItem("afb_cart_items", JSON.stringify(cartItems));
      
      window.location.href = "cart.html";
    });
  }

  /*
     2. DYNAMIC SUBURB & DELIVERY TRAVEL RATE LOOKUP WITH MAP EMBED
     */
 const suburbForms = document.querySelectorAll("form[action='faq.html'], form[action='faq.html?']");
  suburbForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='text']");
      if (!input || !input.value.trim()) return;

      const query = input.value.trim().toLowerCase();
      const metros = ["sandton", "pretoria", "centurion", "midrand", "johannesburg", "rosebank", "mamelodi", "hatfield", "menlo park"];
      const isMetro = metros.some(m => query.includes(m));

      let rate = isMetro ? 120.00 : 220.00;
      localStorage.setItem("afb_delivery_rate", rate.toString());
      localStorage.setItem("afb_suburb_name", input.value.trim());

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
        resultBox.innerHTML = `<strong>✓ Metro Delivery Rate Confirmed:</strong> Same-day delivery fee for <em>"${input.value}"</em> is <strong>R 120.00</strong> (Primary Gauteng Hub).`;
      } else {
        resultBox.style.background = "rgba(158, 27, 34, 0.1)";
        resultBox.style.color = "#9E1B22";
        resultBox.innerHTML = `<strong>ℹ Outlying Regional Rate:</strong> Special regional courier travel rate for <em>"${input.value}"</em> is <strong>R 220.00</strong>.`;
      }

      const mapIframe = document.querySelector("#gauteng-delivery-map");
      if (mapIframe) {
        const encodedLocation = encodeURIComponent(input.value + ", Gauteng, South Africa");
        mapIframe.src = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      }
    });
  });

  /*
     3. EXPRESS CART DETAILS & SAVING RECIPIENT INFO
*/
  const cartForm = document.querySelector("form[action='checkout.html']");
  if (cartForm) {
    const activeUser = JSON.parse(localStorage.getItem("afb_active_user"));
    if (activeUser) {
      const buyerEmail = cartForm.querySelector("#buyer-email");
      if (buyerEmail) buyerEmail.value = activeUser.email;
    }

    cartForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const recipientName = cartForm.querySelector("#recip-name")?.value || "";
      const recipientPhone = cartForm.querySelector("#recip-phone")?.value || "";
      const recipientAddress = cartForm.querySelector("#recip-address")?.value || "";
      const cardNote = cartForm.querySelector("#card-note")?.value || "";
      const isAnonymous = cartForm.querySelector("input[name='anonymous_sender']")?.checked || false;
      const buyerEmail = cartForm.querySelector("#buyer-email")?.value || "";


      const saPhoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
      if (!saPhoneRegex.test(recipientPhone)) {
        alert("Please enter a valid South African mobile number (e.g. 0610667057).");
        return;
      }

      const deliveryDetails = {
        recipientName,
        recipientPhone,
        recipientAddress,
        cardNote,
        isAnonymous,
        buyerEmail
      };

      localStorage.setItem("afb_delivery_details", JSON.stringify(deliveryDetails));
      window.location.href = "checkout.html";
    });
  }

  /*
     4. CHECKOUT SUMMARY & PAYMENT PROCESSING
     */
  const checkoutSummarySection = document.querySelector("#checkout-summary");
  const checkoutForm = document.querySelector("#payment-form");

  if (checkoutSummarySection) {
    const cartItem = JSON.parse(localStorage.getItem("afb_cart_item")) || {
      title: "Pink Rose Bouquet (40 Stems)",
      amount: 850.00,
      deliveryDate: "2026-10-31"
    };

    const deliveryDetails = JSON.parse(localStorage.getItem("afb_delivery_details")) || {
      recipientName: "Valued Customer",
      recipientAddress: "Gauteng Metro Area"
    };

    const deliveryFee = parseFloat(localStorage.getItem("afb_delivery_rate") || "120.00");
    const totalPayment = cartItem.amount + deliveryFee;

    checkoutSummarySection.innerHTML = `
      <h2>Final Order & Travel Rate Summary</h2>
      <br>
      <div style="background: rgba(255,255,255,0.4); padding: 16px; border-radius: 14px; margin-bottom: 14px;">
        <p>Item: <strong>${cartItem.title}</strong></p>
        <p style="margin-top: 4px;">Recipient: <strong>${deliveryDetails.recipientName}</strong> (${deliveryDetails.recipientAddress})</p>
        <p style="margin-top: 4px;">Delivery Date: <strong>${cartItem.deliveryDate}</strong></p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid var(--glass-border);">
          <td style="padding: 8px 0;">Bouquet Price</td>
          <td style="text-align: right; font-weight: 600;">R ${cartItem.amount.toFixed(2)}</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--glass-border);">
          <td style="padding: 8px 0;">Delivery Travel Rate</td>
          <td style="text-align: right; font-weight: 600;">R ${deliveryFee.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; font-size: 1.15rem; font-weight: 700; color: #9E1B22;">Total Amount Due</td>
          <td style="text-align: right; font-size: 1.15rem; font-weight: 700; color: #9E1B22;">R ${totalPayment.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>
    `;

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

    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const activeUser = JSON.parse(localStorage.getItem("afb_active_user"));
        const orderRef = "AFB-" + Math.floor(100000 + Math.random() * 900000);
        
        const receiptData = {
          orderRef,
          date: new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }),
          userEmail: activeUser ? activeUser.email : deliveryDetails.buyerEmail,
          cartItem,
          deliveryDetails,
          deliveryFee,
          totalPayment
        };

        localStorage.setItem("afb_last_receipt", JSON.stringify(receiptData));
        
        const userOrders = JSON.parse(localStorage.getItem("afb_user_orders") || "[]");
        userOrders.push(receiptData);
        localStorage.setItem("afb_user_orders", JSON.stringify(userOrders));

        window.location.href = "receipt.html";
      });
    }
  }

  /*
     5. USER AUTHENTICATION & PROFILE
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

  function checkUserSession() {
    const activeUser = JSON.parse(localStorage.getItem("afb_active_user"));
    
    if (activeUser && userDashboard && authContainer) {
      authContainer.style.display = "none";
      userDashboard.style.display = "block";
      
      document.querySelector("#dashboard-user-name").textContent = activeUser.name;
      document.querySelector("#dashboard-user-email").textContent = activeUser.email;
      document.querySelector("#dashboard-user-phone").textContent = activeUser.phone;

      const orderHistoryContainer = document.querySelector("#order-history-list");
      if (orderHistoryContainer) {
        const allOrders = JSON.parse(localStorage.getItem("afb_user_orders") || "[]");
        const userOrders = allOrders.filter(o => o.userEmail === activeUser.email);

        if (userOrders.length === 0) {
          orderHistoryContainer.innerHTML = "<p style='color: var(--brand-muted);'>No past orders found.</p>";
        } else {
          orderHistoryContainer.innerHTML = userOrders.map(order => `
            <div style="background: rgba(255,255,255,0.5); padding: 14px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--glass-border); text-align: left;">
              <p><strong>Ref:</strong> ${order.orderRef} | <strong>Date:</strong> ${order.date}</p>
              <p><strong>Item:</strong> ${order.cartItem.title} (R ${order.totalPayment.toFixed(2)})</p>
              <p style="color: #5E7060;"><strong>Status:</strong> Out for Delivery</p>
            </div>
          `).join("");
        }
      }
    }
  }
  checkUserSession();

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

      const newUser = { name, email, phone, password };
      existingUsers.push(newUser);
      localStorage.setItem("afb_users", JSON.stringify(existingUsers));
      localStorage.setItem("afb_active_user", JSON.stringify(newUser));

      showAuthMsg("✓ Account created successfully! Redirecting...", false);
      setTimeout(() => { checkUserSession(); }, 800);
    });
  }

  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.querySelector("#signin-email").value.trim().toLowerCase();
      const password = document.querySelector("#signin-password").value;

      const existingUsers = JSON.parse(localStorage.getItem("afb_users") || "[]");
      const matchedUser = existingUsers.find(u => u.email === email && u.password === password);

      if (matchedUser) {
        localStorage.setItem("afb_active_user", JSON.stringify(matchedUser));
        showAuthMsg("✓ Sign in successful!", false);
        setTimeout(() => { checkUserSession(); }, 800);
      } else {
        showAuthMsg("Invalid email or password. Please try again.", true);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("afb_active_user");
      userDashboard.style.display = "none";
      authContainer.style.display = "block";
      authMsg.style.display = "none";
    });
  }

  /*
     6. REVIEWS FORM SUBMISSION
  */
  const reviewForm = document.querySelector("#review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.querySelector("#reviewer-name");
      const ratingSelect = document.querySelector("#rating");
      const stemCategorySelect = document.querySelector("#review-stem-category");
      const fileInput = document.querySelector("#photo-upload");
      const textInput = document.querySelector("#review-text");

      const name = nameInput.value.trim();
      const ratingNum = parseInt(ratingSelect.value);
      const stemCategory = stemCategorySelect ? stemCategorySelect.value : "40-stems";
      const reviewText = textInput.value.trim();
      const stars = "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum);

      let imageUrl = "images/pinkroses.jpeg";
      if (fileInput.files && fileInput.files[0]) {
        imageUrl = URL.createObjectURL(fileInput.files[0]); 
      }

      const stemDisplayLabel = stemCategory.replace("-", " ").toUpperCase();

      const reviewContainer = document.querySelector("section.grid-2");
      if (reviewContainer) {
        const newCard = document.createElement("article");
        newCard.className = "review-card";
        newCard.setAttribute("data-category", stemCategory); 

        newCard.innerHTML = `
          <div class="review-card-content">
            <img src="${imageUrl}" alt="Customer Uploaded Photo" class="review-img">
            <div class="review-details">
              <h3><span class="stars">${stars}</span> "${reviewText.substring(0, 30)}..."</h3>
              <p class="review-quote"><em>"${reviewText}"</em></p>
              <p class="reviewer-info"><strong>- ${name}</strong> (Verified Buyer — ${stemDisplayLabel})</p>
              <a href="menu.html" class="button review-btn">Order This Setup (${stemDisplayLabel})</a>
            </div>
          </div>
        `;

        reviewContainer.prepend(newCard);
        reviewForm.reset();
        alert("Thank you! Your review has been posted and tagged successfully.");
      }
    });
  }

  /*
     7. CONTACT FORM EMAIL HANDLER
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
     8. DYNAMIC REVIEW FILTERING BY STEM COUNT
  */
  const filterPills = document.querySelectorAll(".filter-pill");

  filterPills.forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const filterValue = pill.getAttribute("data-filter") || "all";
      const reviewArticles = document.querySelectorAll("section.grid-2 .review-card, section.grid-2 article");

      reviewArticles.forEach(article => {
        const articleCategory = article.getAttribute("data-category") || "";
        const articleText = article.textContent.toLowerCase();

        if (filterValue === "all") {
          article.style.display = "block";
        } else {
          const searchTerm = filterValue.replace("-", " ").replace("s", ""); 
          const alternativeTerm = filterValue.replace("-", ""); 

          if (articleCategory === filterValue || articleText.includes(searchTerm) || articleText.includes(alternativeTerm)) {
            article.style.display = "block";
          } else {
            article.style.display = "none";
          }
        }
      });
    });
  });

  /*
   9. DYNAMIC CART BADGE COUNTER
  */
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("afb_cart_items") || "[]");
    const singleItem = JSON.parse(localStorage.getItem("afb_cart_item"));
    
    let totalCount = cartItems.length;
    if (totalCount === 0 && singleItem) totalCount = 1;

    const cartBadge = document.querySelector("#cart-badge");
    if (cartBadge) {
      if (totalCount > 0) {
        cartBadge.textContent = totalCount;
        cartBadge.style.display = "inline-flex";
      } else {
        cartBadge.style.display = "none";
      }
    }
  }
  updateCartBadge();

  const cartItemsContainer = document.querySelector("#cart-items-container");
  if (cartItemsContainer) {
    let cartItems = JSON.parse(localStorage.getItem("afb_cart_items") || "[]");
    const legacyItem = JSON.parse(localStorage.getItem("afb_cart_item"));
    
    if (cartItems.length === 0 && legacyItem) {
      cartItems = [legacyItem];
    }

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `<p style="color: var(--brand-muted);">Your cart is currently empty. <a href="menu.html">Browse our menu</a> to add flowers.</p>`;
    } else {
      let html = "";
      let totalSum = 0;

      cartItems.forEach((item, index) => {
        totalSum += item.amount;
        html += `
          <div style="background: rgba(255,255,255,0.5); padding: 14px 18px; border-radius: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--glass-border);">
            <div>
              <p><strong>${item.title}</strong> (${item.stems} Stems)</p>
              <p style="font-size: 0.9rem; color: var(--brand-muted);">Delivery Date: ${item.deliveryDate} ${item.hasGyp ? '| +Gypsophila' : ''} ${item.hasVase ? '| +Vase' : ''}</p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 700; color: #9E1B22;">R ${item.amount.toFixed(2)}</p>
              <button type="button" onclick="removeItem(${index})" style="background: transparent; color: #9E1B22; border: none; font-size: 12px; cursor: pointer; padding: 2px 0;">Remove</button>
            </div>
          </div>
        `;
      });

      html += `<div style="text-align: right; margin-top: 15px;"><h3>Cart Total: R ${totalSum.toFixed(2)}</h3></div>`;
      cartItemsContainer.innerHTML = html;
    }
  }

/*
   10. STICKY NAVBAR SCROLL ELEVATION
  */
const headerNav = document.querySelector("#header-section");

if (headerNav) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      headerNav.style.padding = "8px 20px";
      headerNav.style.background = "rgba(255, 255, 255, 0.75)";
      headerNav.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.12)";
    } else {
      headerNav.style.padding = "12px 28px";
      headerNav.style.background = "var(--glass-bg)";
      headerNav.style.boxShadow = "var(--glass-shadow)";
    }
  });
}

});

function removeItem(index) {
  let cartItems = JSON.parse(localStorage.getItem("afb_cart_items") || "[]");
  cartItems.splice(index, 1);
  localStorage.setItem("afb_cart_items", JSON.stringify(cartItems));
  localStorage.removeItem("afb_cart_item");
  location.reload();
}