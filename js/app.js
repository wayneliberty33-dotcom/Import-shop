const SUPABASE_URL = 'https://uniwyjgamivvhefiewvk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SKYxuMy_7x7J-YTb23_94w_Jp4pKYzI';
const OAUTH_REDIRECT_URL = 'https://wayneliberty33-dotcom.github.io/Import-shop/';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const products = [
  {id:'glass-cup',name:'Sunday Glass Cup',category:'Home',price:18,origin:'Made in Japan',tag:'Bestseller',image:'assets/sunday-glass-cup.svg',description:'A beautifully simple glass for slow mornings and long lunches. Made from sturdy, recycled glass with a softly rounded silhouette.'},
  {id:'incense',name:'Hinoki Incense Set',category:'Home',price:24,origin:'Made in Japan',tag:'Small batch',image:'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=82',description:'A quiet, woodsy ritual for the end of the day. Notes of hinoki, cedar, and a hint of citrus, hand-rolled in Kyoto.'},
  {id:'hand-cream',name:'Dewdrop Hand Cream',category:'Beauty',price:16,origin:'Made in South Korea',tag:'',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=82',description:'A light, quick-absorbing cream with shea butter and green tea. Leaves hands soft, never sticky, with a gentle botanical scent.'},
  {id:'tea',name:'Yuzu Green Tea',category:'Pantry',price:14,origin:'Grown in Japan',tag:'Staff favorite',image:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=82',description:'Bright yuzu peel meets mellow green tea in this lovely afternoon cup. Packed in compostable sachets by a family tea house.'},
  {id:'linen-towel',name:'Waffle Linen Towel',category:'Home',price:32,origin:'Made in Lithuania',tag:'',image:'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=82',description:'A soft, quick-drying linen-cotton waffle towel that gets even lovelier with every wash. Woven in a small family mill.'},
  {id:'face-oil',name:'Camellia Face Oil',category:'Beauty',price:29,origin:'Made in South Korea',tag:'New',image:'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=82',description:'A few drops of cold-pressed camellia oil bring a dewy glow. Fragrance-free, wonderfully simple, and suited to every skin type.'},
  {id:'chili-crisp',name:'Crispy Chili Crunch',category:'Pantry',price:12,origin:'Made in Taiwan',tag:'A little spicy',image:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=82',description:'Crunchy shallots, toasted garlic, and just the right amount of heat. Spoon it over noodles, eggs, rice, or absolutely everything.'},
  {id:'market-tote',name:'Everywhere Market Tote',category:'Accessories',price:26,origin:'Made in Portugal',tag:'',image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=82',description:'A sturdy everyday carryall in heavyweight organic cotton. Room for the farmers market, a good book, and a few happy accidents.'}
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
