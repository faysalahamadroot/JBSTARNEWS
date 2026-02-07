-- Add a text search column to articles
alter table public.articles
add column search_vector tsvector
generated always as (to_tsvector('english', title || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))) stored;

-- Create an index for faster searches
create index articles_search_idx on public.articles using gin (search_vector);

-- Define a function to search articles (optional, but good for RPC calls)
create or replace function search_articles(keyword text)
returns setof public.articles
language sql
as $$
  select *
  from public.articles
  where search_vector @@ plainto_tsquery('english', keyword)
  order by ts_rank(search_vector, plainto_tsquery('english', keyword)) desc;
$$;
