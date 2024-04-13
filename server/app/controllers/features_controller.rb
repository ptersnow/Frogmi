class FeaturesController < ApplicationController

  # GET /features
  def index

    per_page = 1000
    if params[:per_page] && params[:per_page].to_i <= 1000
        per_page = params[:per_page]
    end

    page = params[:page] || 1

    mag_type = params[:mag_type] || nil

    if mag_type
        @features = Feature.where(magType: mag_type).paginate(page: page, per_page: per_page)
    else
        @features = Feature.paginate(page: page, per_page: per_page)
    end

    resp = {
        "data" => @features.parsed,
        "pagination" => pagination_dict(@features, per_page)
    }

    render json: resp

  end

  # GET /features/1
  def show
    @feature = Feature.find(params[:id])
    render json: @feature, :include => :comments
  end

  private
    # Only allow a list of trusted parameters through.
    def feature_params
      params.fetch(:feature, {})
    end
end
