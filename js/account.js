const SUPABASE_URL = 'https://uniwyjgamivvhefiewvk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SKYxuMy_7x7J-YTb23_94w_Jp4pKYzI';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (selector) => document.querySelector(selector);

let currentUser = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function money(value) {
  return `₦${value.toLocaleString('en-NG')}`;
}

function renderOrders(orders) {
  $('#order-history').innerHTML = orders.map((order) => {
    const date = order.created_at ? new Date(order.created_at) : null;
    const dateText = date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
      : 'Date unavailable';
    const total = Number(order.total);
    return `<li class="order-history-item"><span><strong>Order #${escapeHtml(order.id)}</strong><small>${dateText}</small></span><strong>${Number.isFinite(total) ? money(total) : 'Total unavailable'}</strong></li>`;
  }).join('');
  $('#orders-empty').hidden = orders.length > 0;
}

async function loadOrders(user) {
  const status = $('#orders-status');
  status.hidden = false;
  status.textContent = 'Loading your orders…';
  $('#orders-empty').hidden = true;
  $('#order-history').replaceChildren();

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('id,created_at,total')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (currentUser?.id !== user.id) return;
    status.hidden = true;
    renderOrders(data || []);
  } catch (error) {
    if (currentUser?.id !== user.id) return;
    console.error('Could not load order history:', error);
    status.textContent = 'We could not load your orders. Please try again later.';
  }
}

function updateAccount(session) {
  currentUser = session?.user || null;
  const signedIn = Boolean(currentUser);
  $('#account-signed-out').hidden = signedIn;
  $('#account-signed-in').hidden = !signedIn;

  if (!currentUser) {
    $('#account-email').textContent = '';
    $('#order-history').replaceChildren();
    $('#orders-status').hidden = true;
    $('#orders-empty').hidden = true;
    return;
  }

  $('#account-status').hidden = true;
  $('#account-email').textContent = currentUser.email || 'Signed in';
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  const previousUserId = currentUser?.id;
  updateAccount(session);
  if (currentUser && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || previousUserId !== currentUser.id)) {
    const user = currentUser;
    setTimeout(() => loadOrders(user), 0);
  }
});

$('#account-google-sign-in').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const status = $('#account-status');
  button.disabled = true;
  status.hidden = false;
  status.textContent = 'Connecting to Google…';
  try {
    const redirectTo = new URL('account.html', window.location.href).href;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Google sign-in could not be started:', error);
    status.textContent = 'Google sign-in could not be started. Please try again.';
    button.disabled = false;
  }
});

$('#sign-out').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const status = $('#account-status');
  button.disabled = true;
  status.hidden = false;
  status.textContent = 'Signing out…';
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    status.textContent = 'You have signed out.';
  } catch (error) {
    console.error('Could not sign out:', error);
    status.textContent = 'Sign out could not be completed. Please try again.';
  } finally {
    button.disabled = false;
  }
});
