import scrapy
import json
import urllib.parse

urls = [ "https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGjCAYgBAZgBMbgBB8gBDNgBAegBAfgBApICAXmoAgM;sid=42c00490580727b069ff64b6ab112e2c;checkin_month=12&checkin_monthday=16&checkin_year=2017&checkout_month=12&checkout_monthday=17&checkout_year=2017&class_interval=1&dest_id=-3035173&dest_type=city&dtdisc=0&from_sf=1&group_adults=2&group_children=0&inac=0&index_postcard=0&label_click=undef&no_rooms=1&offset=0&oos_flag=0&postcard=0&raw_dest_type=city&room1=A%2CA&sb_price_type=total&search_selected=1&src=index&src_elem=sb&ss=Voronezh%2C%20Voronezh%20Region%2C%20Russia&ss_all=0&ss_raw=voronezh&ssb=empty&sshis=0&offset=",
"https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGjCAYgBAZgBMbgBB8gBDNgBAegBAfgBApICAXmoAgM;sid=42c00490580727b069ff64b6ab112e2c;checkin_month=12&checkin_monthday=16&checkin_year=2017&checkout_month=12&checkout_monthday=17&checkout_year=2017&class_interval=1&dest_id=-3035173&dest_type=city&dtdisc=0&from_sf=1&group_adults=2&group_children=0&inac=0&index_postcard=0&label_click=undef&no_rooms=1&offset=0&oos_flag=0&postcard=0&raw_dest_type=city&room1=A%2CA&sb_price_type=total&search_selected=1&src=index&src_elem=sb&ss=Voronezh%2C%20Voronezh%20Region%2C%20Russia&ss_all=0&ss_raw=voronezh&ssb=empty&sshis=0&offset=30"]

class BookingSpider(scrapy.Spider):
    name = "booking"
    def start_requests(self):
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for hotel in response.css('.sr_item'):
            href = hotel.css('.hotel_name_link::attr(href)').extract_first().strip()
            yield {
                'name': hotel.css('.sr-hotel__name::text').extract_first(),
                'href': href
            }
            yield scrapy.Request(url=urllib.parse.urljoin('https://www.booking.com/', href), callback=self.parse_hotel)

    def parse_hotel(self, response):
        yield {
            'name2': response.css('.hp__hotel-name').extract_first()
        }
