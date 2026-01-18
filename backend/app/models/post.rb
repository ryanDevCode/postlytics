class Post < ApplicationRecord
  belongs_to :user

  has_many :comments, dependent: :destroy
  has_many :post_hashtags, dependent: :destroy
  has_many :hashtags, through: :post_hashtags
  has_many :likes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy

  after_save :extract_and_save_hashtags

  private

  def extract_and_save_hashtags
    return unless content.present?
    
    # Extract hashtags
    tags = content.scan(/#\w+/).map { |t| t.downcase.delete('#') }.uniq

    # Find or create hashtags
    tags.each do |tag_name|
      hashtag = Hashtag.find_or_create_by(name: tag_name)
      hashtags << hashtag unless hashtags.include?(hashtag)
    end
  end
end
