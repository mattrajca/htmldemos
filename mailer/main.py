#!/usr/bin/env python

from google.appengine.api import mail
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
import os

# place your name and email below in the format: NAME <EMAIL>
ADDRESSEE = ""

class SendMessageHandler(webapp.RequestHandler):
	def post(self):
		mail.send_mail(sender=ADDRESSEE,to=ADDRESSEE,subject="Website Feedback",body=self.request.body)


class MainHandler(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
		self.response.out.write(template.render(path, { } ))


def main():
	application = webapp.WSGIApplication([
								('/', MainHandler),
								('/sendMessage', SendMessageHandler)], debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
