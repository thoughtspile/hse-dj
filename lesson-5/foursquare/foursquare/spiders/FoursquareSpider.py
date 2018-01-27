import scrapy
import json

url = "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20171211&m=foursquare&query=Coffee&mode=mapRequery&limit=300&sw=51.57109501333098%2C39.162654876708984&ne=51.76635260726088%2C39.23097610473633&wsid=I5QAXKZRL3P3OLOG5GB0UOLPZSGUWE&oauth_token=QEJ4AQPTMMNB413HGNZ5YDMJSHTOHZHMLZCAQCCLXIX41OMP"

class FoursquareSpider(scrapy.Spider):
    name = "foursquare"
    def start_requests(self):
        yield scrapy.Request(url=url, callback=self.parse, headers={
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://api.foursquare.com/xdreceiver.html?parent=https%3A%2F%2Ffoursquare.com%2Fexplore%3Fmode%3Durl%26near%3DVoronezh%252C%2520Russia%26nearGeoId%3D72057594038399981%26q%3DCoffee'
        })

    def parse(self, response):
        yield json.loads(response.body)
