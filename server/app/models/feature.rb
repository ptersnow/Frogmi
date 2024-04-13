class Feature < ApplicationRecord
    has_many :comments, dependent: :destroy

    validates :feature_id, uniqueness: true
    validates :title, :url, :place, :magType, :longitude, :latitude, presence: true
    validates :mag, numericality: { greater_than_or_equal_to: -1.0, less_than_or_equal_to: 10.0 }
    validates :latitude, numericality: { greater_than_or_equal_to: -90.0, less_than_or_equal_to: 90.0 }
    validates :longitude, numericality: { greater_than_or_equal_to: -180.0, less_than_or_equal_to: 180.0 }

    def as_json(options = {})
        #hash = super(options)
        hash = {
            "id" => self.id,
            "type" => "feature",
            "attributes" => {
                "external_id" => self.feature_id,
                "magnitude" => self.mag,
                "place" => self.place,
                "time" => self.time,
                "tsunami" => self.tsunami,
                "mag_type" => self.magType,
                "title" => self.title,
                "coordinates" => {
                    "longitude" => self.longitude,
                    "latitude" => self.latitude
                }
            },
            "links" => {
                "external_url" => self.url
            }
        }
    end    
end