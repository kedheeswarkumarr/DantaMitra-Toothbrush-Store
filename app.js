const products = [
 {id:1,name:"Mint Fresh Toothpaste",category:"Toothpaste",desc:"Fresh mint · Everyday protection",price:149,oldPrice:179,tag:"BESTSELLER",emoji:"🪥",bg:"art-bg-1"},
 {id:2,name:"Soft Care Toothbrush",category:"Brushes",desc:"Soft bristles · Gentle cleaning",price:99,oldPrice:null,tag:"GENTLE CARE",emoji:"🪥",bg:"art-bg-2"},
 {id:3,name:"Everyday Dental Floss",category:"Floss",desc:"Helps clean between teeth",price:129,oldPrice:null,tag:"DAILY ESSENTIAL",emoji:"🧵",bg:"art-bg-3"},
 {id:4,name:"Smile Care Travel Kit",category:"Accessories",desc:"Compact care for on-the-go",price:299,oldPrice:349,tag:"TRAVEL PICK",emoji:"🧳",bg:"art-bg-4"},
 {id:5,name:"Fresh Breath Mouthwash",category:"Accessories",desc:"A refreshing finish to your routine",price:189,oldPrice:null,tag:"FRESH FEEL",emoji:"🧴",bg:"art-bg-5"},
 {id:6,name:"Interdental Brush Set",category:"Floss",desc:"For those hard-to-reach spaces",price:219,oldPrice:null,tag:"SMART CLEAN",emoji:"✨",bg:"art-bg-6"},
 {id:7,name:"Sensitive Care Toothpaste",category:"Toothpaste",desc:"Everyday care for sensitive teeth",price:179,oldPrice:null,tag:"COMFORT PICK",emoji:"🦷",bg:"art-bg-7"},
 {id:8,name:"Bamboo Toothbrush",category:"Brushes",desc:"A simple addition to your routine",price:129,oldPrice:null,tag:"MINDFUL PICK",emoji:"🌿",bg:"art-bg-8"}
];
let activeCategory = "All";
let cart = [];
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const rupees = n => "₹" + n.toLocaleString("en-IN");
function renderProducts(){
 const q = searchInput.value.trim().toLowerCase();
 const filtered = products.filter(p => (activeCategory==="All" || p.category===activeCategory) && (p.name+" "+p.desc+" "+p.category).toLowerCase().includes(q));
 grid.innerHTML = filtered.length ? filtered.map(p=>`<article class="product-card">
   <div class="product-art ${p.bg}"><span class="tag">${p.tag}</span><span class="shape product-emoji" aria-hidden="true">${p.emoji}</span><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div>
   <p class="product-name">${p.name}</p><p class="product-desc">${p.desc}</p>
   <div class="product-bottom"><span class="price">${rupees(p.price)} ${p.oldPrice?`<small><s>${rupees(p.oldPrice)}</s></small>`:""}</span><span class="rating">★ 4.8 <span style="color:#9aa59d">(demo)</span></span></div>
 </article>`).join("") : `<div class="empty-results"><p>No products found.</p><button class="button primary" id="resetSearch">View all products</button></div>`;
}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});renderCart();showToast("Added to your smile kit");}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();}
function renderCart(){
 const count=cart.reduce((n,x)=>n+x.qty,0);
 document.getElementById("cartCount").textContent=count;
 document.getElementById("drawerCount").textContent=`(${count})`;
 document.getElementById("cartEmpty").hidden=count>0;
 document.getElementById("cartSummary").hidden=count===0;
 document.getElementById("cartItems").innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-line"><div class="cart-thumb ${p.bg}">${p.emoji}</div><div class="cart-line-info"><strong>${p.name}</strong><small>${rupees(p.price)} each</small><div class="qty"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div class="line-price">${rupees(p.price*x.qty)}</div></div>`}).join("");
 document.getElementById("subtotal").textContent=rupees(cart.reduce((n,x)=>n+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");document.getElementById("cartOverlay").hidden=false;document.body.style.overflow="hidden";}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");document.getElementById("cartOverlay").hidden=true;document.body.style.overflow="";}
let toastTimer;function showToast(msg){const toast=document.getElementById("toast");toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
document.getElementById("categoryRow").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
searchInput.addEventListener("input",renderProducts);
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));if(e.target.closest("#resetSearch")){searchInput.value="";activeCategory="All";document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x.dataset.category==="All"));renderProducts();}});
document.getElementById("openCart").addEventListener("click",openCart);document.getElementById("closeCart").addEventListener("click",closeCart);document.getElementById("cartOverlay").addEventListener("click",closeCart);document.getElementById("continueShopping").addEventListener("click",closeCart);
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(b)changeQty(Number(b.dataset.qty),Number(b.dataset.delta));});
document.getElementById("checkoutButton").addEventListener("click",()=>{showToast("Demo checkout only — no payment collected");});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
renderProducts();renderCart();