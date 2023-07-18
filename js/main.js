window.onload = function () {
    console.log("App started");
    productsList.init();
};

class Product {
    constructor(name, amount, exDate) {
        this.name = name;
        this.amount = amount;
        this.exDate = exDate;
        this.id = Date.now(); // timestamp
    }
}

class ProductsList {
    constructor() {
        this.products = [];
    }

    init() {
        document.getElementById("saveButton").addEventListener("click",
            (e) => this.saveButton(e));

        this.loadDataFromStorage();
    }

    loadDataFromStorage() {
        const data = storage.getItems();
        if (data == null || data == undefined) return;

        this.products = data;

        data.forEach((value, index) => {
            ui.addProductsToTable(value);
        });
    }

    saveButton(e) {
        console.log("save button");
        const amount = document.getElementById("amountOfProducts").value;
        const name = document.getElementById("productName").value;
        const exDate = document.getElementById("expiryDateProducts").value;

        if (amount === "" || name === "" || exDate === "") {
            console.log("blank data");
            return;
        }

        e.preventDefault();
        const product = new Product(name, amount, exDate);
        this.addProduct(product);
    }

    addProduct(product) {
        this.products.push(product);
        ui.addProductsToTable(product);
        this.saveData();
    }

    removeProductById(productId) {
        this.products.forEach((el, index) => {
            if (el.id == productId) this.products.splice(index, 1);
        });

        this.saveData();
    }

    moveProductUp(productId) {
        let arr = this.products;

        for (let a = 0; a < arr.length; a++) {
            let el = arr[a];

            if (el.id == productId) {
                if (a >= 1) {
                    let temp = arr[a - 1];
                    arr[a - 1] = arr[a];
                    arr[a] = temp;
                    break;
                }
            }
        }

        this.saveData();
        ui.deleteAllProductRows();
        this.loadDataFromStorage();
    }


    moveProductDown(productId) {
        let arr = this.products;

        for (let a = 0; a < arr.length; a++) {
            let el = arr[a];

            if (el.id == productId) {
                if (a <= arr.length - 2) {
                    let temp = arr[a + 1];
                    arr[a + 1] = arr[a];
                    arr[a] = temp;
                    break;
                }
            }
        }

        this.saveData();
        ui.deleteAllProductRows();
        this.loadDataFromStorage();
    }

    saveData() {
        storage.saveItems(this.products);
    }
}

const productsList = new ProductsList();


class Ui {

    deleteProduct(e) {
        const productId = e.target.getAttribute("data-product-id");

        e.target.parentElement.parentElement.remove();
        productsList.removeProductById(productId);
    }

    deleteAllProductRows() {
        const tbodyRows = document.querySelectorAll("#productsTable tbody tr");

        tbodyRows.forEach(function (el) {
            el.remove();
        });
    }

    addProductsToTable(product) {
        const tbody = document.querySelector("#productsTable tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td> ${product.name} </td>
            <td> ${product.amount} </td>
            <td> ${product.exDate} </td>
            <td> 
                <button type="button" data-product-id="${product.id}" 
                    class="btn btn-outline-secondary brn-sm up-arrow">▲</button>
                <button type="button" data-product-id="${product.id}" 
                    class="btn btn-outline-secondary brn-sm down-arrow">▼</button>
                <button type="button" data-product-id="${product.id}" 
                    class="btn btn-danger brn-sm delete">Skasuj</button>
            </td>
        `;

        tbody.appendChild(tr);

        let deleteButton = document.querySelector(
            `button.delete[data-product-id='${product.id}']`);
        deleteButton.addEventListener("click", (e) => this.deleteProduct(e));

        let upButton = document.querySelector(
            `button.up-arrow[data-product-id='${product.id}']`);
        upButton.addEventListener("click", (e) => this.arrowUp(e));

        let downButton = document.querySelector(
            `button.down-arrow[data-product-id='${product.id}']`);
        downButton.addEventListener("click", (e) => this.arrowDown(e));
        this.clearForm();
    }

    arrowUp(e) {
        let productId = e.target.getAttribute("data-product-id");
        console.log("up", productId);
        productsList.moveProductUp(productId);
    }

    arrowDown(e) {
        let productId = e.target.getAttribute("data-product-id");
        console.log("down", productId);
        productsList.moveProductDown(productId);
    }

    clearForm() {
        document.getElementById("productName").value = "";
        document.getElementById("amountOfProducts").value = "";
        document.getElementById("expiryDateProducts").value = "";

        document.getElementById("productForm").classList.remove("was-validated");
    }
}

const ui = new Ui();

class Storage {

    getItems() {
        let products = null;

        if (localStorage.getItem("products") !== null) {
            products = JSON.parse(localStorage.getItem("products"));
        } else {
            products = [];
        }

        return products;
    }

    saveItems(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

const storage = new Storage();


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()