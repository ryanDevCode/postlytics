class AddSentimentAnalysisToPostsAndComments < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :sentiment_score, :float
    add_column :posts, :sentiment_label, :string
    
    add_column :comments, :sentiment_score, :float
    add_column :comments, :sentiment_label, :string
  end
end
