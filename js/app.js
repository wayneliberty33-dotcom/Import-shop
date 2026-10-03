const SUPABASE_URL = 'https://uniwyjgamivvhefiewvk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SKYxuMy_7x7J-YTb23_94w_Jp4pKYzI';
const OAUTH_REDIRECT_URL = 'https://wayneliberty33-dotcom.github.io/Import-shop/';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const products = [
  {
    id: 'sewing-machine',
    name: 'Portable Sewing Machine',
    category: 'Sewing',
    price: 85,
    origin: 'Imported',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=82',
    description: 'A compact sewing machine for everyday repairs, small clothing projects, and home-based sewing businesses.'
  },
  {
    id: 'thread-machine',
    name: 'Industrial Thread Machine',
    category: 'Sewing',
    price: 145,
    origin: 'Imported',
    tag: 'Business',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=82',
    description: 'A practical machine designed for frequent sewing work and small production businesses.'
  },

  {
    id: 'nail-drill',
    name: 'Professional Nail Drill',
    category: 'Beauty',
    price: 48,
    origin: 'Imported',
    tag: 'Beauty',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=82',
    description: 'Adjustable-speed nail drill suitable for manicures, pedicures, nail preparation, and salon use.'
  },
  {
    id: 'nail-lamp',
    name: 'UV LED Nail Lamp',
    category: 'Beauty',
    price: 35,
    origin: 'Imported',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=82',
    description: 'Fast-curing LED nail lamp for gel polish, home nail care, and professional beauty work.'
  },

  {
    id: 'heat-sealer',
    name: 'Impulse Heat Sealer',
    category: 'Packaging',
    price: 55,
    origin: 'Imported',
    tag: 'Small Business',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=82',
    description: 'A compact sealing machine for closing plastic bags, food packaging, and small retail products.'
  },
  {
    id: 'vacuum-sealer',
    name: 'Compact Vacuum Sealer',
    category: 'Packaging',
    price: 72,
    origin: 'Imported',
    tag: 'Practical',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=82',
    description: 'Useful for keeping food and products sealed, organized, and protected during storage.'
  },

  {
    id: 'heat-press',
    name: 'Digital Heat Press Machine',
    category: 'HeatPress',
    price: 185,
    origin: 'Imported',
    tag: 'Business',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=82',
    description: 'Digital heat press for transferring designs onto T-shirts, bags, fabrics, and other suitable materials.'
  },
  {
    id: 'mini-heat-press',
    name: 'Mini Heat Press',
    category: 'HeatPress',
    price: 65,
    origin: 'Imported',
    tag: 'Compact',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=82',
    description: 'Small and convenient heat press for crafts, personalized gifts, small clothing projects, and home businesses.'
  },

  {
    id: 'label-printer',
    name: 'Thermal Label Printer',
    category: 'Printing',
    price: 95,
    origin: 'Imported',
    tag: 'Business',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=82',
    description: 'Compact thermal printer for shipping labels, product labels, receipts, and small-business packaging.'
  },
  {
    id: 'label-maker',
    name: 'Portable Label Maker',
    category: 'Printing',
    price: 42,
    origin: 'Imported',
    tag: 'Handy',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=82',
    description: 'Portable labeling tool for organizing products, storage boxes, shelves, packages, and everyday items.'
  },

  {
    id: 'tool-kit',
    name: 'Multi-Purpose Tool Kit',
    category: 'Tools',
    price: 68,
    origin: 'Imported',
    tag: 'Workshop',
    image: 'https://images.unsplash.com/photo-1581147036324-c1c0c0e0c6b3?auto=format&fit=crop&w=800&q=82',
    description: 'A useful collection of everyday hand tools for repairs, maintenance, assembly, and workshop projects.'
  },
  {
    id: 'cordless-drill',
    name: 'Cordless Power Drill',
    category: 'Tools',
    price: 110,
    origin: 'Imported',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=82',
    description: 'Rechargeable drill for household repairs, furniture assembly, DIY projects, and workshop tasks.'
  },

  {
    id: 'electric-cooker',
    name: 'Portable Electric Cooker',
    category: 'Kitchen',
    price: 58,
    origin: 'Imported',
    tag: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=82',
    description: 'Compact electric cooker designed for everyday cooking in homes, small kitchens, and food businesses.'
  },
  {
    id: 'food-chopper',
    name: 'Electric Food Chopper',
    category: 'Kitchen',
    price: 45,
    origin: 'Imported',
    tag: 'Everyday',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=82',
    description: 'Convenient kitchen helper for chopping vegetables, herbs, meat, and other ingredients.'
  },

  {
    id: 'digital-scale',
    name: 'Digital Kitchen Scale',
    category: 'Electronics',
    price: 28,
    origin: 'Imported',
    tag: 'Useful',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=82',
    description: 'Accurate digital scale for cooking, baking, portioning, packaging, and small-business use.'
  },
  {
    id: 'usb-lamp',
    name: 'Rechargeable LED Work Lamp',
    category: 'Electronics',
    price: 32,
    origin: 'Imported',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=82',
    description: 'Portable rechargeable LED light for desks, workshops, emergency use, and everyday tasks.'
  },

  {
    id: 'storage-box',
    name: 'Stackable Storage Box Set',
    category: 'Household',
    price: 36,
    origin: 'Imported',
    tag: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=82',
    description: 'Practical storage boxes for organizing clothes, household items, supplies, and small products.'
  },
  {
    id: 'cleaning-set',
    name: 'Home Cleaning Tool Set',
    category: 'Household',
    price: 40,
    origin: 'Imported',
    tag: 'Practical',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=82',
    description: 'A useful collection of cleaning tools for keeping kitchens, rooms, offices, and workspaces tidy.'
  }
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let activeCategory = 'All';
let cart = loadCart();
let toastTimer;

function loadCart(){try{return JSON.parse(localStorage.getItem('parcel-pine-cart'))||{}}catch{return {}}}
function saveCart(){localStorage.setItem('parcel-pine-cart',JSON.stringify(cart));renderCart()}
function money(value){return `$${value.toFixed(2)}`}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
async function createOrder(customerEmail,total){
  const {data:{session},error:sessionError}=await supabaseClient.auth.getSession();
  if(sessionError)throw sessionError;
  const order={customer_email:customerEmail,total};
  const accessToken=session?.access_token;
  if(session?.user?.id)order.user_id=session.user.id;
  const response=await fetch(`${SUPABASE_URL}/rest/v1/orders`,{method:'POST',headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${accessToken||SUPABASE_PUBLISHABLE_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(order)});
  if(!response.ok){const result=await response.json().catch(()=>({}));throw new Error(`Order insert failed (HTTP ${response.status}${result.code?`, ${result.code}`:''})`)}
}
function renderProducts(){
  const query=$('#product-search').value.trim().toLowerCase();
  let shown=products.filter(p=>(activeCategory==='All'||p.category===activeCategory)&&(!query||`${p.name} ${p.category} ${p.origin} ${p.description}`.toLowerCase().includes(query)));
  const sort=$('#sort-products').value;
  if(sort==='low')shown.sort((a,b)=>a.price-b.price);if(sort==='high')shown.sort((a,b)=>b.price-a.price);if(sort==='az')shown.sort((a,b)=>a.name.localeCompare(b.name));
  $('#product-grid').innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image" data-detail="${p.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(p.name)} details"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">${p.tag?`<span class="product-badge">${escapeHtml(p.tag)}</span>`:''}<button class="quick-add" data-add="${p.id}" aria-label="Add ${escapeHtml(p.name)} to bag">+</button></div><div class="product-meta"><h3 class="product-name">${escapeHtml(p.name)}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-origin">${escapeHtml(p.origin)}</p></article>`).join('');
  $('#result-count').textContent=`Showing ${shown.length} ${shown.length===1?'little favorite':'little favorites'}`;$('#empty-state').hidden=shown.length>0;$('#product-grid').hidden=shown.length===0;
}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);const count=entries.reduce((sum,[,qty])=>sum+qty,0);const total=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
  $('.cart-count').textContent=count;$('.drawer-count').textContent=`(${count})`;$('#cart-total').textContent=money(total);$('#cart-items').innerHTML=entries.map(([id,qty])=>{const p=products.find(item=>item.id===id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${escapeHtml(p.name)}</h3><span class="origin">${escapeHtml(p.origin)}</span><div class="quantity-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease ${escapeHtml(p.name)} quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase ${escapeHtml(p.name)} quantity">+</button></div></div><div><span class="cart-item-price">${money(p.price*qty)}</span><button class="remove-item" data-remove="${id}">Remove</button></div></div>`}).join('');
  $('#cart-empty').hidden=count>0;$('#cart-footer').hidden=count===0;$('#shipping-message').textContent=total>=75?'You unlocked free US shipping ✳':`You're ${money(75-total)} away from free shipping ✳`;
}
function addToCart(id,qty=1){cart[id]=(cart[id]||0)+qty;saveCart();showToast(`${products.find(p=>p.id===id).name} added to your bag`)}
function openOverlay(){const overlay=$('#overlay');overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('show'))}
function closeAll(){const drawer=$('#cart-drawer');drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');$('#overlay').classList.remove('show');setTimeout(()=>$('#overlay').hidden=true,250);$$('.modal-wrap').forEach(m=>m.hidden=true);document.body.style.overflow=''}
function openCart(){openOverlay();$('#cart-drawer').classList.add('open');$('#cart-drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function openProduct(id){const p=products.find(item=>item.id===id);$('#modal-product').innerHTML=`<img src="${p.image}" alt="${escapeHtml(p.name)}"><div><p class="eyebrow">${escapeHtml(p.category)} · ${escapeHtml(p.origin)}</p><h2>${escapeHtml(p.name)}</h2><span class="modal-price">${money(p.price)}</span><p class="description">${escapeHtml(p.description)}</p><span class="modal-origin">Thoughtfully sourced · Ships with care</span><br><button class="button button-dark" data-add="${p.id}">Add to bag <span>↗</span></button></div>`;openOverlay();$('#product-modal').hidden=false;document.body.style.overflow='hidden'}
function openCheckout(){if(!Object.keys(cart).length)return;const subtotal=Object.entries(cart).reduce((s,[id,q])=>s+products.find(p=>p.id===id).price*q,0);$('#checkout-summary').textContent=`Your finds total ${money(subtotal)}${subtotal>=75?' · free US shipping':''}.`;$('#checkout-modal').hidden=false;document.body.style.overflow='hidden'}
let currentUser=null;
function renderOrderHistory(orders){
  $('#order-history').innerHTML=orders.map(order=>{
    const date=order.created_at?new Date(order.created_at):null;
    const dateText=date&&!Number.isNaN(date.getTime())?new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(date):'Date unavailable';
    const total=Number(order.total);
    return `<li class="order-history-item"><span><strong>Order #${escapeHtml(order.id)}</strong><small>${dateText}</small></span><strong>${Number.isFinite(total)?money(total):'Total unavailable'}</strong></li>`;
  }).join('');
  $('#orders-empty').hidden=orders.length>0;
}
async function loadOrders(user){
  const status=$('#orders-status');
  status.hidden=false;
  status.textContent='Loading your orders…';
  $('#orders-empty').hidden=true;
  try{
    const {data,error}=await supabaseClient.from('orders').select('id,created_at,total').eq('user_id',user.id).order('created_at',{ascending:false});
    if(error)throw error;
    if(currentUser?.id!==user.id)return;
    status.hidden=true;
    renderOrderHistory(data||[]);
  }catch(error){
    if(currentUser?.id!==user.id)return;
    console.error('Could not load order history:',error);
    status.textContent='We could not load your orders. Please try again later.';
    $('#order-history').replaceChildren();
  }
}
$('.product-grid').addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){e.stopPropagation();addToCart(add.dataset.add);return}const detail=e.target.closest('[data-detail]');if(detail)openProduct(detail.dataset.detail)});
$('.product-grid').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){e.preventDefault();openProduct(e.target.dataset.detail)}});
$$('.category-chip').forEach(btn=>btn.addEventListener('click',()=>{$$('.category-chip').forEach(b=>b.classList.toggle('active',b===btn));activeCategory=btn.dataset.category;renderProducts()}));
$('#product-search').addEventListener('input',renderProducts);$('#sort-products').addEventListener('change',renderProducts);
$('#clear-filters').addEventListener('click',e=>{e.preventDefault();activeCategory='All';$('#product-search').value='';$$('.category-chip').forEach(b=>b.classList.toggle('active',b.dataset.category==='All'));renderProducts()});
$('#reset-search').addEventListener('click',()=>{$('#product-search').value='';activeCategory='All';$$('.category-chip').forEach(b=>b.classList.toggle('active',b.dataset.category==='All'));renderProducts()});
$$('[data-nav-category]').forEach(link=>link.addEventListener('click',()=>{activeCategory=link.dataset.navCategory;$$('.category-chip').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));renderProducts();$('.main-nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
$('.cart-trigger').addEventListener('click',openCart);$('.close-button').addEventListener('click',closeAll);$('#overlay').addEventListener('click',closeAll);$('.continue-shopping').addEventListener('click',closeAll);$('.checkout-open').addEventListener('click',openCheckout);$$('.modal-close').forEach(btn=>btn.addEventListener('click',closeAll));
$('#cart-items').addEventListener('click',e=>{const q=e.target.closest('[data-qty]');if(q){const id=q.dataset.qty;cart[id]=(cart[id]||0)+Number(q.dataset.delta);if(cart[id]<=0)delete cart[id];saveCart();return}const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];saveCart()}});
$('#modal-product').addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){addToCart(add.dataset.add);closeAll()}});
$('.menu-toggle').addEventListener('click',e=>{const button=e.currentTarget;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');$('.main-nav').classList.toggle('open',open)});
$('.search-open').addEventListener('click',()=>{$('#product-search').focus();document.querySelector('#shop').scrollIntoView({behavior:'smooth'})});
$('#mobile-filter').addEventListener('click',()=>{$('.shop-controls').classList.toggle('mobile-open');if($('.shop-controls').classList.contains('mobile-open'))$('#product-search').focus()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
supabaseClient.auth.onAuthStateChange((event,session)=>{
  const previousUserId=currentUser?.id;
  currentUser=session?.user||null;
  $('#google-sign-in').hidden=Boolean(currentUser);
  $('#account-signed-out').hidden=Boolean(currentUser);
  $('#account-signed-in').hidden=!currentUser;
  if(!currentUser){
    $('#account-email').textContent='';
    $('#order-history').replaceChildren();
    $('#orders-status').hidden=true;
    $('#orders-empty').hidden=true;
    return;
  }
  $('#account-email').textContent=currentUser.email||'Signed in';
  if(event==='INITIAL_SESSION'||event==='SIGNED_IN'||previousUserId!==currentUser.id){
    const user=currentUser;
    setTimeout(()=>loadOrders(user),0);
  }
});
$('#sign-out').addEventListener('click',async e=>{
  const button=e.currentTarget;
  button.disabled=true;
  try{
    const {error}=await supabaseClient.auth.signOut();
    if(error)throw error;
    showToast('You have signed out.');
  }catch(error){
    console.error('Could not sign out:',error);
    showToast('Sign out could not be completed. Please try again.');
  }finally{
    button.disabled=false;
  }
});
$$('.google-sign-in').forEach(button=>button.addEventListener('click',async e=>{
  const button=e.currentTarget;
  button.disabled=true;
  try{
    const {error}=await supabaseClient.auth.signInWithOAuth({provider:'google',options:{redirectTo:OAUTH_REDIRECT_URL}});
    if(error)throw error;
  }catch(error){
    console.error('Google sign-in could not be started:',error);
    showToast('Google sign-in could not be started. Please try again.');
    button.disabled=false;
  }
}));
$('#checkout-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  if(!form.reportValidity())return;
  const customerEmail=new FormData(form).get('email').trim();
  const total=Object.entries(cart).reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
  const submitButton=form.querySelector('[type="submit"]');
  const status=$('#checkout-status');
  submitButton.disabled=true;
  status.hidden=false;
  status.textContent='Saving your order…';
  try{
    await createOrder(customerEmail,total);
    cart={};
    saveCart();
    closeAll();
    form.reset();
    status.textContent='';
    status.hidden=true;
    showToast('Your order has been saved. Thank you!');
  }catch(error){
    console.error(error);
    status.textContent='We could not save your order. Please try again in a moment.';
  }finally{
    submitButton.disabled=false;
  }
});
$('#newsletter-form').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('#newsletter-email');
  if(!email.reportValidity())return;
  const button=form.querySelector('button[type="submit"]');
  button.disabled=true;
  button.textContent='Sending…';
  try{
    const response=await fetch('/api/send-email',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email:email.value.trim()})
    });
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||'Email could not be sent');
    showToast('You’re on the list. Check your inbox!');
    form.reset();
  }catch(error){
    console.error('Newsletter email failed:',error);
    showToast('We could not send the email. Please try again.');
  }finally{
    button.disabled=false;
    button.innerHTML='Count me in <span>↗</span>';
  }
});
renderProducts();renderCart();
