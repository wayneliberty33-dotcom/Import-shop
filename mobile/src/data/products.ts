export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  origin: string;
  tag: string | null;
  image: string;
  description: string;
};

export async function getProducts(): Promise<Product[]> {
  const { supabase } = await import('../../lib/supabase');

  const { data, error } = await supabase
    .from('products')
    .select('id,name,category,price,origin,tag,image,description')
    .order('name');

  if (error) {
    throw error;
  }

  return data ?? [];
}
