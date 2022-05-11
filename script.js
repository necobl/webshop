loadItemsTable();
/* nav */
let allLink = document.querySelectorAll('.nav-link');
let productsView = document.querySelector('#products_view');
let addProductView = document.querySelector('#add_product_view');
let cartView = document.querySelector('#cart_view');
let views = document.querySelectorAll('.view');
/* nav end */

/* product input value */
let nameInput = document.querySelector('#name_product');
let descriptionInput = document.querySelector('#description_product');
let materialInput = document.querySelector('#material_product');
let categoryInput = document.querySelector('#category_product');
let specificationInput = document.querySelector('#specification_product');
let priceInput = document.querySelector('#price_product');
/* product input value  end */

let totalPrice = 0;
let priceItem = 0;
let itemAlreadyAdded = false;  /// items added in chart
let totalItems = []; /// Total items in chart
let numberQuantity = 1; /// Quantity chart items value
let totalSumItemPrice = 0;
let quantityNumber = 1;
const btnShowView = document.querySelectorAll('.btn-show-view');
const btnAddProduct = document.querySelector('#nav_add_product_view');
const saveBtn = document.querySelector('#save');
const modalSucces = new bootstrap.Modal(document.querySelector('.success-modal'));
const modalError = new bootstrap.Modal(document.querySelector('.error-modal'));
checkEmptyCart();

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

for (let i = 0; i < allLink.length; i++) {
    allLink[i].addEventListener('click', showViewProducts);

};

function showViewProducts(e) {

    views.forEach(e => e.style.display = "none")
    if (e instanceof Event) {
        e.preventDefault();
        let id = `#${this.getAttribute("href")}`;
        document.querySelector(id).style.display = "block";
    } else {
        document.querySelector(e).style.display = "block";
    }
};

for (let i = 0; i < btnShowView.length; i++) {
    btnShowView[i].addEventListener('click', showView);
};

function showView() {
    btnShowView.forEach(e => e.classList.remove('active'));
    this.classList.add('active');
};

btnAddProduct.addEventListener('click', function (e) {
    nameInput.value = "";
    descriptionInput.value = "";
    materialInput.value = "";
    categoryInput.value = "";
    specificationInput.value = "";
    priceInput.value = "";

    nameInput.classList.remove("is-invalid");
    descriptionInput.classList.remove("is-invalid");
    materialInput.classList.remove("is-invalid");
    categoryInput.classList.remove("is-invalid");
    specificationInput.classList.remove("is-invalid");
    priceInput.classList.remove("is-invalid");
});

gridView();

function gridView() {
    const btnTableGrid = document.querySelector('#table_grid');
    const btnColGrid = document.querySelector('#col_grid');
    btnTableGrid.addEventListener('click', loadItemsTable);
    btnColGrid.addEventListener('click', loadItemsCol);
};

saveBtn.addEventListener('click', function () {
    let nameValue = nameInput.value.trim();
    let descriptionValue = descriptionInput.value.trim();
    let materialValue = materialInput.value.trim();
    let categoryValue = categoryInput.value.trim();
    let specificationValue = specificationInput.value.trim();
    let priceValue = priceInput.value.trim();

    let formValid = true;

    const newAccount = {
        p_name: nameValue,
        p_avatar: 'http://placeimg.com/640/480/people',
        p_description: descriptionValue,
        p_price: priceValue,
        p_material: materialValue,
        p_category: categoryValue,
        p_spec: specificationValue
    }

    if (!nameValue.length) {
        nameInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!descriptionValue.length) {
        descriptionInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!materialValue.length) {
        materialInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!categoryValue.length) {
        categoryInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!specificationValue.length) {
        specificationInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!priceValue.length) {
        priceInput.classList.add("is-invalid");
        formValid = false;
    }
    if (formValid) {

        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/products", true);
        xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
        xhttp.send(JSON.stringify(newAccount));
        xhttp.onload = function () {
            if (xhttp.status === 201) {
                loadItemsTable();
                modalSucces.show();
                setTimeout(function () { modalSucces.hide(); }, 2000);
                showViewProducts("#products_view");
            }
            if (xhttp.status === 400 || this.status == 500) {
                modalError.show();
                setTimeout(function () { modalSucces.hide(); }, 2000);
                showViewProducts("#products_view");
            }
        }
    }

});

