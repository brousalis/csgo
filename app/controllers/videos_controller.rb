class VideosController < ApplicationController
  def index
    @map    = Surf::Map.find(params[:map_id])
    @videos = Surf::Video.where(map_id: @map.id)
  end
end
