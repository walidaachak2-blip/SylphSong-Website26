// ===============================
// MOBILE MENU
// ===============================
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}

// ===============================
// REVEAL ANIMATION
// ===============================
const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// ===============================
// PRODUCT MODALS
// ===============================
const detailButtons = document.querySelectorAll(".detail-trigger");
const modalCloses = document.querySelectorAll(".modal-close");
const modals = document.querySelectorAll(".modal");

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("open");
  });
});

modalCloses.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    const parentModal = closeBtn.closest(".modal");
    if (parentModal) parentModal.classList.remove("open");
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
});

// ===============================
// PERFUME SIZE / QUANTITY / TOTAL
// ===============================
const selectedSizes = {
  apollo: { size: "30", price: 359 },
  artemis: { size: "30", price: 359 },
  dionysus: { size: "30", price: 359 },
  athena: { size: "30", price: 359 },
  aphrodite: { size: "30", price: 359 }
};

function calculateBundlePrice(size, qty) {
  const numericQty = Number(qty) || 1;

  if (size === "30") {
    const pairCount = Math.floor(numericQty / 2);
    const remainder = numericQty % 2;
    return (pairCount * 579) + (remainder * 359);
  }

  if (size === "50") {
    const pairCount = Math.floor(numericQty / 2);
    const remainder = numericQty % 2;
    return (pairCount * 979) + (remainder * 559);
  }

  if (size === "100") {
    const pairCount = Math.floor(numericQty / 2);
    const remainder = numericQty % 2;
    return (pairCount * 2179) + (remainder * 1159);
  }

  return 0;
}

function bindMiniProduct(productId) {
  const qtyInput = document.getElementById(`${productId}-qty`);
  const totalSpan = document.getElementById(`${productId}-total`);
  const sizeButtons = document.querySelectorAll(`.size-btn[data-product="${productId}"]`);

  if (!qtyInput || !totalSpan || !sizeButtons.length) return;

  function updateTotal() {
    const currentSize = selectedSizes[productId].size;
    const qty = Number(qtyInput.value) || 1;
    totalSpan.textContent = calculateBundlePrice(currentSize, qty);
  }

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      selectedSizes[productId] = {
        size: btn.getAttribute("data-size"),
        price: Number(btn.getAttribute("data-price"))
      };

      updateTotal();
    });
  });

  qtyInput.addEventListener("input", updateTotal);
  updateTotal();
}

["apollo", "artemis", "dionysus", "athena", "aphrodite"].forEach(bindMiniProduct);

// ===============================
// CART
// ===============================
let cart = JSON.parse(localStorage.getItem("sylphsongCart")) || [];

const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

if (cartToggle && cartSidebar) {
  cartToggle.addEventListener("click", () => {
    cartSidebar.classList.add("open");
  });
}

if (cartClose && cartSidebar) {
  cartClose.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });
}

