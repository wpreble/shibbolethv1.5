-- Shibboleth Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Queries table: stores unique topics that have been queried
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  topic_hash VARCHAR(64) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  query_count INTEGER DEFAULT 1,
  UNIQUE(topic_hash)
);

-- Indexes for queries table
CREATE INDEX idx_queries_hash ON queries(topic_hash);
CREATE INDEX idx_queries_category ON queries(category);
CREATE INDEX idx_queries_created_at ON queries(created_at);
CREATE INDEX idx_queries_count ON queries(query_count DESC);

-- Responses table: stores AI model responses for each query
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  model VARCHAR(100) NOT NULL,
  verdict VARCHAR(20) NOT NULL CHECK (verdict IN ('GOOD', 'BAD', 'REFUSED', 'ERROR')),
  latency_ms INTEGER,
  raw_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for responses table
CREATE INDEX idx_responses_query ON responses(query_id);
CREATE INDEX idx_responses_model ON responses(model);
CREATE INDEX idx_responses_verdict ON responses(verdict);
CREATE INDEX idx_responses_created_at ON responses(created_at);

-- Aggregation view for query summaries
CREATE OR REPLACE VIEW query_summary AS
SELECT
  q.id,
  q.topic,
  q.category,
  q.query_count,
  q.created_at,
  COUNT(DISTINCT r.verdict) as verdict_diversity,
  SUM(CASE WHEN r.verdict = 'GOOD' THEN 1 ELSE 0 END) as good_count,
  SUM(CASE WHEN r.verdict = 'BAD' THEN 1 ELSE 0 END) as bad_count,
  SUM(CASE WHEN r.verdict = 'REFUSED' THEN 1 ELSE 0 END) as refused_count,
  SUM(CASE WHEN r.verdict = 'ERROR' THEN 1 ELSE 0 END) as error_count
FROM queries q
LEFT JOIN responses r ON q.id = r.query_id
GROUP BY q.id;

-- Row Level Security (RLS) policies
-- Enable RLS
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access to queries" ON queries
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access to responses" ON responses
  FOR SELECT USING (true);

-- Allow insert from authenticated service role
CREATE POLICY "Allow service role insert to queries" ON queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role insert to responses" ON responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role update to queries" ON queries
  FOR UPDATE USING (true);

-- Function to increment query count
CREATE OR REPLACE FUNCTION increment_query_count(query_topic_hash VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE queries
  SET query_count = query_count + 1
  WHERE topic_hash = query_topic_hash;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending topics
CREATE OR REPLACE FUNCTION get_trending_topics(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  topic TEXT,
  category VARCHAR(50),
  query_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT q.id, q.topic, q.category, q.query_count
  FROM queries q
  ORDER BY q.query_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
