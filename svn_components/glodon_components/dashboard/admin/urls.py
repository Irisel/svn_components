from django.conf.urls import patterns, url
from glodon_components.dashboard.admin import views

urlpatterns = patterns('',
    url(r'create_component$', views.create_component, name='create_component'),
    url(r'rent_component$', views.rent_component, name='rent_component'),
    url(r'provide_component$', views.provide_component, name='provide_component'),
    url(r'return_component$', views.return_component, name='return_component'),
    url(r'update_user$', views.update_user, name='update_user')
)
