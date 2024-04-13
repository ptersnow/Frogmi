class ApplicationController < ActionController::API
    def pagination_dict(object, per_page)
        {
            current_page: object.current_page,
            total: object.total_entries,
            per_page: per_page
        }
    end
end
