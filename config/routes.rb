Rails.application.routes.draw do
  mount API::Base, at: "/"
  mount GrapeSwaggerRails::Engine, at: "/documentation"

  get '/api/csrf', to: 'csrf#index'

  devise_for :users, controllers: { sessions: 'sessions' }
  
  resources :maps, only: [ :index, :show ] do
    post 'like'

    resources :videos, only: [ :index ]
  end

  root to: 'site#index'
end
