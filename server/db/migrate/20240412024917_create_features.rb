class CreateFeatures < ActiveRecord::Migration[7.1]
    def change
        create_table :features do |t|
            t.float :mag
            t.string :url
            t.bigint :time
            t.string :place
            t.string :title
            t.integer :tsunami
            t.string :magType
            t.float :latitude
            t.float :longitude
            t.string :feature_id
            t.timestamps
        end
    end
end
