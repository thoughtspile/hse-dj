# -*- coding: utf-8 -*-
import scrapy
import urllib.parse


class RubooksSpider(scrapy.Spider):
    name = 'rubooks'
    allowed_domains = ['rubooks.org']
    start_urls = ['http://rubooks.org/book.php?book=20836']

    def parse(self, response):
        yield { 'page': '\n\n'.join(response.css('#texts *::text').extract()) }
        next_url = response.xpath("//*[@class='nex']/../@href").extract_first()
        if next_url:
            abs_next_url = urllib.parse.urljoin('http://rubooks.org', next_url)
            yield scrapy.Request(url=abs_next_url, callback=self.parse)
