const cart = [];

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

function loadProducts() {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        console.error("Error while loading data");
        throw new Error("Error while loading data");
      } else {
        return response.json();
      }
    })
    .then((products) => {
      console.log(products);

      const desserts = document.getElementsByClassName("desserts")[0];

      products.forEach((product) => {
        // create product
        const productItem = document.createElement("div");
        productItem.classList.add("product");

        // create product card
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // add image child
        const imgChild = document.createElement("img");
        imgChild.src = product.image.desktop;
        imgChild.alt = product.title;
        productCard.appendChild(imgChild);

        // add product button child
        const productBtnChild = document.createElement("div");
        productBtnChild.classList.add("product-btn");
        productBtnChild.setAttribute("data-name", product.name);
        productBtnChild.setAttribute("data-quantity", 0);
        productBtnChild.setAttribute("data-src", product.image.thumbnail);
        productBtnChild.setAttribute("data-price", product.price);
        productCard.appendChild(productBtnChild);

        // add grandchild to product button
        const imgCart = document.createElement("img");
        imgCart.src = "./assets/images/icon-add-to-cart.svg";
        productBtnChild.appendChild(imgCart);
        const addBtnText = document.createElement("div");
        addBtnText.innerText = "Add to Cart";
        productBtnChild.appendChild(addBtnText);

        // add product details
        const productDetails = document.createElement("div");
        productDetails.classList.add("product-details");
        const productHeader = document.createElement("div");
        productHeader.classList.add("product-header");
        const productTitle = document.createElement("div");
        productTitle.classList.add("product-title");
        const productPrice = document.createElement("div");
        productPrice.classList.add("product-price");

        productHeader.innerText = product.category;
        productTitle.innerText = product.name;
        productPrice.innerText = `$${product.price.toFixed(2)}`;
        productDetails.appendChild(productHeader);
        productDetails.appendChild(productTitle);
        productDetails.appendChild(productPrice);

        productItem.appendChild(productCard);
        productItem.appendChild(productDetails);

        desserts.appendChild(productItem);
      });

      const buttons = document.querySelectorAll(".product-btn");
      buttons.forEach((btn) => {
        btn.addEventListener("click", addToCartBtnClick);
      });
    })
    .catch((error) => {
      console.error("Error while loading data");
      console.log(error);
    });
}

window.onload = loadProducts();

function addToCartBtnClick() {
  console.log(this);

  const productBtnActive = document.createElement("div");
  productBtnActive.classList.add("product-btn-active");

  const decrementBtn = document.createElement("div");
  decrementBtn.classList.add("decrementBtn");
  const decrementImg = document.createElement("img");
  decrementImg.src = "../assets/images/minus.svg";
  decrementBtn.appendChild(decrementImg);

  const incrementBtn = document.createElement("div");
  incrementBtn.classList.add("incrementBtn");
  const incrementImg = document.createElement("img");
  incrementImg.src = "../assets/images/plus.svg";
  incrementBtn.appendChild(incrementImg);

  decrementBtn.addEventListener("click", decrementQuantity);
  incrementBtn.addEventListener("click", incrementQuantity);

  const productQuantity = document.createElement("div");
  productQuantity.classList.add("product-quantity");
  productQuantity.innerText = 1;

  productBtnActive.appendChild(decrementBtn);
  productBtnActive.appendChild(productQuantity);
  productBtnActive.appendChild(incrementBtn);

  productBtnActive.setAttribute("data-name", this.getAttribute("data-name"));
  productBtnActive.setAttribute("data-price", this.getAttribute("data-price"));
  productBtnActive.setAttribute("data-src", this.getAttribute("data-src"));
  productBtnActive.setAttribute("data-quantity", 1);

  this.replaceWith(productBtnActive);

  const addedProduct = {
    image: {
      thumbnail: productBtnActive.getAttribute("data-src"),
    },
    name: productBtnActive.getAttribute("data-name"),
    price: productBtnActive.getAttribute("data-price"),
    quantity: 1,
  };

  cart.push(addedProduct);

  addItemToCart(addedProduct);
}