function loadItemsTable() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let obj = JSON.parse(this.responseText);

            class Pagination {
                constructor() {

                    let prevButton = document.getElementById('button_prev');
                    let nextButton = document.getElementById('button_next');

                    let current_page = 1;
                    let records_per_page = 5;
                    this.init = function () {
                        changePage(1);
                        pageNumbers();
                        selectedPage();
                        clickPage();
                        addEventListeners();
                    };

                    let addEventListeners = function () {
                        prevButton.addEventListener('click', prevPage);
                        nextButton.addEventListener('click', nextPage);
                    };

                    let selectedPage = function () {
                        let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
                        for (let i = 0; i < page_number.length; i++) {
                            if (i == current_page - 1) {
                                page_number[i].classList.add("active");
                            }
                            else {
                                page_number[i].classList.remove("active");
                            }
                        }
                    };

                    let showPageNumberOf = function () {
                        let showingItems = document.getElementById("showing_items");
                        let items_per_page = records_per_page - 1;
                        let firstNumberInfo = records_per_page * current_page;
                        let firstNumberInfoTotal = firstNumberInfo - items_per_page;
                        let ofNumber = records_per_page * current_page;
                        if (ofNumber > obj.length) {
                            ofNumber = obj.length
                        }
                        current_page == 1 ? showingItems.innerText = "Showing " + current_page + " to " + ofNumber + " of " + obj.length + " products" : showingItems.innerText = "Showing " + firstNumberInfoTotal + " to " + ofNumber + " of " + obj.length + " products";
                    };

                    let changePage = function (page) {
                        const listingTable = document.getElementById('products');

                        if (page < 1) {
                            page = 1;
                        }
                        if (page > (numPages() - 1)) {
                            page = numPages();
                        }

                        listingTable.innerHTML = "";

                        for (let i = (page - 1) * records_per_page; i < (page * records_per_page) && i < obj.length; i++) {

                            listingTable.innerHTML += `<div class='col-12 p-card line-content'>
                                <div class='row'>
                                <div class='col-sm-5 col-md-3'>
                                <div class='position-relative h-sm-100'><a class='d-block h-100'><img class='img-fluid fit-cover w-sm-100 h-sm-100 rounded-1 absolute-sm-centered' src=${obj[i].p_avatar} alt='Slika proizvoda'></a>
                                <div class='badge rounded-pill bg-success position-absolute top-0 end-0 me-2 mt-2 fs--2 z-index-2'>Novo</div>
                                </div>
                                </div>
                                <div class='col-sm-7 col-md-9'>
                                <div class='row h-100'>
                                <div class='col-lg-8'>
                                <h5 class='mt-3 mt-sm-0'><a class='text-dark fs-0 fs-lg-1' href=''>${obj[i].p_name}</a></h5>
                                <p class='fs--1 mb-2 mb-md-3'><a class='text-500' href=''>${obj[i].p_category}</a></p> 
                                <p class='fs--1 mb-2 mb-md-3'>${obj[i].p_description}</p> 
                                <ul class='d-none d-lg-block'>
                                <li><span>${obj[i].p_spec}</span></li>
                                <li><span>${obj[i].p_spec}</span></li>
                                <li><span>${obj[i].p_spec}</span></li>
                                </ul> 
                                </div>
                                <div class='col-lg-4 d-flex justify-content-between flex-column'>
                                <div><h4 class='fs-1 fs-md-2 text-warning mb-0'>$ ${obj[i].p_price}</h4></div>
                                <div class='mt-2 d-grid gap-2'><button  data-id='${obj[i].id}' class='btn btn-sm btn-primary mt-lg-2 btn-add-to-cart'><span class='ms-2'><i class='bi bi-cart-plus'></i> Add to cart</span></button>  <button onclick='seeMore(this)' class='btn btn-info btn-sm mt-lg-2' data-bs-toggle='modal' data-bs-target='#see_more_modal' data-id='${obj[i].id}'>View more</button></div>
                                </div> 
                                </div>
                                </div> 
                                </div> 
                                </div>
                                <hr>`;
                        }
                        showPageNumberOf();
                        selectedPage();

                        const btnAddToChart = document.querySelectorAll('.btn-add-to-cart');

                        btnAddToChart.forEach(e => {
                            e.addEventListener('click', () => addToCart(e));
                        });
                    };

                    let prevPage = function () {
                        if (current_page > 1) {
                            current_page--;
                            changePage(current_page);
                            window.scrollTo(0, 0);
                        }
                    };

                    let nextPage = function () {
                        if (current_page < numPages()) {
                            current_page++;
                            changePage(current_page);
                            window.scrollTo(0, 0);
                        }
                    };

                    let clickPage = function () {
                        document.addEventListener('click', function (e) {
                            if (e.target.nodeName == "BUTTON" && e.target.classList.contains("clickPageNumber")) {
                                current_page = e.target.textContent;
                                changePage(current_page);
                                window.scrollTo(0, 0);
                            }
                        });
                    };

                    let numPages = function () {
                        return Math.ceil(obj.length / records_per_page);
                    };
                    let pageNumbers = function () {
                        let pageNumber = document.getElementById('page_number');
                        pageNumber.innerHTML = "";

                        for (let i = 1; i < numPages() + 1; i++) {
                            pageNumber.innerHTML += `<button type='button' class='btn btn-outline-primary clickPageNumber'>${i}</button>`;
                        }
                    };
                }
            }

            let pagination = new Pagination();
            pagination.init();

        }
    }

    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/products", true);
    xhttp.send();
}


