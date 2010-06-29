#!/usr/bin/env python

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
import os

PASSWORD = "apple"

class Visit(db.Model):
    date = db.DateTimeProperty(auto_now_add=True)
    user_agent = db.StringProperty()
    ip_address = db.StringProperty()
    language = db.StringProperty()
    screen_size = db.StringProperty()
    color_depth = db.StringProperty()
    cookies_enabled = db.StringProperty()
    java_enabled = db.StringProperty()


class LogVisitHandler(webapp.RequestHandler):
    def post(self):
        new_visit = Visit()
        new_visit.user_agent = self.request.get('ua')
        new_visit.ip_address = self.request.remote_addr
        new_visit.language = self.request.get('l')
        new_visit.screen_size = self.request.get('ss')
        new_visit.color_depth = self.request.get('cd')
        new_visit.cookies_enabled = self.request.get('ce')
        new_visit.java_enabled = self.request.get('je')
        new_visit.put()


class VisitsHandler(webapp.RequestHandler):
    def get(self):
        visits = db.GqlQuery("SELECT * FROM Visit ORDER BY date DESC")
        
        if visits.count() == 0:
            visits = None
        
        path = os.path.join(os.path.dirname(__file__), 'templates', 'visits.html')
        self.response.out.write(template.render(path, { 'visits' : visits } ))


class LoginHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'templates', 'login.html')
        self.response.out.write(template.render(path, { } ))


class ValidateLoginHandler(webapp.RequestHandler):
    def post(self):
        if (self.request.get('p') == PASSWORD):
            self.response.out.write("OK")
        else:
            self.response.out.write("Invalid password")


class ClearHandler(webapp.RequestHandler):
    def post(self):
        query = Visit.all()
        visits = query.fetch(1000)
        db.delete(visits)


class MainHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'templates', 'main.html')
        self.response.out.write(template.render(path, { } ))


def main():
    application = webapp.WSGIApplication([
                ('/', MainHandler),
                ('/login', LoginHandler),
                ('/validateLogin', ValidateLoginHandler),
                ('/logVisit', LogVisitHandler),
                ('/clear', ClearHandler),
                ('/visits', VisitsHandler)], debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()