function incrementQuantity() {
  const parentEl = this.parentElement;

  if (parentEl != null) {
    parentEl.setAttribute(
      "data-quantity",
      parseInt(parentEl.getAttribute("data-quantity")) + 1
    );

    parentEl.querySelector(".product-quantity").innerText =
      parentEl.getAttribute("data-quantity");

    const addedProduct = cart.find(
      (item) => item.name == parentEl.getAttribute("data-name")
    );

    if (addedProduct != null) {
      addedProduct.quantity += 1;
      updateCartItem(addedProduct, INCREMENT);
    }
  } else {
    console.error("Error while incrementing quantity");
  }
}

function decrementQuantity() {
  const parentEl = this.parentElement;

  if (parentEl != null) {
    if (parentEl.getAttribute("data-quantity") == 1) {
      // add product button child
      const productBtnChild = document.createElement("div");
      productBtnChild.classList.add("product-btn");
      productBtnChild.setAttribute(
        "data-name",
        parentEl.getAttribute("data-name")
      );
      productBtnChild.setAttribute(
        "data-price",
        parentEl.getAttribute("data-price")
      );
      productBtnChild.setAttribute(
        "data-src",
        parentEl.getAttribute("data-src")
      );
      productBtnChild.setAttribute("data-quantity", 0);

      // add grandchild to product button
      const imgCart = document.createElement("img");
      imgCart.src = "./assets/images/icon-add-to-cart.svg";
      productBtnChild.appendChild(imgCart);
      const addBtnText = document.createElement("div");
      addBtnText.innerText = "Add to Cart";
      productBtnChild.appendChild(addBtnText);
      productBtnChild.addEventListener("click", addToCartBtnClick);

      parentEl.replaceWith(productBtnChild);

      const addedProductIndex = cart.findIndex(
        (item) => item.name == parentEl.getAttribute("data-name")
      );

      if (addedProductIndex != -1) {
        removeCartItem(cart[addedProductIndex]);
        cart.splice(addedProductIndex, 1);
        document.getElementById("totalCartItems").innerText =
          parseInt(document.getElementById("totalCartItems").innerText) - 1;
      }

      updateCartTotal();

      return;
    } else if (parentEl.getAttribute("data-quantity") > 1) {
      parentEl.setAttribute(
        "data-quantity",
        parseInt(parentEl.getAttribute("data-quantity")) - 1
      );

      parentEl.querySelector(".product-quantity").innerText =
        parentEl.getAttribute("data-quantity");

      const addedProduct = cart.find(
        (item) => item.name == parentEl.getAttribute("data-name")
      );

      if (addedProduct != -1) {
        addedProduct.quantity -= 1;

        updateCartItem(addedProduct, DECREMENT);
      }
    } else {
      console.error("Error while incrementing quantity");
    }
  }
}

function addItemToCart(addedProduct) {
  const cartItemWraper = document.createElement("div");
  cartItemWraper.classList.add("cart-item-wrapper");

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItemWraper.appendChild(cartItem);

  const cartItemName = document.createElement("div");
  cartItemName.classList.add("cart-item-name");
  cartItem.appendChild(cartItemName);

  const cartItemDetails = document.createElement("div");
  cartItemDetails.classList.add("cart-item-details");
  cartItem.appendChild(cartItemDetails);

  const cartItemQuantity = document.createElement("div");
  cartItemQuantity.classList.add("cart-item-quantity");
  cartItemDetails.appendChild(cartItemQuantity);

  const cartItemPrice = document.createElement("div");
  cartItemPrice.classList.add("cart-item-price");
  cartItemDetails.appendChild(cartItemPrice);

  const cartItemTotal = document.createElement("div");
  cartItemTotal.classList.add("cart-item-total");
  cartItemDetails.appendChild(cartItemTotal);

  const cartRemoveItem = document.createElement("div");
  cartRemoveItem.classList.add("cart-remove-item");
  cartRemoveItem.addEventListener("click", removeCartItemFromCart);
  cartItemWraper.appendChild(cartRemoveItem);

  const cartRemoveItemIcon = document.createElement("img");
  cartRemoveItemIcon.src = "../assets/images/icon-remove-item.svg";
  cartRemoveItem.appendChild(cartRemoveItemIcon);

  cartItemName.innerText = addedProduct.name;
  cartItemQuantity.innerText = `${addedProduct.quantity}x`;
  cartItemPrice.innerText = `@ $${parseFloat(addedProduct.price).toFixed(2)}`;
  cartItemTotal.innerText = `$${(
    parseFloat(addedProduct.price) * addedProduct.quantity
  ).toFixed(2)}`;

  document.getElementById("totalCartItems").innerText =
    parseInt(document.getElementById("totalCartItems").innerText) + 1;

  showCartDisplayData(cartItemWraper);
  updateCartTotal();
}

