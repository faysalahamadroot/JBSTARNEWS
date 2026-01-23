-- Insert new categories ensuring no duplicates
INSERT INTO categories (name, slug) VALUES
('Science', 'science'),
('Health', 'health'),
('Climate', 'climate'),
('Opinion', 'opinion'),
('Sports', 'sports'),
('Video', 'video')
ON CONFLICT (slug) DO NOTHING;
