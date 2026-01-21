class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  before_save :analyze_sentiment

  private

  def analyze_sentiment
    result = SentimentAnalyzer.analyze(content)
    self.sentiment_score = result[:score]
    self.sentiment_label = result[:label]
  end
end