function updateCartItem(cartItem, updateType) {
  const cartItems = document.querySelectorAll(".cart-item-wrapper");

  let targetCartItem = null;

  for (let i = 0; i < cartItems.length; i++) {
    if (
      cartItems[i].querySelector(".cart-item-name").innerText == cartItem.name
    ) {
      targetCartItem = cartItems[i];
    }
  }

  if (targetCartItem != null) {
    targetCartItem.querySelector(
      ".cart-item-quantity"
    ).innerText = `${cartItem.quantity}x`;

    targetCartItem.querySelector(".cart-item-total").innerText = `$${(
      cartItem.quantity * cartItem.price
    ).toFixed(2)}`;

    if (updateType.toUpperCase() == INCREMENT) {
      document.getElementById("totalCartItems").innerText =
        parseInt(document.getElementById("totalCartItems").innerText) + 1;
    } else if (updateType.toUpperCase() == DECREMENT) {
      document.getElementById("totalCartItems").innerText =
        parseInt(document.getElementById("totalCartItems").innerText) - 1;
    }
  }

  updateCartTotal();
}

function removeCartItem(cartItem) {
  const cartItems = document.querySelectorAll(".cart-item-wrapper");

  let targetCartItem = null;

  for (let i = 0; i < cartItems.length; i++) {
    if (
      cartItems[i].querySelector(".cart-item-name").innerText == cartItem.name
    ) {
      targetCartItem = cartItems[i];
    }
  }

  targetCartItem.remove();
}

function removeCartItemFromCart() {
  let targetCartItem = this.parentElement;

  const productName = targetCartItem.querySelector(".cart-item-name").innerText;
  const productPrice = parseInt(
    targetCartItem.querySelector(".cart-item-price").innerText.split("$")[1]
  );
  const productQuantity = targetCartItem
    .querySelector(".cart-item-quantity")
    .innerText.split("x")[0];

  document.getElementById("totalCartItems").innerText =
    parseInt(document.getElementById("totalCartItems").innerText) -
    parseInt(productQuantity);

  const allActiveOptions = document.querySelectorAll(".product-btn-active");
  let originalElement = null;

  for (let i = 0; i < allActiveOptions.length; i++) {
    if (allActiveOptions[i].getAttribute("data-name") == productName) {
      originalElement = allActiveOptions[i];
    }
  }

  // add product button child
  const productBtnChild = document.createElement("div");
  productBtnChild.classList.add("product-btn");
  productBtnChild.setAttribute("data-name", productName);
  productBtnChild.setAttribute("data-price", productPrice);
  productBtnChild.setAttribute("data-quantity", 0);

  // add grandchild to product button
  const imgCart = document.createElement("img");
  imgCart.src = "./assets/images/icon-add-to-cart.svg";
  productBtnChild.appendChild(imgCart);
  const addBtnText = document.createElement("div");
  addBtnText.innerText = "Add to Cart";
  productBtnChild.appendChild(addBtnText);
  productBtnChild.addEventListener("click", addToCartBtnClick);

  originalElement.replaceWith(productBtnChild);

  const addedProductIndex = cart.findIndex((item) => item.name == productName);

  if (addedProductIndex != -1) {
    removeCartItem(cart[addedProductIndex]);
    cart.splice(addedProductIndex, 1);
  }

  targetCartItem.remove();

  updateCartTotal();
}

