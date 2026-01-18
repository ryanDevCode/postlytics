class AnalyticsController < ApplicationController
  before_action :authenticate_user!

  def index
    # 1. Parameter extraction
    start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : 30.days.ago.to_date
    end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : Date.today
    hashtag_filter = params[:hashtag]

    # 2. Base Scopes
    if current_user.admin?
      posts_scope = Post.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      comments_scope = Comment.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    else
      posts_scope = current_user.posts.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      comments_scope = current_user.comments.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    end
    
    if hashtag_filter.present?
      posts_scope = posts_scope.joins(:hashtags).where(hashtags: { name: hashtag_filter })
      # Filtering comments by hashtag usually means filtering comments on posts with that hashtag, 
      # or comments containing the hashtag. Assuming 'comments on filtered posts' for now for consistency.
      # Note: For user-scoped comments, this might restrict to comments they made on posts with that hashtag.
      if current_user.admin?
         comments_scope = comments_scope.where(post_id: posts_scope.select(:id))
      else
         # For regular users, showing their comments on posts that match the hashtag seems reasonable
         # Or simply ignore hashtag filter for comments table if it gets too complex. 
         # Let's simple filter comments that are on posts with that hashtag.
         comments_scope = comments_scope.joins(:post).merge(Post.joins(:hashtags).where(hashtags: { name: hashtag_filter }))
      end
    end

    # 3. Totals (Global or Filtered)
    total_posts = posts_scope.count
    total_comments = comments_scope.count
    total_hashtags = Hashtag.count # This might be static or filtered depending on need. Keeping static for "global context" 
    # OR if we want hashtags used in this period:
    # total_hashtags = Hashtag.joins(:posts).where(posts: { created_at: start_date..end_date }).distinct.count

    # 4. Daily Stats (Chart Data)
    # We want a unified structure: [{ date, posts, comments }]
    daily_posts = posts_scope.group("DATE(created_at)").count
    daily_comments = comments_scope.group("DATE(created_at)").count

    daily_stats = (start_date..end_date).map do |date|
      d = date.to_s
      {
        date: d,
        posts: daily_posts[date] || 0,
        comments: daily_comments[date] || 0
      }
    end

    # 5. Top Hashtags (Pie Chart / Summary)
    # Filtered by the current date range and posts
    top_hashtags = Hashtag.joins(:posts)
                          .where(posts: { created_at: start_date.beginning_of_day..end_date.end_of_day })
                          .group('hashtags.id')
                          .select('hashtags.name, COUNT(posts.id) as count')
                          .order('count DESC')
                          .limit(5)
                          .map { |h| { name: h.name, count: h.count } }

    # 6. Detailed Lists (Tables)
    # Recent posts in range
    recent_posts = posts_scope.includes(:hashtags, :user)
                              .order(created_at: :desc)
                              .limit(50)
                              .map do |p|
                                {
                                  id: p.id,
                                  content: p.content.truncate(50),
                                  hashtags: p.hashtags.map(&:name),
                                  likes_count: p.respond_to?(:likes_count) ? p.likes_count : 0, # Handle if column missing
                                  created_at: p.created_at,
                                  user: p.user.email # or name
                                }
                              end

    recent_comments = comments_scope.includes(:user, :post)
                                    .order(created_at: :desc)
                                    .limit(50)
                                    .map do |c|
                                      {
                                        id: c.id,
                                        content: c.content.truncate(50),
                                        post_id: c.post_id,
                                        created_at: c.created_at,
                                        user: c.user.email
                                      }
                                    end

    render json: {
      totals: {
        posts: total_posts,
        comments: total_comments,
        hashtags: total_hashtags
      },
      daily_stats: daily_stats,
      top_hashtags: top_hashtags,
      posts: recent_posts,
      comments: recent_comments,
      posts_meta: {
        current_page: 1,
        total_pages: (posts_scope.count / 10.0).ceil,
        total_count: posts_scope.count
      },
      comments_meta: {
        current_page: 1,
        total_pages: (comments_scope.count / 10.0).ceil,
        total_count: comments_scope.count
      }
    }
  end

  def posts
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    offset = (page - 1) * per_page

    scope = if current_user.admin?
      Post.all
    else
      current_user.posts
    end

    if params[:hashtag].present?
      scope = scope.joins(:hashtags).where(hashtags: { name: params[:hashtag] })
    end

    # Date filtering
    start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : 30.days.ago.to_date
    end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : Date.today
    scope = scope.where(created_at: start_date.beginning_of_day..end_date.end_of_day)

    total_count = scope.count
    posts = scope.includes(:hashtags, :user)
                .order(created_at: :desc)
                .offset(offset)
                .limit(per_page)
                .map do |p|
                  {
                    id: p.id,
                    content: p.content.truncate(50),
                    hashtags: p.hashtags.map(&:name),
                    likes_count: p.respond_to?(:likes_count) ? p.likes_count : 0,
                    created_at: p.created_at,
                    user: p.user.email
                  }
                end

    render json: {
      data: posts,
      meta: {
        current_page: page,
        total_pages: (total_count / per_page.to_f).ceil,
        total_count: total_count
      }
    }
  end

  def comments
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    offset = (page - 1) * per_page

    scope = if current_user.admin?
      Comment.all
    else
      current_user.comments
    end

    # Handle hashtag filter for comments (simplified as per index)
    if params[:hashtag].present?
      if current_user.admin?
         posts_with_hashtag = Post.joins(:hashtags).where(hashtags: { name: params[:hashtag] }).select(:id)
         scope = scope.where(post_id: posts_with_hashtag)
      else
         scope = scope.joins(:post).merge(Post.joins(:hashtags).where(hashtags: { name: params[:hashtag] }))
      end
    end

    start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : 30.days.ago.to_date
    end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : Date.today
    scope = scope.where(created_at: start_date.beginning_of_day..end_date.end_of_day)

    total_count = scope.count
    comments = scope.includes(:user, :post)
                   .order(created_at: :desc)
                   .offset(offset)
                   .limit(per_page)
                   .map do |c|
                     {
                       id: c.id,
                       content: c.content.truncate(50),
                       post_id: c.post_id,
                       created_at: c.created_at,
                       user: c.user.email
                     }
                   end

    render json: {
      data: comments,
      meta: {
        current_page: page,
        total_pages: (total_count / per_page.to_f).ceil,
        total_count: total_count
      }
    }
  end
end
