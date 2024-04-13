require 'uri'
require 'net/http'
require 'json'

class FetchDataJob < ApplicationJob
    queue_as :default

    def perform()
        puts 'Fetching data from USGS API'
        uri = URI('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
        response = Net::HTTP.get_response(uri)

        if response.code != '200'
            puts 'Failed to fetch data'
            puts response.code
            puts response.message
            return
        end

        data = JSON.parse(response.body)
        data['features'].each do |feature|

            # Create a new Feature record
            Feature.create(
                feature_id: feature['id'],
                title: feature['properties']['title'],
                mag: feature['properties']['mag'],
                place: feature['properties']['place'],
                time: feature['properties']['time'],
                url: feature['properties']['url'],
                tsunami: feature['properties']['tsunami'],
                magType: feature['properties']['magType'],
                longitude: feature['geometry']['coordinates'][0],
                latitude: feature['geometry']['coordinates'][1]
            )
        end
        puts 'Data fetched successfully'
    end
end