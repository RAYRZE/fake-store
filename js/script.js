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
const cartChisa = document.querySelector(".cart-container")
const testItems = [
    {
        title : "headphone",
        price : 50.99,
        qty : 1
    },
    {
        title : "Backpack",
        price : 60.99,
        qty : 2
    }
];
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentPage = Number(button.innerText);

    const start = (currentPage - 1) * itemsPerPage;
    const currentProducts =
        allProducts.slice(start,start + itemsPerPage)
    renderProduct(currentProducts);
  });
});
async function GetProducts() {
    const response = await fetch("https://fakestoreapi.com/products")
    const data = await response.json();
    console.log(data);
    allProducts = data ;
    renderProduct(allProducts.slice(0,itemsPerPage));
}
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
        <button class="button-cart">🛒 Cart</button>
        </div>
    </div>
        `;
});
}
searchbtn.addEventListener("click",() => {
    const searchValue = search.value;
    const filteredProducts=allProducts.filter((product) => {
        return product.title.includes(searchValue)
    });
    renderProduct(filteredProducts)
})
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
cart.addEventListener("click",() => {
    listBuy.classList.toggle("hidden");
});
function renderCart() {
    cartChisa.innerHTML = "";
    testItems.forEach((chisa) => {
        cartChisa.innerHTML +=`
        <div class="cart-item">
            <div class="product-info">
                <img src="${chisa.image}" class="img-product">
                <p>${chisa.title}</p>
            </div>
            <div class="price">
                <p>${chisa.price}</p>
            </div>
            <div class="qty">
                <p>${chisa.qty}</p>
            </div>
        </div>
        `;
    });
}
renderCart ();
GetProducts();
