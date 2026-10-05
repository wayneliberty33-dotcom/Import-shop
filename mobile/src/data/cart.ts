import { supabase } from '../../lib/supabase';

export type CartItem = {
  product_id: string;
  quantity: number;
};

export async function getCart(): Promise<CartItem[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to use the cart.');
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('product_id,quantity')
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to use the cart.');
  }

  const { data: existing, error: existingError } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const newQuantity = (existing?.quantity ?? 0) + quantity;

  const { error } = await supabase.from('cart_items').upsert(
    {
      user_id: user.id,
      product_id: productId,
      quantity: newQuantity,
    },
    {
      onConflict: 'user_id,product_id',
    },
  );

  if (error) {
    throw error;
  }
}
export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to use the cart.');
  }

  if (quantity <= 0) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        quantity,
      },
      {
        onConflict: 'user_id,product_id',
      },
    );

  if (error) {
    throw error;
  }
}