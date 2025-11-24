//Global variables
function Item(name, price)
{
    this.name = name;
    this.price = price;
}

function CartItem(name,price)
{
    this.name = name;
    this.quantity = 1;
    this.price = price;
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
        img.src = "../Assets/products/" + item.name.toLowerCase() + ".jpg";
        productName.textContent = item.name;
        productPrice.textContent = "$" + item.price;
        button.textContent = "Add to cart"
        button.addEventListener("click",() => {
            addToCart(item.name,item.price);
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
        image.src = "../Assets/products/" + item.name.toLowerCase() + ".jpg";

        let count = listItem.getElementsByTagName("input")[0];
        count.value = item.quantity;
        count.addEventListener('input',(e)=>{
            updateCartItem(item.name,count.value);
        });

        let button = listItem.getElementsByTagName('button')[0];
        button.addEventListener('click',(e) =>
        {
            removeFromCart(item.name);
            window.location.reload();
        });

        listItemContainer.appendChild(listItem);
    }
}

function populateReceiptRows()
{
    console.log("populate Receipt Rows");
    loadCart();
    console.log(cart);

    if(!Array.isArray(cart))
    {
        console.error("Cart is invalid!");
        return;
    }
    let total = 0;
    let receiptTemplate = document.getElementById("template");
    let receiptItemContainer  = document.getElementsByClassName("reciept-container")[0];

    console.log(receiptTemplate);

    for(const item of cart)
    {
        let receiptItem = receiptTemplate.cloneNode(true);
        receiptItem.id = null;

        let div1 = receiptItem.getElementsByTagName("p")[0];
        div1.textContent = item.name;

        let div2 = receiptItem.getElementsByTagName("p")[1];
        div2.textContent = item.quantity;

        let div3 = receiptItem.getElementsByTagName("p")[2];
        console.log(item.quantity);
        console.log(item.price);
        div3.textContent = '$' + (item.quantity * item.price) + ' JMD';
        total += (item.quantity * item.price);

        receiptItemContainer.appendChild(receiptItem);
    }

    //Add total to the end
    let receiptItem = receiptTemplate.cloneNode(true);
    receiptItem.id = null;

    let div1 = receiptItem.getElementsByTagName("p")[0];
    div1.textContent = 'Total'
    
    let div3 = receiptItem.getElementsByTagName("p")[2];
    div3.textContent = '$' + total + ' JMD';
    receiptItemContainer.appendChild(receiptItem);

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
    console.log('Title: ' + document.title);
    var form = document.getElementById("form");

    //Loads the cart
    loadCart();

    console.log(form);
    if(form !== null)
    {
        form.addEventListener("submit",function(event){
            event.preventDefault();
        });
    }


    if(!isLoggedIn() && (window.location.pathname  !== "/Codes/register.html" && window.location.pathname  !== "/Codes/login.html"))
    {
        console.log("Not logged in");
        window.location.href = "/Codes/login.html";
    }

    if(document.title === 'Store')
        initStore();

    if(document.title === 'Cart')
    {
        populateCartCards();
    }
    if(document.title === 'Checkout')
        populateReceiptRows();
        
});

document.addEventListener('keydown',function(event){
    if(event.key === ' ')
    {
        event.preventDefault();
        setLoggedIn('false');
        alert("event caught");
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
    alert("func called");
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
    var form = document.getElementById("form");

    const [email, password] = form.getElementsByTagName("input");

    let errorMessage = document.getElementById('error-message');
    console.log(errorMessage);
    if(email.value === "")
    {
        errorMessage.textContent = "Enter email";
        return;
    }
    if(password.value === "")
    {
        errorMessage.textContent = "Enter Password";
        return;
    }

    if(!checkEmail(email.value))
    {
        errorMessage.textContent = "Invalid email";
        //alert("Invalid email");
        return;
    }

    if(!validateAccount(email.value,password.value))
    {
        errorMessage.textContent = "Email or Password Incorrect";
        //alert("Email or Password Incorrect");
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

    let errorMessage = document.getElementById('error-message');

    if(!checkEmail(email.value))
    {
        //console.log("invalid email");
        errorMessage.textContent = "Error: Invalid email!";
        //alert();
        return;
    }

    if(email.value === "")
    {
        errorMessage.textContent = "Enter email"
        return;
    }
    if(password.value === "")
    {
        errorMessage.textContent = "Enter Password"
        return;
    }

    if(!checkPasswords(password.value,confirmPassword.value))
    {
        //alert("Error: Passwords don't match!");
        errorMessage.textContent = "Error: Passwords don't match!";
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
    alert("Account created successfully");
    window.location.href = "/Codes/index.html"
}

function addToCart(itemName,price)
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
        cart.push(new CartItem(itemName,price))
    }
    
    updateCartIcon();
    console.log(cart);
    saveCart();
}

function updateCartItem(name, quantity)
{
    for(let item of cart)
    {
        if(item.name === name)
            item.quantity = quantity;
    }
    saveCart();
}

function removeFromCart(itemName)
{
    var i = 0;
    for(const item of cart)
    {
        if(item.name === itemName)
        {
            cart.splice(i,1);
        }
        i++;
    }

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
    window.location.href = "checkout.html";

    /*if(cart.length === 0)
        return;

    let checkoutoverlay = document.getElementById('checkout-overlay');
    let checkout = document.getElementById('checkout');

    console.log("HERE");

    if(checkoutoverlay === null)
    {
        console.error("iframe is null");
        return;
    }
    
    checkoutoverlay.style.display = 'block';
    //reload iframe
    checkout.src += '';*/

}

function closeCheckout()
{
    window.location.href = "cart.html"
}

function goToStore()
{
    window.location.href = "index.html"
}