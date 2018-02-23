# -*- coding: utf-8 -*-
import scrapy


class UniSpider(scrapy.Spider):
    name = 'uni'
    allowed_domains = ['vuzopedia.ru']
    start_urls = ['http://vuzopedia.ru/vuz/?page=' + str(p) for p in range(1, 62)]

    def parse(self, response):
        for uni in response.css('.itemVuz'):
            yield response.follow(
                url=uni.css('a::attr(href)').extract_first(),
                callback=self.parse_uni,
                meta={
                    'name': uni.css('.itemVuzTitle::text').extract_first().strip(),
                    'qty': uni.css('.info:nth-child(2) .tooltipq::text').extract_first(),
                    'price': uni.css('.info:nth-child(3) .tooltipq::text').extract_first(),
                    'exam': uni.css('.info:nth-child(4) .tooltipq::text').extract_first()
                })

    def parse_uni(self, response):
        data = { k: response.meta[k] for k in response.meta if k in ['name', 'qty', 'price', 'exam'] }
        data['city'] = response.css('.choosecity span::text').extract_first().strip()
        data['addr'] = response.css('.specnoqqwe div:nth-child(2)::text').extract_first().strip()
        yield data
