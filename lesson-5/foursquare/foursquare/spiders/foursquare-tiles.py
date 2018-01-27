import scrapy
import json

def make_url(n, e, s, w):
    sw = str(s) + "%2C" + str(w)
    ne = str(n) + "%2C" + str(e)
    return "https://api.foursquare.com/v2/search/recommendations?locale=en&explicit-lang=false&v=20180124&m=foursquare&query=Coffee&limit=3000&mode=mapRequery&sw=" + sw + "&ne=" + ne + "&wsid=FQP0B4VTIIBYYQY0DEKKO0RYT0DRIO&oauth_token=QEJ4AQPTMMNB413HGNZ5YDMJSHTOHZHMLZCAQCCLXIX41OMP"

rect = [[45.2, 45.6], [9.1, 9.2]]
step = 0.01
s = rect[0][0]
urls = []
while s < rect[0][1]:
    urls.append(make_url(s + step, rect[1][1], s, rect[1][0]))
    s += step

class FoursquareSpider(scrapy.Spider):
    name = "foursquare"
    def start_requests(self):
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse, headers={
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9,ru;q=0.8,es;q=0.7",
                "cache-control": "no-cache",
                "cookie": "bbhive=FQP0B4VTIIBYYQY0DEKKO0RYT0DRIO%3A%3A1578069475; __utmz=51454142.1514997475.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmc=51454142; __gads=ID=9331b14d6cc8f8b4:T=1516627318:S=ALNI_MY84aqQmu2Rve2vXUQhEZZVGre57A; __utma=51454142.1573037821.1514997475.1516627196.1516898519.3; __utmt=1; __utmb=51454142.4.10.1516898519",
                "pragma": "no-cache",
                "referer": "https://api.foursquare.com/xdreceiver.html?parent=https%3A%2F%2Ffoursquare.com%2Fexplore%3Fmode%3Durl%26ne%3D45.490404%252C9.175258%26q%3DCoffee%26sw%3D45.454953%252C9.149594",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
                "x-requested-with": "XMLHttpRequest"
            })

    def parse(self, response):
        yield json.loads(response.body)
