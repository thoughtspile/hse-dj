# -*- coding: utf-8 -*-
import scrapy
import json

city_names = [c['name'].lower() for c in json.load(open('./city-list-big-clean.json', 'r'))]

class WeatherSpider(scrapy.Spider):
    name = 'weather'
    allowed_domains = ['thermograph.ru']
    start_urls = ['http://thermograph.ru/']

    def parse(self, response):
        for row in response.css('table.data:first-of-type tbody tr'):
            city_name = row.css('td:nth-child(2)::text').extract_first()
            if city_name.lower() in city_names:
                yield response.follow(
                    url=row.css('td:nth-child(1) a::attr(href)').extract_first(),
                    meta={ 'city_name': city_name },
                    callback=self.parse_city)

    def parse_city(self, response):
        for td in response.css('table.data:first-of-type tbody tr td:nth-child(3) a'):
            year = td.css('::text').extract_first()
            yield response.follow(
                url=td.css('::attr(href)').extract_first(),
                callback=self.parse_year,
                meta={ 'city_name': response.meta['city_name'], 'year': year })

    def parse_year(self, response):
        for row in response.css('table.data:first-of-type tbody tr'):
            yield {
                'city_name': response.meta['city_name'],
                'year': response.meta['year'],
                'month_n': row.css('td:nth-child(1) a::text').extract_first(),
                't_avg': row.css('td:nth-child(5) a::text').extract_first(),
                'rain_mm': row.css('td:nth-child(7)::text').extract_first(),
            }
