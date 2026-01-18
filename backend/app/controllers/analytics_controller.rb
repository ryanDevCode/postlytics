class AnalyticsController < ApplicationController
  before_action :authenticate_user!

  def index
    # Post Activity (Last 7 days)
    daily_posts = Post.where('created_at >= ?', 7.days.ago)
                      .group("DATE(created_at)")
                      .count
                      .map { |date, count| { date: date.to_s, count: count } }
                      .sort_by { |item| item[:date] }

    # Fill in missing days with 0
    (0..6).map { |i| i.days.ago.to_date.to_s }.reverse.each do |date|
      unless daily_posts.any? { |item| item[:date] == date }
        daily_posts << { date: date, count: 0 }
      end
    end
    daily_posts.sort_by! { |item| item[:date] }


    # Top Hashtags
    top_hashtags = Hashtag.joins(:posts)
                          .group('hashtags.id')
                          .select('hashtags.name, COUNT(posts.id) as count')
                          .order('count DESC')
                          .limit(5)
                          .map { |h| { name: h.name, count: h.count } }

    render json: {
      daily_posts: daily_posts,
      top_hashtags: top_hashtags
    }
  end
end