function saveCart() {
  localStorage.setItem("sylphsongCart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartItems || !cartTotal || !cartCount) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    cartTotal.textContent = "0";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    total += item.total;

    return `
      <div class="cart-item">
        <p><strong>${item.name}</strong></p>
        <p>${item.size}ml × ${item.qty}</p>
        <p><strong>${item.total} DH</strong></p>
        <button class="remove-cart-item btn btn-outline" data-index="${index}">Remove</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = total;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  const removeButtons = document.querySelectorAll(".remove-cart-item");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.getAttribute("data-index"));
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
  });
}

const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const productName = button.getAttribute("data-name");
    const productId = button.getAttribute("data-product");
    const qtyInputId = button.getAttribute("data-qty-input");

    const qtyInput = document.getElementById(qtyInputId);
    const qty = Number(qtyInput.value) || 1;

    const chosenSize = selectedSizes[productId].size;
    const total = calculateBundlePrice(chosenSize, qty);

    cart.push({
      name: productName,
      size: chosenSize,
      qty: qty,
      total: total
    });

    saveCart();
    renderCart();

    const currentModal = button.closest(".modal");
    if (currentModal) currentModal.classList.remove("open");

    if (cartSidebar) cartSidebar.classList.add("open");
  });
});

renderCart();

// ===============================
// CHECKOUT MODAL
// ===============================
const checkoutBtn = document.querySelector(".cart-footer button");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutClose = document.getElementById("checkoutClose");
const confirmOrder = document.getElementById("confirmOrder");
const paymentOptions = document.querySelectorAll(".payment-option");

let selectedPayment = "cod";

if (checkoutBtn && checkoutModal) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    checkoutModal.classList.add("open");
  });
}

if (checkoutClose && checkoutModal) {
  checkoutClose.addEventListener("click", () => {
    checkoutModal.classList.remove("open");
  });
}

if (checkoutModal) {
  checkoutModal.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("open");
    }
  });
}

if (paymentOptions.length) {
  paymentOptions.forEach(option => {
    option.addEventListener("click", () => {
      paymentOptions.forEach(o => o.classList.remove("active"));
      option.classList.add("active");
      selectedPayment = option.dataset.method;
    });
  });
}

if (confirmOrder) {
  confirmOrder.addEventListener("click", () => {
    const name = document.getElementById("custName")?.value.trim();
    const phone = document.getElementById("custPhone")?.value.trim();
    const city = document.getElementById("custCity")?.value.trim();
    const address = document.getElementById("custAddress")?.value.trim();

    if (!name || !phone || !city || !address) {
      alert("Please fill all fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // CHECKOUT VIA WHATSAPP
    if (selectedPayment === "whatsapp") {
      let message = `New Order from SylphSong:%0A%0A`;
      message += `Name: ${name}%0A`;
      message += `Phone: ${phone}%0A`;
      message += `City: ${city}%0A`;
      message += `Address: ${address}%0A%0A`;
      message += `Order details:%0A`;

      cart.forEach(item => {
        message += `- ${item.name} | ${item.size}ml x${item.qty} = ${item.total} DH%0A`;
      });

      const finalTotal = cart.reduce((sum, item) => sum + item.total, 0);
      message += `%0ATotal: ${finalTotal} DH`;

      // REPLACE THIS NUMBER WITH YOUR REAL WHATSAPP NUMBER
      const whatsappNumber = "212600000000";

      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
      return;
    }

    // CASH ON DELIVERY / CARD / PAYPAL (temporary simulation)
    let paymentLabel = "Cash on Delivery";

    if (selectedPayment === "card") paymentLabel = "Debit Card";
    if (selectedPayment === "paypal") paymentLabel = "PayPal";

    alert(`Order confirmed successfully.\nPayment method: ${paymentLabel}\nThank you, ${name}!`);

    cart = [];
    saveCart();
    renderCart();

    if (checkoutModal) checkoutModal.classList.remove("open");

    const fields = ["custName", "custPhone", "custCity", "custAddress"];
    fields.forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = "";
    });

    selectedPayment = "cod";
    paymentOptions.forEach((option) => option.classList.remove("active"));
    const defaultPayment = document.querySelector('.payment-option[data-method="cod"]');
    if (defaultPayment) defaultPayment.classList.add("active");
  });
}

// ===============================
// ABOUT PAGE FEEDBACK SLIDER
// ===============================
const feedbackCards = document.querySelectorAll(".feedback-card");
const feedbackPrev = document.getElementById("feedbackPrev");
const feedbackNext = document.getElementById("feedbackNext");
const feedbackDots = document.getElementById("feedbackDots");

if (feedbackCards.length && feedbackDots) {
  let feedbackIndex = 0;
  let feedbackInterval;

  function renderFeedbackDots() {
    feedbackDots.innerHTML = "";
    feedbackCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `feedback-dot ${index === feedbackIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to review ${index + 1}`);
      dot.addEventListener("click", () => {
        feedbackIndex = index;
        showFeedback(feedbackIndex);
        restartFeedbackAutoSlide();
      });
      feedbackDots.appendChild(dot);
    });
  }

  function showFeedback(index) {
    feedbackCards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });

    const dots = document.querySelectorAll(".feedback-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextFeedback() {
    feedbackIndex = (feedbackIndex + 1) % feedbackCards.length;
    showFeedback(feedbackIndex);
  }

  function prevFeedback() {
    feedbackIndex = (feedbackIndex - 1 + feedbackCards.length) % feedbackCards.length;
    showFeedback(feedbackIndex);
  }

  function startFeedbackAutoSlide() {
    feedbackInterval = setInterval(nextFeedback, 10000);
  }

  function restartFeedbackAutoSlide() {
    clearInterval(feedbackInterval);
    startFeedbackAutoSlide();
  }

  if (feedbackNext) {
    feedbackNext.addEventListener("click", () => {
      nextFeedback();
      restartFeedbackAutoSlide();
    });
  }

  if (feedbackPrev) {
    feedbackPrev.addEventListener("click", () => {
      prevFeedback();
      restartFeedbackAutoSlide();
    });
  }

  renderFeedbackDots();
  showFeedback(feedbackIndex);
  startFeedbackAutoSlide();
}