class SentimentAnalyzer
  def self.analyze(text)
    return { score: 0.0, label: 'neutral' } if text.blank?

    # Simple keyword-based analysis for MVP
    # In a real app, this would call an OpenAI/Anthropic API
    
    positive_words = %w[good great awesome amazing love like best happy excellent]
    negative_words = %w[bad terrible awful hate dislike worst sad poor]
    
    normalized_text = text.downcase
    
    score = 0
    words = normalized_text.split(/\s+/)
    
    words.each do |word|
      score += 1 if positive_words.include?(word)
      score -= 1 if negative_words.include?(word)
    end
    
    # Normalize score between -1 and 1
    final_score = score.clamp(-5, 5) / 5.0
    
    label = if final_score > 0.3
              'positive'
            elsif final_score < -0.3
              'negative'
            else
              'neutral'
            end
            
    { score: final_score, label: label }
  end
end
