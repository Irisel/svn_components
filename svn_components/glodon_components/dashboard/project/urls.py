from django.conf.urls import patterns, url
from glodon_components.dashboard.project import views
COMPONENT = r'/(?P<component_id>[^/]+)/%s$'


urlpatterns = patterns('',
    url(r'components_list$', views.components_list, name='components_list'),
    url(r'orders_list$', views.orders_list, name='orders_list'),
    url(r'users_list$', views.users_list, name='users_list'),
    url(COMPONENT % 'detail', views.components_detail, name='components_detail')
)
