class Surf::Video < ActiveRecord::Base
  acts_as_votable

  belongs_to :created_by_user, class_name: 'User'
  belongs_to :map

  self.table_name = 'videos'
end
