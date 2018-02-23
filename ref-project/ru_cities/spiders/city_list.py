# -*- coding: utf-8 -*-
import scrapy

url = 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%BE%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8'

class CityListSpider(scrapy.Spider):
    name = 'city_list'
    allowed_domains = ['ru.wikipedia.org']
    def start_requests(self):
        yield scrapy.Request(url=url, callback=self.parse, headers={
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': url,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
        })

    def parse(self, response):
        for city in response.css('table.standard tr'):
            yield {
                'name': city.css('td:nth-child(3) a::text').extract_first(),
                'page': city.css('td:nth-child(3) a::attr(href)').extract_first(),
                'pop': city.css('td:nth-child(6)::text').extract_first(),
                'founded_y': city.css('td:nth-child(7) a::text').extract_first()
            }