function loadItemsCol() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let obj = JSON.parse(this.responseText)
            class Pagination {
                constructor() {

                    let prevButton = document.getElementById('button_prev');
                    let nextButton = document.getElementById('button_next');

                    let current_page = 1;
                    let records_per_page = 8;
                    this.init = function () {
                        changePage(1);
                        pageNumbers();
                        selectedPage();
                        clickPage();
                        addEventListeners();
                    };

                    let addEventListeners = function () {
                        prevButton.addEventListener('click', prevPage);
                        nextButton.addEventListener('click', nextPage);
                    };

                    let selectedPage = function () {
                        let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
                        for (let i = 0; i < page_number.length; i++) {
                            if (i == current_page - 1) {
                                page_number[i].classList.add("active");
                            }
                            else {
                                page_number[i].classList.remove("active");;
                            }
                        }
                    };

                    let showPageNumberOf = function () {
                        let showingItems = document.getElementById("showing_items");
                        let items_per_page = records_per_page - 1;
                        let firstNumberInfo = records_per_page * current_page;
                        let firstNumberInfoTotal = firstNumberInfo - items_per_page;
                        current_page == 1 ? showingItems.innerText = "Showing " + current_page + " to " + records_per_page * current_page + " of " + obj.length + " products" : showingItems.innerText = "Showing " + firstNumberInfoTotal + " to " + records_per_page * current_page + " of " + obj.length + " products";
                    };

                    let changePage = function (page) {
                        const listingTable = document.getElementById('products');

                        if (page < 1) {
                            page = 1;
                        }
                        if (page > (numPages() - 1)) {
                            page = numPages();
                        }

                        listingTable.innerHTML = "";

                        for (let i = (page - 1) * records_per_page; i < (page * records_per_page) && i < obj.length; i++) {
                            listingTable.innerHTML += `<div class='col-md-3 p-3'> 
                                <div class='card'> 
                                <img src='${obj[i].p_avatar}' alt='Slika proizvoda'> 
                                <div class='card-body'>
                                <h5 class='card-title'>${obj[i].p_name}</h5>
                                <p class='card-text'>${obj[i].p_price}</p>
                                <button data-id='${obj[i].id}' class='btn btn-sm btn-primary btn-add-to-cart  mt-lg-2'><span class='ms-2'><i class='bi bi-cart-plus'></i> Add to cart</span></button>
                                </div> 
                                </div> 
                                </div>`;

                        }
                        showPageNumberOf();
                        selectedPage();

                        const btnAddToChart = document.querySelectorAll('.btn-add-to-cart');

                        btnAddToChart.forEach(e => {
                            e.addEventListener('click', () => addToCart(e));
                        });

                    };

                    let prevPage = function () {
                        if (current_page > 1) {
                            current_page--;
                            changePage(current_page);
                        }
                    };

                    let nextPage = function () {
                        if (current_page < numPages()) {
                            current_page++;
                            changePage(current_page);
                        }
                    };

                    let clickPage = function () {
                        document.addEventListener('click', function (e) {
                            if (e.target.nodeName == "BUTTON" && e.target.classList.contains("clickPageNumber")) {
                                current_page = e.target.textContent;
                                changePage(current_page);
                                window.scrollTo(0, 0);
                            }
                        });
                    };
                    let numPages = function () {
                        return Math.ceil(obj.length / records_per_page);
                    };

                    let pageNumbers = function () {
                        let pageNumber = document.getElementById('page_number');
                        pageNumber.innerHTML = "";

                        for (let i = 1; i < numPages() + 1; i++) {
                            pageNumber.innerHTML += `<button type='button' class='btn btn-outline-primary clickPageNumber'>${i}</button>`;
                        }
                    };
                }
            }

            let pagination = new Pagination();
            pagination.init();

        }
    }

    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/products", true);
    xhttp.send();
}

function seeMore(el) {
    let id = el.getAttribute("data-id");

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let obj = JSON.parse(this.responseText);
            document.querySelector('#see_more_lable').innerText = `${obj.p_name}`;
            document.getElementById("product_detalis").innerHTML = `
                                        <p>${obj.p_description}</p> 
                                        <p><b> Materijal </b> ${obj.p_material}</p> 
                                        <p><b> Cijena </b>${obj.p_price}</p>`;
        }
    }

    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/products/" + id, true);
    xhttp.send();

}

