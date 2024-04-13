class CommentsController < ApplicationController
  before_action :get_feature

  # GET /comments
  def index
    @comments = @feature.comments

    render json: @comments
  end

  # POST /comments
  def create
    @comment = @feature.comments.build(comment_params)

    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  private
    # Only allow a list of trusted parameters through.
    def comment_params
      params.require(:comment).permit(:body)
    end

    def get_feature
      @feature = Feature.find(params[:feature_id])
    end
end
