class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.references :created_by_user, index: true
      t.references :map, index: true

      t.string     :youtube_url
      t.string     :title

      t.timestamps
    end
  end
end