function addToCart(el) {
    let id = el.getAttribute("data-id");

    if (!itemAlreadyAdded) {
        document.getElementById("myCart").innerHTML = `<table class='table table-sm'>
            <thead>
            <tr>
            <th><b>Product name:</b></th>
            <th><b>Material:</b></th>
            <th><b>Price:</b></th>
            <th><b>Quantity:</b></th>
            <th><b>Total:</b></th>
            <th></th>
            </tr>
            </thead>
            <tbody id='tbody_cart'>
            </tbody>
            <tfoot>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th style='width:200px;'><b>Total price:</b> $ <span id='total_price'></span></th>
            <th></th> 
            </tfoot>
        </table>`
        itemAlreadyAdded = true;

    }

    let xhttp = new XMLHttpRequest();

    let exists = Object.values(totalItems).includes(id);

    if (exists == true) {
        document.getElementById(`plus_${id}`).click();
    } else {
        totalItems.push(id);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("total_items").innerHTML = totalItems.length;
                let obj = JSON.parse(this.responseText);
                document.getElementById("tbody_cart").innerHTML += `<tr id='cart_item_${obj.id}'>
                    <th scope='row'>${obj.p_name}</th>
                    <td>${obj.p_material}</td> 
                    <td>$ ${obj.p_price}</td>
                    <td><div class='input-group' style='width:100px;'><button onclick='minusBtn(this)' type='button' id='minus_${obj.id}' data-id='${obj.id}' data-p_price='${obj.p_price}' class='btn btn-primary btn-sm'><i class='bi bi-dash-circle'></i></button><span  id='number_quantity_${obj.id}' class='form-control form-control-sm text-center' data-id='${obj.id}'  data-p_price='${obj.p_price}'>1</span><button onclick='plusBtn(this)' type='button' id='plus_${obj.id}' data-id='${obj.id}' data-p_price='${obj.p_price}' class='btn btn-primary btn-sm'><i class='bi bi-plus-circle'></i></button></div>
                    <td>$ <span id='total_price_item_${obj.id}'>${obj.p_price}</span ></td >
                    <td><button onclick='removeFromCart(this)' data-id='${obj.id}' data-p_price='${obj.p_price}' class='btn btn-danger'><i class='bi bi-x-circle'></i></td>
                    </tr>`
                    ;
                totalSumItemPrice = parseFloat(document.getElementById("total_price_item_" + obj.id).innerText);
                totalPrice += parseFloat(totalSumItemPrice);
                document.getElementById("total_price").innerHTML = totalPrice;
            }
        }
    }

    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/products/" + id, true);
    xhttp.send();
    checkEmptyCart();
}

function removeFromCart(el) {
    let id = el.getAttribute("data-id");
    totalSumItemPrice = parseFloat(document.getElementById("total_price_item_" + id).innerText);
    totalPrice = totalPrice - totalSumItemPrice;
    document.getElementById("total_price").innerText = totalPrice;
    totalItems = totalItems.filter(function (el) {
        return el !== id
    });
    document.getElementById("cart_item_" + id).remove();
    document.getElementById("total_items").innerHTML = totalItems.length;
    checkEmptyCart();
}

function checkEmptyCart() {

    let divCartMessage = document.getElementById("message_cart");
    if (!totalItems.length) {
        divCartMessage.innerHTML += "<div class='alert alert-danger mt-3' role='alert'>Your cart is empty!</div>"
        document.getElementById("myCart").innerHTML = "";
        itemAlreadyAdded = false;
    } else {
        divCartMessage.innerHTML = "";
    }
}

function totalValueItem(el) {
    let id = el.getAttribute("data-id");
    let priceItem = parseInt(el.getAttribute("data-p_price"));
    totalPriceItem = document.getElementById("total_price_item_" + id);
    let quantity = document.getElementById("number_quantity_" + id).innerText;
    totalPriceItem.innerHTML = priceItem * quantity;
    totalSumItemPrice = parseFloat(totalPriceItem.innerText);
}

function minusBtn(el) {
    let id = el.getAttribute("data-id");
    let numberQuantity = document.getElementById("number_quantity_" + id);
    let numberQuantityValue = parseInt(document.getElementById("number_quantity_" + id).innerText);
    let number = numberQuantityValue;
    let min = 1; /// min number
    if (number > min) {
        number = number - 1;
        numberQuantity.innerText = number;
        totalValueItem(el);
        totalPrice = totalPrice - parseInt(el.getAttribute("data-p_price"));
        document.getElementById("total_price").innerText = totalPrice;
    }
}

function plusBtn(el) {
    let id = el.getAttribute("data-id");
    let numberQuantity = document.getElementById("number_quantity_" + id);
    let numberQuantityValue = parseInt(document.getElementById("number_quantity_" + id).innerText);
    let number = numberQuantityValue;
    let max = 30; /// max number
    if (number < max) {
        number = number + 1;
        numberQuantity.innerText = number;
        totalValueItem(el);
        totalPrice = totalPrice + parseInt(el.getAttribute("data-p_price"));
        document.getElementById("total_price").innerText = totalPrice;
    }
}