function showCartDisplayData(cartItem) {
  const cartTotal = document.querySelector(".cart-total");
  const cartCarbon = document.querySelector(".cart-carbon");
  const cartConfirmBtn = document.querySelector(".cart-confirm-btn");
  cartConfirmBtn.addEventListener("click", openModal);

  const cartDisplayItems = [cartTotal, cartCarbon, cartConfirmBtn];

  cartDisplayItems.forEach((e) => {
    e.classList.remove("hide");
    e.classList.remove("show-flex");
  });

  document.querySelector(".cart-body").insertBefore(cartItem, cartTotal);
}

function updateCartTotal() {
  let total = 0;

  cart.forEach((item) => {
    total += item.quantity * item.price;
  });

  document.getElementById("cartTotalAmount").innerText = total.toFixed(2);

  if (total == 0) {
    const cartTotal = document.querySelector(".cart-total");
    const cartCarbon = document.querySelector(".cart-carbon");
    const cartConfirmBtn = document.querySelector(".cart-confirm-btn");

    const cartDisplayItems = [cartTotal, cartCarbon, cartConfirmBtn];

    cartDisplayItems.forEach((e) => {
      e.classList.remove("show-flex");
      e.classList.add("hide");
    });
  }
}

function openModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("show");
  modal.classList.remove("hide");

  displayBill();
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("hide");
  modal.classList.remove("show");
}

function displayBill() {
  console.log(cart);

  const itemListEl = document.querySelector(".modal-cart-item-list");

  const existingItems = document.querySelectorAll(".modal-cart-item");
  if (existingItems != null) {
    existingItems.forEach((el) => el.remove());
  }

  let totalPriceAmount = 0;

  cart.forEach((el) => {
    console.log(el);
    const modalCartItem = document.createElement("div");
    modalCartItem.classList.add("modal-cart-item");

    const modalCartItemLeft = document.createElement("div");
    modalCartItemLeft.classList.add("modal-cart-item-left");

    const modalCartItemThumbnail = document.createElement("div");
    modalCartItemLeft.classList.add("modal-cart-item-thumbnail");

    const modalCartItemThumbnailImage = document.createElement("img");

    modalCartItem.appendChild(modalCartItemLeft);
    modalCartItemLeft.appendChild(modalCartItemThumbnail);
    modalCartItemThumbnail.appendChild(modalCartItemThumbnailImage);
    modalCartItemThumbnailImage.src = el.image.thumbnail;
    modalCartItemThumbnailImage.alt = el.name;

    const details = document.createElement("div");
    details.classList.add("modal-cart-item-details");

    const name = document.createElement("div");
    name.classList.add("modal-cart-item-name");
    name.innerText = el.name;

    const data = document.createElement("div");
    data.classList.add("modal-cart-item-data");

    const quantity = document.createElement("div");
    quantity.classList.add("modal-cart-item-quantity");
    quantity.innerText = `${el.quantity}x`;

    const price = document.createElement("div");
    price.classList.add("modal-cart-item-price");
    price.innerText = `@ $${el.price}`;

    const right = document.createElement("div");
    right.classList.add("modal-cart-item-right");
    right.innerText = `$${parseFloat(el.price * el.quantity).toFixed(2)}`;

    totalPriceAmount += parseFloat(el.price * el.quantity);

    modalCartItemLeft.appendChild(details);
    details.appendChild(name);
    details.appendChild(data);
    data.appendChild(quantity);
    data.appendChild(price);

    modalCartItem.appendChild(right);

    const totalRow = document.querySelector(".modal-cart-total");
    totalRow.classList.remove("hide");
    totalRow.classList.add("show-flex");

    itemListEl.insertBefore(modalCartItem, totalRow);
  });

  if (cart != null && cart.length > 0) {
    const startNewOrder = document.querySelector(".modal-cart-btn-wrapper");

    const totalPrice = document.querySelector(".modal-cart-total-price");
    totalPrice.innerText = `$${totalPriceAmount.toFixed(2)}`;

    startNewOrder.classList.remove("hide");
    startNewOrder.classList.add("show-flex");

    startNewOrder.addEventListener("click", function () {
      window.location.reload();
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }
}

window.onclick = function (e) {
  if (e.target == document.querySelector(".modal")) {
    closeModal();
    window.location.reload();
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
};
