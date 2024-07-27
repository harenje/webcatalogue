import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { Product } from '@prisma/client';

const supabase = createClient();

interface SearchResult {
  products: Product[];
  total: number;
}

async function searchProducts(searchTerm: string, page: number, pageSize: number): Promise<SearchResult> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .or(`productId.ilike.%${searchTerm}%,productName.ilike.%${searchTerm}%`)
    .range(start, end);

  if (error) throw error;
  return { products: data || [], total: count || 0 };
}

export function useProductSearch(searchTerm: string, page: number, pageSize: number): UseQueryResult<SearchResult, Error> {
  return useQuery({
    queryKey: ['productSearch', searchTerm, page, pageSize],
    queryFn: () => searchProducts(searchTerm, page, pageSize),
    enabled: searchTerm.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}