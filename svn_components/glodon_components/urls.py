from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from django.conf import settings
from django.conf.urls.static import static
from glodon_components.dashboard.project import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'glodon_components.views.home', name='home'),
    # url(r'^glodon_components/', include('glodon_components.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index, name='home_page'),
    url(r'^app', views.home, name='home_page'),
    url(r'^signin$', views.signin, name='signin'),
    url(r'^login$', views.login, name='login_page'),
    url(r'^logout$', views.logout, name='login_page'),
    url(r'^user$', views.user, name='user'),
    url(r'^zones$', views.zones, name='zones'),
    url(r'^admin/', include('glodon_components.dashboard.admin.urls', namespace='admin')),
    url(r'^project/', include('glodon_components.dashboard.project.urls', namespace='project'))
)

urlpatterns += staticfiles_urlpatterns()