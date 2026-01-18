class AddLikesCountToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :likes_count, :integer, default: 0
    
    # Reset cached counts for existing data
    Post.reset_column_information
    Post.find_each do |p|
      Post.reset_counters(p.id, :likes)
    end
  end
end
