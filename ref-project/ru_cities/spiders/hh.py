# -*- coding: utf-8 -*-
import scrapy
import json

city_names = [c['name'].lower() for c in json.load(open('./city-list-big-clean.json', 'r'))]

class HhSpider(scrapy.Spider):
    name = 'hh'
    allowed_domains = ['hh.ru', 'headhunter.ge']
    start_urls = ['https://tbilisi.headhunter.ge/area_switcher?backUrl=/search/vacancy%3Farea%3D2758%26only_with_salary%3Dtrue%26order_by%3Dpublication_time%26enable_snippets%3Dtrue%26customDomain%3D1%26clusters%3Dtrue']

    def parse(self, response):
        for city in response.css('.area-switcher-city a'):
            name = city.css('::text').extract_first()
            if name.lower() in city_names:
            # if name.lower() == 'екатеринбург':
                yield response.follow(
                    url=city.css('::attr(href)').extract_first(),
                    meta={ 'city_name': name },
                    callback=self.parse_city)

    def parse_city(self, response):
        city_name = response.meta['city_name']
        for spec in response.xpath('//*[@data-toggle="professionalArea"]/following-sibling::node()//li/a'):
            yield response.follow(
                url=spec.css('::attr(href)').extract_first(),
                callback=self.parse_city_spec,
                meta={
                    'city_name': city_name,
                    'spec': spec.css('.clusters-value__name::text').extract_first(),
                    'spec_count': spec.css('.clusters-value__count::text').extract_first()
                })


    def parse_city_spec(self, response):
        city_name = response.meta['city_name']
        spec = response.meta['spec']
        spec_count = response.meta['spec_count']
        for job in response.css('.vacancy-serp-item'):
            title = job.css('.vacancy-serp-item__title a::text').extract_first()
            salary = job.css('[itemprop=baseSalary]::attr(content)').extract_first()
            salary_curr = job.css('[itemprop=salaryCurrency]::attr(content)').extract_first()
            employer = job.css('[data-qa=vacancy-serp__vacancy-employer]::text').extract_first()
            metro_station = job.css('.metro-station::text').extract_first()
            yield {
                'city_name': city_name,
                'spec': spec,
                'spec_count': spec_count,
                'title': title,
                'salary': salary,
                'salary_curr': salary_curr,
                'employer': employer,
                'metro_station': metro_station
            }
        next_page = response.css('[data-qa=pager-next]::attr(href)').extract_first()
        if next_page:
            yield response.follow(
                url=next_page,
                meta=response.meta,
                callback=self.parse_city_spec)
