class CommentsController < ApplicationController
    before_action :authenticate_user!

    def index
        post = Post.find(params[:post_id])
        comments = post.comments.includes(:user)
        render json: comments.as_json(include: { user: { only: [:id, :email] } })
    end

    def create
      post = Post.find(params[:post_id])
      comment = post.comments.build(comment_params.merge(user: current_user))
      if comment.save
        comment_json = comment.as_json(include: { user: { only: [:id, :email] } }).merge({ sentiment_score: comment.sentiment_score, sentiment_label: comment.sentiment_label })
        CommentsChannel.broadcast_to(post, comment_json)
        render json: comment_json, status: :created
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def comment_params
      params.require(:comment).permit(:content)
    end
end
