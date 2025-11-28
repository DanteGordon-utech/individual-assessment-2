//Global variables
function Item(name, price)
{
    this.name = name;
    this.price = price;
}

function CartItem(name)
{
    this.name = name;
    this.quantity = 1;
};

function Account(email, password)
{
    this.email = email;
    this.password = password;
}

//has 
var itemDatabase;
var cart = [];
var accounts = []

/* Init */
function initStore()
{
    fetch("http://localhost:5500/items.json")
    .then(response => response.json())
    .then(data=> {
        const jsonString = JSON.stringify(data);
        console.log(jsonString); 

        if(Array.isArray(data))
        {
            populateCards(data);
            updateCartIcon();
        }
    })
    .catch(error => {
        console.error("Error: ",error);
    });
}


function populateCards(json)
{

    for(const item of json)
    {
        let card = document.createElement('div');
        let img = document.createElement('img');
        let productName = document.createElement('p');
        let productPrice = document.createElement('p');
        let button = document.createElement('button');
    
        card.classList.add('card');
        img.src = "../Assets/products/" + item.name.toLowerCase() + ".png";
        productName.textContent = item.name;
        productPrice.textContent = "$" + item.price;
        button.textContent = "Add to cart"
        button.classList.add("add-btn");
        button.addEventListener("click",() => {
            addToCart(item.name);
        });
        //Handle button callback
    
        card.appendChild(img);
        card.appendChild(productName);
        card.appendChild(productPrice);
        card.appendChild(button);
    
        let cardContainer = document.getElementById("product-container");
        cardContainer.appendChild(card);
    }
}

function populateCartCards()
{
    loadCart();
    console.log(cart);

    if(!Array.isArray(cart))
    {
        console.error("Cart is invalid!");
        return;
    }
    let listItemTemplate = document.getElementById("template");
    let listItemContainer  = document.getElementsByClassName("list-container")[0];

    console.log(listItemTemplate);

    for(const item of cart)
    {
        let listItem = listItemTemplate.cloneNode(true);
        listItem.id = null;
        listItem.classList.remove("hidden");

        let name = listItem.getElementsByTagName("p")[0];
        name.textContent = item.name;

        let image = listItem.getElementsByTagName("img")[0];
        image.src = "../Assets/products/" + item.name.toLowerCase() + ".png";

        let count = listItem.getElementsByTagName("input")[0];
        count.value = item.quantity;

        listItemContainer.appendChild(listItem);
    }
}

function loadCart()
{
    cart = JSON.parse(localStorage.getItem("cart"));
    
    if(cart === null)
    {
        console.error("Cart is empty");
        cart = []
    }
}

function saveCart()
{
    let cartString = JSON.stringify(cart);
    localStorage.setItem("cart",cartString);
}

document.addEventListener("DOMContentLoaded",function(event){
    console.log(document.title);
    var myForm = document.getElementById("login-form");

    //Loads the cart
    loadCart();

    if(myForm)
    {
        myForm.addEventListener("submit",function(event){
            event.preventDefault();
        });
    }

    /*if(!isLoggedIn() && (window.location.pathname  !== "/Codes/register.html" && window.location.pathname  !== "/Codes/login.html"))
    {
        console.log("Not logged in");
        window.location.href = "/Codes/login.html";
    }*/

    if(document.title === 'Store')
        initStore();

    if(document.title === 'Cart')
        populateCartCards();
        
});

document.addEventListener('keydown',function(event){
    if(event.key === ' ')
    {
        event.preventDefault();
        setLoggedIn('false');
    }

});

/* Utils */
function checkEmail(value)
{
    if(value.search("@") === -1)
        return false;

    return true;
}

function checkPasswords(p1, p2)
{
    if(p1 === p2)
        return true;

    return false;
}

function isLoggedIn()
{
    let loggedIn = localStorage.getItem("isLoggedin");
    console.log(loggedIn);

    if(loggedIn === 'false' || loggedIn === null)
        return false;

    return true;
}

function setLoggedIn(loggedin)
{
    localStorage.setItem("isLoggedin",loggedin);
}

/* Login */
function validateAccount(email, password)
{
    //Checks if account is avaliable on the device
    accounts = JSON.parse(localStorage.getItem("accounts"));
    console.log(JSON.stringify(accounts));

    
    if(Array.isArray(accounts))
        {
        for(const item of accounts)
        {
            console.log(email , " -> ", item.email);
            console.log(password , " -> ", item.password);
            if(email === item.email && password === item.password)
                return true;
        }
    }

    return false;
}

function onLogin()
{
    var form = document.getElementById("login-form");

    const [email, password] = form.getElementsByTagName("input");

    if(!checkEmail(email.value))
    {
        //console.log("invalid email");
        return;
    }

    if(!validateAccount(email.value,password.value))
    {
        return;
    }

    setLoggedIn('true');
    window.location.href = "/Codes/index.html";
}


function onRegister()
{
    email = document.getElementById("email");
    password = document.getElementById("password");
    confirmPassword = document.getElementById("re-password");

    if(!checkEmail(email.value))
    {
        //console.log("invalid email");
        return;
    }

    if(!checkPasswords(password.value,confirmPassword.value))
    {
        return;
    }

    //get current list of accounts
   // accounts = JSON.parse(localStorage.getItem("accounts"));

    if(accounts === null)
    {
        accounts = [];
    }

    currentAccount = new Account();
    currentAccount.email = email.value;
    currentAccount.password = password.value;
    accounts.push(currentAccount);

    console.log(JSON.stringify(accounts));
    
    localStorage.setItem("accounts",JSON.stringify(accounts));
    
    //console.log(email.value)
    //console.log(password.value)
    window.location.href = "/Codes/index.html"
}

function addToCart(itemName)
{
    console.log("Item added to cart" + itemName);
    let found = false;
    for(const item of cart)
    {
        if(item.name === itemName)
        {
            item.quantity = item.quantity + 1;
            found = true
        }
    }

    if(!found)
    {
        cart.push(new CartItem(itemName))
    }
    
    updateCartIcon();
    console.log(cart);
    saveCart();
}

function updateCartIcon()
{
    let shoppingCartIcon = document.getElementById("shopping-cart-icon");
    let cartCounter = shoppingCartIcon.getElementsByTagName("p")[0];
    cartCounter.textContent = cart.length;
}

/* Navigate */
function proceedToCheckout()
{
    /*window.location.href = "/Codes/checkout.html";*/

    let iframe = document.getElementById('checkout');

    if(iframe === null)
    {
        console.error("iframe is null");
        return;
    }

    
    if(iframe.style.display === 'none')
        iframe.style.display = 'flex'
}