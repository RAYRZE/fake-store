const productcontainer = document.getElementById("product-container")
const search = document.getElementById("search")
const searchbtn = document.getElementById("search-btn")
const cart= document.getElementById("cart")
const categoryButton =
    document.querySelectorAll(".categories")
let allProducts=[];
const listBuy = document.querySelector(".list-buy")
const buttons = document.querySelectorAll(".pagination-box");
const pageText = document.querySelector(".page");
const itemsPerPage = 9;
const cartProduct = document.querySelector(".cart-container")
const numberPrice = document.querySelector(".NumberPrice")
let productItems = [];
const checkout = document.querySelector(".checkout-box")
/*swict page*/
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentPage = Number(button.innerText);

    const start = (currentPage - 1) * itemsPerPage;
    const currentProducts =
        allProducts.slice(start,start + itemsPerPage)
    renderProduct(currentProducts);
  });
});
/*get the api*/
async function GetProducts() {
    const response = await fetch("https://fakestoreapi.com/products")
    const data = await response.json();
    console.log(data);
    allProducts = data ;
    renderProduct(allProducts.slice(0,itemsPerPage));
}
/*bring up the product*/
function renderProduct(products) {
    productcontainer.innerHTML = "";
    console.log(products);
    products.forEach((product) => {
        productcontainer.innerHTML += `
    <div class="product-box">
        <img src="${product.image}" class="product-picture">

        <div class="product-description">
        <p>${product.title}</p>
        <p>price</p>
        <p>$ ${product.price}</p>
        <button class="button-cart" data-id="${product.id}">🛒 Cart</button>
        </div>
    </div>
        `;
});
}
/*search bar*/
searchbtn.addEventListener("click",() => {
    const searchValue = search.value;
    const filteredProducts=allProducts.filter((product) => {
        return product.title.includes(searchValue)
    });
    renderProduct(filteredProducts)
})
/*filter category*/
categoryButton.forEach((button) => {
    button.addEventListener("click", () => {

        const selectedCategory = button.dataset.category;

        if (selectedCategory === "all") {
            renderProduct(allProducts);

            return;
        }
        console.log(selectedCategory);
        const filteredProducts = allProducts.filter((product) => {
            return product.category === selectedCategory;
        });

        renderProduct(filteredProducts);
    });
});
/*adding to the cart*/
productcontainer.addEventListener("click",(button) => {
    if(!button.target.classList.contains("button-cart")) return;
    
    const id = Number(button.target.dataset.id);
    const selectedProduct = allProducts.find((item) => item.id === id);

    const existedItem = productItems.find((item) => item.id === id);

    if(existedItem) {
        existedItem.qty +=1;
        console.log("ditambahkan double")
    }else { console.log("tambah langsung")
        productItems.push({
            ...selectedProduct,
            qty:1
        });
    }
    renderCart();
});
/*makes the cart table disappear*/
cart.addEventListener("click",() => {
    listBuy.classList.toggle("hidden");
});
/*product in cart*/
function renderCart() {
    cartProduct.innerHTML = "";
    let allTotal =0;
    productItems.forEach((product) => {
        const totalItem = product.price * product.qty;
        allTotal += totalItem;
        cartProduct.innerHTML +=`
        <div class="cart-item">
            <div class="product-info">
                <img src="${product.image}" class="img-product">
                <p>${product.title}</p>
            </div>
            <div class="qty">
                <p><button 
                class="qty-button" data-action="minus" data-id="${product.id}">-</button>${product.qty}<button class="qty-button" data-action="plus" data-id="${product.id}">+</button>
            </div>
            <div class="price">
                <p>${product.price}</p>
            </div>
            <div class="total">
                <p>${totalItem.toFixed(2)}</p>
            </div>
        </div>
        `;
    });
    numberPrice.textContent =`$${allTotal.toFixed(2)}`;
};
cartProduct.addEventListener("click", (event) => {

    if(!event.target.classList.contains("qty-button")) return;

    const id = Number(event.target.dataset.id);
    const action = event.target.dataset.action;

    const item = productItems.find(
        (product) => product.id === id
    );

    if(action === "plus"){
        item.qty++;
    }

    if(action === "minus"){

        item.qty--;

        if(item.qty <= 0){

            productItems = productItems.filter(
                (product) => product.id !== id
            );
        }
    }

    renderCart();
});
checkout.addEventListener("click",()=>{
    alert("product have been buy");
});
renderCart ();
GetProducts();
