# -*- coding: utf-8 -*-
import scrapy
import json

city_names = [c['name'].lower() for c in json.load(open('./city-list-big-clean.json', 'r'))]

class HhSpider(scrapy.Spider):
    name = 'hh'
    allowed_domains = ['hh.ru']
    start_urls = ['https://hh.ru/area_switcher?from=region-clarification-dropdown&backUrl=/search/vacancy%3Farea%3D1%26only_with_salary%3Dtrue%26order_by%3Dpublication_time%26enable_snippets%3Dtrue%26clusters%3Dtrue']

    def parse(self, response):
        for city in response.css('.area-switcher-city a'):
            name = city.css('::text').extract_first()
            if name.lower() in city_names:
                yield response.follow(
                    url=city.css('::attr(href)').extract_first(),
                    meta={ 'city_name': name },
                    callback=self.parse_city)

    def parse_city(self, response):
        city_name = response.meta['city_name']
        for job in response.css('.vacancy-serp-item'):
            title = job.css('.vacancy-serp-item__title a::text').extract_first()
            salary = job.css('[itemprop=baseSalary]::attr(content)').extract_first()
            yield { 'city_name': city_name, 'title': title, 'salary': salary }
        next_page = response.css('[data-qa=pager-next]::attr(href)').extract_first()
        if next_page:
            yield response.follow(
                url=next_page,
                meta=response.meta,
                callback=self.parse_city)
